const Subject = require("../models/subjectModel")
const { validateSubject } = require("../validations/subjectValidation")

const addSubject = async (req, res) => { // Add subject
    const {error} = validateSubject(req.body)
    if(error) return res.status(400).json({status:400, error: error.details[0].message, message: error.details[0].message})

    try{
        const subject = new Subject(req.body);
        const result = await subject.save();
        res.status(200).json({status:200, data: result, message: "Subject added successfully"});
    } catch(err) {
        res.status(500).json({status:500, error: `An error occurred while adding subject: ${err}`, message: `An error occurred while adding subject: ${err}`})
    }
}

module.exports = {addSubject}