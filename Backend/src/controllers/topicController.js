const Topic = require("../models/topicModel");
const {validateTopic} = require("../validations/topicValidation")

const addTopic = async (req, res) => { // Add topic
    const {error} = validateTopic(req.body)
    if(error) return res.status(400).json({status:400, error: error.details[0].message, message: error.details[0].message})

    try{
        const newTopic = new Topic(req.body);
        const saveTopic = await newTopic.save();
        res.status(200).json({status:200, data: saveTopic, message: "Topic added successfully."});
    } catch(err) {
        res.status(500).json({status:500, error: `An error occurred while adding topic: ${err}`, message: `An error occurred while adding topic: ${err}`})
    }
}

module.exports = {addTopic}