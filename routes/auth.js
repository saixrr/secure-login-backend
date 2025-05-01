import express from 'express';
import { register, getChallenge, verify, getallUsers } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/get-challenge', getChallenge);
router.post('/verify-signature', verify);
router.get('/users',getallUsers)

export default router;
