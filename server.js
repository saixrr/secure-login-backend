import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import { connectToDB } from './db/connect.js';

dotenv.config(); // load .env

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);

connectToDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
