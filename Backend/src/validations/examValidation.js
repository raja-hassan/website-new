const Joi = require("joi")

const validateExam = (data) => { //dont make any change in this schema
    const schema = Joi.object({
        user: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
        subject: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(), // At least one subject should be selected
        topics: Joi.string().optional().allow(''),
        level: Joi.number().optional().allow(''),
        totalScore:Joi.number().optional().allow(''),
        obtainedScore:Joi.number().optional().allow(''),
        isCompleted:Joi.boolean().optional().allow(''),
    })
    return schema.validate(data);
}
module.exports = { validateExam }