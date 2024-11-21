const Question = require("../models/questionModel");
const {validateQuestion} = require("../validations/questionValidation")

const addQuestion = async (req, res) => { // Add topic
    const {error} = validateQuestion(req.body)
    if(error) return res.status(400).json({status:400, error: error.details[0].message, message: error.details[0].message})

    try{
        const question = req.body
        const newQuestion = new Question(question);
        const saveTopic = await newQuestion.save();
        res.status(200).json({status:200, data: saveTopic, message: "Question is added successfully"});
    } catch(err) {
        res.status(500).json({status:500, error: `An error occurred while adding topic: ${err}`, message: `An error occurred while adding topic: ${err}`})
    }
}

module.exports = {addQuestion}