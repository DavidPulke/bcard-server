const Joi = require("joi")

const registerSchema = Joi.object({
    // name
    name: Joi.object({
        first: Joi.string().required().min(2).max(256),
        middle: Joi.string().max(256).allow(""),
        last: Joi.string().required().min(2).max(256),
    }),

    // phone
    phone: Joi.string().required().pattern(/^(\+972|0)([23489])\d{7}$|^(\+972|0)5[012345689]\d{7}$/),

    // email
    email: Joi.string().required().email(),

    // password
    password: Joi.string().required().min(7).max(20),

    // image
    image: Joi.object({
        url: Joi.string().min(14),
        alt: Joi.string().min(2).max(256),
    }),

    // address
    address: Joi.object({
        state: Joi.string().max(256),
        country: Joi.string().required().min(2).max(256),
        city: Joi.string().required().min(2).max(256),
        street: Joi.string().required().min(2).max(256),
        houseNumber: Joi.string().required().max(256),
        zip: Joi.string().required().min(2).max(256),
    }),

    // isBusiness
    isBusiness: Joi.boolean().required()
});


module.exports = registerSchema;