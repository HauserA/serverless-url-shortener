
const Joi = require('joi');

exports.itemSchema = Joi.object({
    id: Joi.string().trim().pattern(/^[\w\-]+$/i).required(),
    url: Joi.string().trim().uri({
      scheme: [
        /http?/,
        /https?/,
      ],
    }).required(),
    password: Joi.string().trim().pattern(/^[\w\-]+$/i).required(),
});
