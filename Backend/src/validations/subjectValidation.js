const Joi = require("joi")

const validateSubject = (data) => {
    const schema = Joi.object({
        name: Joi.string().trim().min(3).required(),
        code: Joi.string().trim().min(2).required(),
    })
    return schema.validate(data);
}
module.exports = { validateSubject }