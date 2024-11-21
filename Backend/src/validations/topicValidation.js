const Joi = require("joi")

const validateTopic = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(255).required(),
        description: Joi.string().max(2000).optional().allow(''),
        createdBy:Joi.string().required().regex(/^[0-9a-fA-F]{24}$/), // Must be a valid ObjectId (for user/admin)
        subjects: Joi.array()
            .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)) // Must be valid ObjectId
            .required(), // At least one subject should be selected
    })
    return schema.validate(data);
}
module.exports = { validateTopic }