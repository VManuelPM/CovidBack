const Joi = require('@hapi/joi');

//Register Validation
const registerValidation = data => {
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

//Login Validation
const loginValidation = data => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

//Covid Form Validation
const covidValidation = data => {
  const schema = Joi.object({
    country: Joi.string().required(),
    country_code: Joi.string().required(),
    continent: Joi.string().required(),
    population: Joi.number().required(),
    indicator: Joi.string().required(),
    weekly_count: Joi.number().required(),
    rate_14_day: Joi.number().required(),
    cumulative_count: Joi.number().required(),
    source: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.covidValidation = covidValidation;
