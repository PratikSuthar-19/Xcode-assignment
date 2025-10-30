import * as authService from '../services/authService.js';

export async function signup(req, res, next) {
  try {
    const { email, password, name } = req.body;
    const user = await authService.signup({ email, password, name });
    return res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    return res.json(result);
  } catch (err) {
    next(err);
  }
}
