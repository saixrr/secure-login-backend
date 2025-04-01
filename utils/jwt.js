import jwt from 'jsonwebtoken';

const JWT_SECRET = 'super_secure_key'; // 👉 Move to .env in real apps

export const generateToken = (username) => {
  return jwt.sign({ username }, JWT_SECRET, { expiresIn: '2h' });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
