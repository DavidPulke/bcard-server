const Joi = require('joi');

const cardSchema = Joi.object({
    title: Joi.string().min(2).max(256).required(),
    subtitle: Joi.string().min(2).max(256).required(),
    description: Joi.string().min(2).max(1024).required(),
    phone: Joi.string().min(9).max(11).required(),
    email: Joi.string().min(5).max(40).email().required(),
    web: Joi.string().uri().optional(),
    image: Joi.object({
        url: Joi.string().uri().optional(),
        alt: Joi.string().optional()
    }),
    address: Joi.object({
        state: Joi.string().optional(),
        country: Joi.string().required(),
        city: Joi.string().required(),
        street: Joi.string().required(),
        houseNumber: Joi.number().required(),
        zip: Joi.number().optional()
    })
});

module.exports = cardSchema;