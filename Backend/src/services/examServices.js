const mongoose = require("mongoose")
const { ObjectId } = mongoose.Types
const Exam = require("../models/examModel")

const sendResponse = (res, status, message, data=null, error=null) => { // common response function
    res.status(status).json({
        status,
        ...(data && {data}),
        ...(error && {error}),
        message
    })
}

const hideCorrectAnswer = (exam) => {// Helper to remove correct answers from options
    return exam.questions.map((question) => {
        const filteredOptions = question.options.map(({ opID, opText }) => {
            return { opID, opText }; // Only return the opID and opText, excluding 'correct'
        });
        return { ...question.toObject(), options: filteredOptions }; // Update options in the returned object
    });
};

const getExam = async (req, res) => {    // get exam listing
    try{
        const exams = await Exam.find({ user: new ObjectId( req.query.user) }).populate('subject').populate({path:'topics', select:'name'}).exec();
        if (exams.length > 0){
            return sendResponse(res, 200, "Exam listing", exams, null)
        }
        else    return sendResponse(res, 404, "No exam found", "No exam found")

    } catch(err) {
        return sendResponse(res, 500, `An error occurred while getting exams: ${err}`, null, `An error occurred while getting exams: ${err}`)
    }
}

const startExam = async (req, res) => {    // start exam listing
    try{
        const exams = await Exam.findById(req.query.id).populate({path:'questions', select:'title options'});
        if (exams){
            const filteredQuestion = hideCorrectAnswer(exams);
            return sendResponse(res, 200, "Exam Start", filteredQuestion, null)
        }
        else    return sendResponse(res, 404, "No exam found", "No exam found")

    } catch(err) {
        return sendResponse(res, 500, `An error occurred while getting exams: ${err}`, null, `An error occurred while getting exams: ${err}`)
    }
}

const submitExam = async (req, res) => {
    const {examId, answers} = req.body;

    try{
        const exam = await Exam.findById(examId).populate("subject topics questions") // retrieving exam from database
        if(!exam) return res.status(404).json({ status: 404, error: `Exam not found`, message: `The exam ID provided does not exist` });

        let obtainedScore = 0;
        exam.questions.forEach((question)=>{ //Processing each question to calculate score
            const userAnswer = answers.find(ans => ans.questionId.toString() === question._id.toString())
            if(userAnswer) {
                const correctOption = question.options.find(opt => opt.correct)
                if(correctOption && userAnswer.selectedOptionId === correctOption.opID) obtainedScore += 1
            }
        })
        exam.obtainedScore = obtainedScore
        exam.isCompleted = true
        await exam.save()
        res.status(200).json({
            status: 200,
            data: { totalScore: exam.totalScore, obtainedScore, isCompleted: exam.isCompleted, subject:exam.subject, topics: exam.topics },
            message: "Exam submitted successfully",
        });
    } catch(err){
        console.log(err);
        res.status(500).json({
            status: 500,
            error: `An error occurred while submitting the exam: ${err}`,
            message: `An error occurred while submitting the exam`,
        });
    }

}

module.exports = {getExam, startExam, submitExam}