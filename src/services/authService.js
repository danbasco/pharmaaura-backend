import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const signToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
};

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


const validatePassword = (password) => {

    if (/\s/.test(password)) {
        return { valid: false, message: "Password must not contain spaces." };
    }

    // 2) accented or non-ASCII characters
    if (/[^\x00-\x7F]/.test(password)) {
        return { valid: false, message: "Password must not contain accented or non-ASCII characters." };
    }

    // 3) characters not allowed (only A-Za-z0-9 and @$!%*?&_. allowed)
    const allowedRegex = /^[A-Za-z\d@$!%*?&_.]+$/;
    if (!allowedRegex.test(password)) {
        return { valid: false, message: "Password contains invalid characters. Allowed: letters, numbers, and @ $ ! % * ? & _ ." };
    }

    // 4) length
    if (password.length < 8) {
        return { valid: false, message: "Password must be at least 8 characters long." };
    }

    // 5) composition requirements
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[@$!%*?&_.]/.test(password)) {
        return { valid: false, message: "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character (@ $ ! % * ? & _ .)." };
    }

    return { valid: true };
}

export const register = async ({ name, email, password, phone = "", address = ""}) => {

  const exists = await User.findOne({ email });

  const passwordValidation = validatePassword(password);

  if (!isValidEmail(email)) {
    throw Object.assign(new Error('Invalid email format'), { status: 400 });
  }

  if (!passwordValidation.valid) {
    throw Object.assign(new Error(passwordValidation.message), { status: 400 });
  }

  if(!name || !email || !password) {
    throw Object.assign(new Error('Name, email, and password are required'), { status: 400 });
  }

  if (exists) throw Object.assign(new Error('Email already registered'), { status: 409 });

  const hash = await bcrypt.hash(password, await bcrypt.genSalt(10));
  const user = await User.create({ name, email, password: hash, phone, address });

  const token = signToken(user);

  return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
};

export const login = async ({ email, password }) => {

  const user = await User.findOne({ email });

  if(!email || !password) {
    throw Object.assign(new Error('Email and password are required'), { status: 400 });
  }

  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 400 });
  const match = await bcrypt.compare(password, user.password);

  if (!match) throw Object.assign(new Error('Invalid credentials'), { status: 400 });
  const token = signToken(user);

  return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
};
