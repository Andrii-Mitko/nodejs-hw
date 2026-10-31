import { Joi, Segments } from 'celebrate';

// Email приводимо до нижнього регістру, celebrate підставить його в req.body
const email = Joi.string().email().lowercase().required();

export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    email,
    password: Joi.string().min(8).required(),
  }),
};

export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    email,
    password: Joi.string().required(),
  }),
};

export const requestResetEmailSchema = {
  [Segments.BODY]: Joi.object({
    email,
  }),
};

export const resetPasswordSchema = {
  [Segments.BODY]: Joi.object({
    password: Joi.string().min(8).required(),
    token: Joi.string().required(),
  }),
};
