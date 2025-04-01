import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import { connectToDB } from './db/connect.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
connectToDB()

app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
