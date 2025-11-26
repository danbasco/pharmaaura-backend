import express from 'express';
const router = express.Router();
import Joi from 'joi';
import validate from '../middleware/validate.js';
import * as authController from '../controllers/authController.js';

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().allow('', null),
  address: Joi.string().allow('', null)
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

export default router;
