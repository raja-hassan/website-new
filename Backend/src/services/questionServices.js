const mongoose = require("mongoose");
const Question = require("../models/questionModel")

const sendResponse = (res, status, message, data=null, error=null) => { // common response function
    res.status(status).json({
        status,
        ...(data && {data}),
        ...(error && {error}),
        message
    })
}

const hideCorrectAnswer = (questions) => {// Helper to remove correct answers from options
    return questions.map((question) => {
        const filteredOptions = question.options.map(({ opID, opText }) => {
            return { opID, opText }; // Only return the opID and opText, excluding 'correct'
        });
        return { ...question.toObject(), options: filteredOptions }; // Update options in the returned object
    });
};

const fetchQuestionById = async (id, res) => {
    try{
        if(!mongoose.Types.ObjectId.isValid(id))    return sendResponse(res, 400, "Invalid question ID", null, "Invalid question ID")

        const question = await Question.findById(id);

        if(question){
            const filteredQuestion = hideCorrectAnswer(question);
            return sendResponse(res, 200, "question found by ID", filteredQuestion, null)

        }
        else    return sendResponse(res, 404, "No question found", null, "No question found")

    } catch(err) {
        return sendResponse(res, 500, `An error occurred while getting question: ${err}`, null, `An error occurred while getting question: ${err}`)
    }
}

const fetchQuestionByQuery = async (searchQuery, res) => {

    try{
        const searchCondition = {
            $or: [
                {title: { $regex: searchQuery, $options: 'i'}},
                {level: { $regex: searchQuery, $options: 'i'}},
                {subjects: { $regex: searchQuery, $options: 'i'}},
                {topics: { $regex: searchQuery, $options: 'i'}},
                {createdBy: { $regex: searchQuery, $options: 'i'}},
            ]
        };

        const question = await Question.find(searchCondition);

        if(question.length > 0){
            const filteredQuestion = hideCorrectAnswer(question);
            return sendResponse(res, 200, "question found matching the criteria", filteredQuestion, null)
        }
        else    return sendResponse(res, 404, "No question found matching the criteria", null, "No question found matching the criteria")

    } catch (err) {
        return sendResponse(res, 500, `An error occurred while searching questions: ${err}`, null, `An error occurred while searching questions: ${err}`)
    }
}

const getQuestion = async (req, res) => {    // get questions listing
    try{
        const searchQuery = req.query.query // Getting the search query
        const questionId = req.params.id // Getting the question id

        if(questionId){ // Case I Fetching a question by ID if it's provided in the URL
            return fetchQuestionById(questionId, res);
        }

        if(searchQuery){ // Case II Performing a search if a query parameter is provided
            return fetchQuestionByQuery(searchQuery, res);
        }

        //Case III Fetching all questions if no ID or query is provided
        const questions = await Question.find().populate('subjects topics').exec();

        if (questions.length > 0){
            const filteredQuestion = hideCorrectAnswer(questions);
            return sendResponse(res, 200, "Questions listing", filteredQuestion, null)
        }
        else    return sendResponse(res, 404, "No question found", "No question found")

    } catch(err) {
        return sendResponse(res, 500, `An error occurred while getting questions: ${err}`, null, `An error occurred while getting questions: ${err}`)
    }
}

const updateQuestion = async (req, res) => { // update question by ID
    try{
        const result = await Question.updateOne (
            {_id:req.params.id},
            {$set: req.body}
        )
        return res.status(200).send(result)
    } catch (err) {
        return res.status(500).send(`An error has occurred while updating question: ${err}`)
    }
}

const deleteQuestion = async (req, res) => { // delete question by ID
    try{
        const result = await Question.deleteOne ({_id:req.params.id})
        return res.status(200).send(result)
    } catch (err) {
        return res.status(500).send(`An error has occurred while deleting question: ${err}`)
    }
}

module.exports = {
    getQuestion, updateQuestion, deleteQuestion
}