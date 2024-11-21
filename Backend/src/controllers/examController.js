const mongoose = require("mongoose")
const { ObjectId } = mongoose.Types
const Exam = require("../models/examModel");
const Question = require("../models/questionModel")
const { validateExam } = require("../validations/examValidation")

const addExam = async (req, res) => { // Add topic
    const {error} = validateExam(req.query)
    if(error) return res.status(400).json({status:400, error: error.details[0].message, message: error.details[0].message})
    const {user, subject, topics, level } = req.query
    const query = req.query
    let topicsArray = [];
    if (topics) {
        topicsArray = topics.split(',').map(id => new ObjectId(id));
    }
    try{
        const questionQuery = {
            subjects: new ObjectId(subject),
            ...(topics && {topics: { $in: topicsArray }}),
            ...(level && { level: parseInt(level, 10) })
        }
        const question = await Question.find(questionQuery);

        if(question.length === 0){
            return res.status(200).json({status:204, error: ``, message: `No question found for the given criteria`})
        }
        const examObj = {
            user: new ObjectId(user),
            subject: subject,
            topics: topicsArray,
            level: parseInt(level, 10) || null,
            questions:question,
            isCompleted:false,
            totalScore:question.length,
            obtainedScore:0
        }
        const newExam = new Exam(examObj);
        const saveExam = await newExam.save();
        res.status(200).json({status:200, data: saveExam, message: "Exam is added successfully"});
    } catch(err) {
        console.log(err)
        res.status(500).json({status:500, error: `An error occurred while adding Exam: ${err}`, message: `An error occurred while adding Exam: ${err}`})
    }
}

module.exports = {addExam}