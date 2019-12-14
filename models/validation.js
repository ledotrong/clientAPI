const Joi = require('joi');

const registerValidation = data => {
  const schema = {
    email: Joi.string()
      .required()
      .min(6)
      .email(),
    password: Joi.string()
      .required()
      .min(6),
    role: Joi.string().required()
  };

  return Joi.validate(data, schema);
};

const loginValidation = data => {
  const schema = {
    email: Joi.string()
      .required()
      .min(6)
      .email(),
    password: Joi.string()
      .required()
      .min(6)
  };

  return Joi.validate(data, schema);
};

const updateValidation = data => {
  const schema = {
    name: Joi.string()
      .required()
      .min(6),
    email: Joi.string()
      .required()
      .min(6)
      .email(),
    password: Joi.string()
      .required()
      .min(6),
    picture: Joi.string(),
    role: Joi.string().required(),
    skills: Joi.array().required()
  };

  return Joi.validate(data, schema);
};

const addInfoValidation = data => {
  const schema = {
    name: Joi.string()
      .required()
      .min(6),
    picture: Joi.string(),
    skills: Joi.array().required(),
    address:{
      address: Joi.string().required(),
      district: Joi.string().required(),
      province: Joi.string().required()
    } 
  };

  return Joi.validate(data, schema);
};

const registerFbGgValidation = data => {
  const schema = {
    role: Joi.string().required(),
    skills: Joi.array().required(),
    address: Joi.string().required()
  };

  return Joi.validate(data, schema);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.updateValidation = updateValidation;
module.exports.addInfoValidation = addInfoValidation;
module.exports.registerFbGgValidation = registerFbGgValidation;
