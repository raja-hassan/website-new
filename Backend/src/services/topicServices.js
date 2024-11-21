const mongoose = require("mongoose");
const Topic = require("../models/topicModel")

const sendResponse = (res, status, message, data=null, error=null) => { // common response function
    res.status(status).json({
        status,
        ...(data && {data}),
        ...(error && {error}),
        message
    })
}

const fetchTopicById = async (id, res) => {
    try{
        if(!mongoose.Types.ObjectId.isValid(id))    return sendResponse(res, 400, "Invalid topic ID", null, "Invalid topic ID")

        const getTopic = await Topic.findById(id);

        if(getTopic) return sendResponse(res, 200, "topic found by ID", getTopic, null)
        else    return sendResponse(res, 404, "No topic found", null, "No topic found")

    } catch(err) {
        return sendResponse(res, 500, `An error occurred while getting topic: ${err}`, null, `An error occurred while getting topic: ${err}`)
    }
}

const fetchTopicBySubject = async (id, res) => {
    try{
        if(!mongoose.Types.ObjectId.isValid(id))    return sendResponse(res, 400, "Invalid topic ID", null, "Invalid topic ID")

        const getTopic = await Topic.find({ subjects: { $in: [id] } });
        if(getTopic.length>0) return sendResponse(res, 200, "topic found by subject", getTopic, null)
        else return sendResponse(res, 404, "No topic found by given subject", null, "No topic found by given subject")

    } catch(err) {
        return sendResponse(res, 500, `An error occurred while getting topic: ${err}`, null, `An error occurred while getting topic: ${err}`)
    }
}

const fetchTopicByQuery = async (searchQuery, res) => {

    try{
        const searchCondition = {
            $or: [
                {name: { $regex: searchQuery, $options: 'i'}},
                {subCode: { $regex: searchQuery, $options: 'i'}},
            ]
        };

        const getTopic = await Topic.find(searchCondition);

        if(getTopic.length > 0)     return sendResponse(res, 200, "topic found matching the criteria", getTopic, null)
        else    return sendResponse(res, 404, "No topic found matching the criteria", null, "No topic found matching the criteria")

    } catch (err) {
        return sendResponse(res, 500, `An error occurred while searching topics: ${err}`, null, `An error occurred while searching topics: ${err}`)
    }
}

const getTopic = async (req, res) => {    // get topics listing
    try{
        const searchQuery = req.query.query // Getting the search query
        const topicId = req.params.id // Getting the topic id
        const subjectId = req.query.subject // Getting the topic id
        if(topicId){ // Case I Fetching a topic by ID if it's provided in the URL
            return fetchTopicById(topicId, res);
        }

        if(searchQuery){ // Case II Performing a search if a query parameter is provided
            return fetchTopicByQuery(searchQuery, res);
        }

        if (subjectId) { // Case III: Filtering topics by subject ID
            return fetchTopicBySubject(subjectId, res)
        }

        //Case IV Fetching all topics if no ID or query is provided
        const topics = await Topic.find().populate('subjects createdBy').exec();

        if (topics.length > 0)    return sendResponse(res, 200, "Topics listing", topics, null)
        else    return sendResponse(res, 404, "No topic found", "No topic found")

    } catch(err) {
        return sendResponse(res, 500, `An error occurred while getting topics: ${err}`, null, `An error occurred while getting topics: ${err}`)
    }
}

const updateTopic = async (req, res) => { // update topic by ID
    try{
        const result = await Topic.updateOne (
            {_id:req.params.id},
            {$set: req.body}
        )
        return res.status(200).send(result)
    } catch (err) {
        return res.status(500).send(`An error has occurred while updating topic: ${err}`)
    }
}

const deleteTopic = async (req, res) => { // delete topic by ID
    try{
        const result = await Topic.deleteOne ({_id:req.params.id})
        return res.status(200).send(result)
    } catch (err) {
        return res.status(500).send(`An error has occurred while deleting topic: ${err}`)
    }
}

module.exports = {
    getTopic, updateTopic, deleteTopic
}