import mongoose from 'mongoose';

const MONGO_URI = 'mongodb+srv://forfunsake04:VuMLpQZ9hI5i6ua3@fsuplayers.nzbrr8s.mongodb.net/securelogin';

export const connectToDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'securelogin', // Optional, but good for clarity
    });
    console.log('✅ Connected to MongoDB (securelogin DB)');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
};
