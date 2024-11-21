const mongoose = require("mongoose");
const Subject = require("../models/subjectModel")

const sendResponse = (res, status, message, data=null, error=null) => { // common response function
    res.status(status).json({
        status,
        ...(data && {data}),
        ...(error && {error}),
        message
    })
}

const fetchSubjectById = async (id, res) => {
    try{
        if(!mongoose.Types.ObjectId.isValid(id))    return sendResponse(res, 400, "Invalid subject ID", null, "Invalid subject ID")

        const subject = await Subject.findById(id);

        if(subject) return sendResponse(res, 200, "subject found by ID", subject, null)
        else    return sendResponse(res, 404, "No subject found", null, "No subject found")

    } catch(err) {
        return sendResponse(res, 500, `An error occurred while getting subject: ${err}`, null, `An error occurred while getting subject: ${err}`)
    }
}

const fetchSubjectByQuery = async (searchQuery, res) => {

    try{
        const searchCondition = {
            $or: [
                {name: { $regex: searchQuery, $options: 'i'}},
                {code: { $regex: searchQuery, $options: 'i'}},
            ]
        };

        const subjects = await Subject.find(searchCondition);

        if(subjects.length > 0)     return sendResponse(res, 200, "subject found matching the criteria", subjects, null)
        else    return sendResponse(res, 404, "No subject found matching the criteria", null, "No subject found matching the criteria")

    } catch (err) {
        return sendResponse(res, 500, `An error occurred while searching subjects: ${err}`, null, `An error occurred while searching subjects: ${err}`)
    }
}

const getSubject = async (req, res) => {    // get subjects listing
    try{
        const searchQuery = req.query.query // Getting the search query
        const subjectId = req.params.id // Getting the subject id

        if(subjectId){ // Case I Fetching a subject by ID if it's provided in the URL
            return fetchSubjectById(subjectId, res);
        }

        if(searchQuery){ // Case II Performing a search if a query parameter is provided
            return fetchSubjectByQuery(searchQuery, res);
        }

        //Case III Fetching all subjects if no ID or query is provided
        const subjects = await Subject.find();

        if (subjects.length > 0)    return sendResponse(res, 200, "Subjects listing", subjects, null)
        else    return sendResponse(res, 404, "No subject found", "No subject found")

    } catch(err) {
        return sendResponse(res, 500, `An error occurred while getting subjects: ${err}`, null, `An error occurred while getting subjects: ${err}`)
    }
}

const updateSubject = async (req, res) => { // update subject by ID
    try{
        const result = await Subject.updateOne (
            {_id:req.params.id},
            {$set: req.body}
        )
        return res.status(200).send(result)
    } catch (err) {
        return res.status(500).send(`An error has occurred while updating subject: ${err}`)
    }
}

const deleteSubject = async (req, res) => { // delete subject by ID
    try{
        const result = await Subject.deleteOne ({_id:req.params.id})
        return res.status(200).send(result)
    } catch (err) {
        return res.status(500).send(`An error has occurred while deleting subject: ${err}`)
    }
}

module.exports = {
    getSubject, updateSubject, deleteSubject
}