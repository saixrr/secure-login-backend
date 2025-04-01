import mongoose from 'mongoose';

export const connectToDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/securelogin', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
};
