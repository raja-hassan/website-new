const Joi = require("joi")

const validateUser = (data, isRegistration) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': 'Name is required',
        }),
        email: Joi.string().email().required().messages({
            'string.email': 'Please provide a valid email address',
            'string.empty': 'Email is required',
        }),
        password: Joi.string().min(6).required().messages({
            'string.min': 'Password must be at least 6 characters long',
            'string.empty': 'Password is required',
        }),
        userName: Joi.string().required().trim().min(3).messages({
            'string.min':'Username must be at least 3 characters long',
            'string.empty':'Username is required'
        }),
        role: Joi.string().valid('admin', 'user')
        .when('$isRegistration', { is: false, then: Joi.required() }) // Required for user creation, optional for registration
        .messages({
            'string.empty': 'User role is required',
        }),
        role: Joi.string()
            .valid('admin', 'user')
            .when('$isRegistration', { is: true, then: Joi.optional().default('user'), otherwise: Joi.required() })
            .messages({
                'string.empty': 'User role is required',
                'any.only': 'Role must be either admin or user',
            }),
    })
    return schema.validate(data, { context: { isRegistration } });
}
module.exports = {validateUser};
