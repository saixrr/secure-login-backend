import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    publicKey: { type: String, required: true },
    currentChallenge: {
      challenge: String,
      createdAt: Date,
      used: { type: Boolean, default: false }
    },
    createdAt: { type: Date, default: Date.now }
  });
  
export default mongoose.model('User', userSchema);
