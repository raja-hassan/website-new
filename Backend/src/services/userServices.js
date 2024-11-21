const mongoose = require("mongoose");
const User = require("../models/userModel")

const sendResponse = (res, status, message, data=null, error=null) => { // common response function
    res.status(status).json({
        status,
        ...(data && {data}),
        ...(error && {error}),
        message
    })
}

const fetchUserById = async (id, res) => {
    try{
        if(!mongoose.Types.ObjectId.isValid(id))    return sendResponse(res, 400, "Invalid user ID", null, "Invalid user ID")

        const user = await User.findById(id);

        if(user) return sendResponse(res, 200, "user found by ID", user, null)
        else    return sendResponse(res, 404, "No user found", null, "No user found")

    } catch(err) {
        return sendResponse(res, 500, `An error occurred while getting user: ${err}`, null, `An error occurred while getting user: ${err}`)
    }
}

const fetchUserByQuery = async (searchQuery, res) => {

    try{
        const searchCondition = {
            $or: [
                {name: { $regex: searchQuery, $options: 'i'}},
                {email: { $regex: searchQuery, $options: 'i'}},
            ]
        };

        const users = await User.find(searchCondition);

        if(users.length > 0)     return sendResponse(res, 200, "user found matching the criteria", users, null)
        else    return sendResponse(res, 404, "No user found matching the criteria", null, "No user found matching the criteria")

    } catch (err) {
        return sendResponse(res, 500, `An error occurred while searching users: ${err}`, null, `An error occurred while searching users: ${err}`)
    }
}

const getUser = async (req, res) => {    // get users listing
    try{
        const searchQuery = req.query.query // Getting the search query
        const userId = req.params.id // Getting the user id

        if(userId){ // Case I Fetching a user by ID if it's provided in the URL
            return fetchUserById(userId, res);
        }

        if(searchQuery){ // Case II Performing a search if a query parameter is provided
            return fetchUserByQuery(searchQuery, res);
        }

        //Case III Fetching all users if no ID or query is provided
        const users = await User.find();

        if (users.length > 0)    return sendResponse(res, 200, "users listing", users, null)
        else    return sendResponse(res, 404, "No user found", "No user found")

    } catch(err) {
        return sendResponse(res, 500, `An error occurred while getting users: ${err}`, null, `An error occurred while getting users: ${err}`)
    }
}

const updateUser = async (req, res) => { // update user by ID
    try{
        const result = await User.updateOne (
            {_id:req.params.id},
            {$set: req.body}
        )
        return res.status(200).send(result)
    } catch (err) {
        return res.status(500).send(`An error has occurred while updating user: ${err}`)
    }
}

const deleteUser = async (req, res) => { // delete user by ID
    try{
        const result = await User.deleteOne ({_id:req.params.id})
        return res.status(200).send(result)
    } catch (err) {
        return res.status(500).send(`An error has occurred while deleting user: ${err}`)
    }
}

module.exports = {
    getUser, updateUser, deleteUser
}