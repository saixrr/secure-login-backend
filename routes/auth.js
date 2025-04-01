import express from 'express';
import { register, getChallenge, verify } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/get-challenge', getChallenge);
router.post('/verify-signature', verify);

export default router;
