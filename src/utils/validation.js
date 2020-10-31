
const Joi = require('joi');

exports.itemSchema = Joi.object({
    id: Joi.string().trim().pattern(/^[\w\-]+$/i).allow('').required(),
    url: Joi.string().trim().uri({
      scheme: [
        /http?/,
        /https?/,
      ],
    }).required(),
});
