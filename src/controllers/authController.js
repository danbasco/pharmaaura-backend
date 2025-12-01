import * as authService from '../services/authService.js';

export const register = async (req, res) => {
  const data = await authService.register(req.body);
  res.status(201).json(data);
};

export const login = async (req, res) => {
  const data = await authService.login(req.body);
  res.json(data);
};
