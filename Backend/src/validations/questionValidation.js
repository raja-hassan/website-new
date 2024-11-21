const Joi = require("joi")

const validateQuestion = (data) => { //dont make any change in this schema
    const schema = Joi.object({
        title: Joi.string().min(3).max(500).required(),
        level: Joi.number().valid(0, 1, 2),
        subjects: Joi.array()
        .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)) // Must be valid ObjectId
        .required(), // At least one subject should be selected
        topics: Joi.array()
        .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)), // Must be valid ObjectId
        options: Joi.array().items(
            Joi.object({
                opID: Joi.number().required(),
                opText: Joi.string().required(),
                correct: Joi.boolean().required()
            })
        ).min(2).required(),
    })
    return schema.validate(data);
}
module.exports = { validateQuestion }