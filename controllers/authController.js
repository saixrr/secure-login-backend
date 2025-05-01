// import crypto from 'crypto'
// import { getChallengeForUser,markChallengeUsed } from '../db/users.js';
// import User from '../models/user.js';
// import { generateChallenge } from '../utils/cryptoUtils.js';

// import { generateToken } from '../utils/jwt.js';

// // Register new user & return public key
// export const register = async (req, res) => {
//     const { username, publicKey } = req.body;
  
//     if (!username || !publicKey) {
//       return res.status(400).json({ message: 'Missing username or publicKey' });
//     }
  
//     try {
//       const existingUser = await User.findOne({ username });
//       if (existingUser) {
//         return res.status(409).json({ message: 'Username already exists' });
//       }
  
//       const newUser = new User({ username, publicKey });
//       await newUser.save();
  
//       return res.status(201).json({ message: 'User registered successfully' });
//     } catch (err) {
//       console.error('❌ Registration error:', err);
//       return res.status(500).json({ message: 'Server error during registration' });
//     }
//   };


//   export const verify = async (req, res) => {
//     const { username, signature } = req.body;
  
//     if (!username || !signature) {
//       return res.status(400).json({ message: 'Missing username or signature' });
//     }
  
//     try {
//       const user = await User.findOne({ username });
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       const challengeObj = user.currentChallenge;
  
//       if (!challengeObj || challengeObj.used) {
//         return res.status(400).json({ message: 'Invalid or used challenge' });
//       }
  
//       // Optional: check if challenge is expired (older than 2 minutes)
//       const now = new Date();
//       const age = (now - new Date(challengeObj.createdAt)) / 1000;
//       if (age > 120) {
//         return res.status(400).json({ message: 'Challenge expired' });
//       }
  
//       const verifier = crypto.createVerify('sha256');
//       verifier.update(challengeObj.challenge);
//       verifier.end();
  
//       const publicKey = crypto.createPublicKey({
//         key: user.publicKey,
//         format: 'pem',
//         type: 'spki',
//       });
  
//       const isValid = verifier.verify(publicKey, Buffer.from(signature, 'hex'));
  
//       if (isValid) {
//         user.currentChallenge.used = true;
//         await user.save();
  
//         const token = generateToken(username);
//         return res.status(200).json({ message: 'Login successful', token });
//       } else {
//         return res.status(401).json({ message: 'Invalid signature' });
//       }
  
//     } catch (err) {
//       console.error('❌ Verification error:', err);
//       return res.status(500).json({ message: 'Server error during verification' });
//     }
//   };



//   export const getChallenge = async (req, res) => {
//     const { username } = req.body;
  
//     const user = await User.findOne({ username });
//     if (!user) return res.status(404).json({ message: 'User not found' });
  
//     const challenge = generateChallenge();
//     user.currentChallenge = {
//       challenge,
//       createdAt: new Date(),
//       used: false
//     };
  
//     await user.save();
  
//     return res.json({ challenge });
//   };

// Falcon-based Backend Verification with liboqs
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { getChallengeForUser, markChallengeUsed } from '../db/users.js';
import User from '../models/user.js';
import { generateChallenge } from '../utils/cryptoUtils.js';
import { generateToken } from '../utils/jwt.js';

// Register new user & store Falcon public key
export const register = async (req, res) => {
  const { username, publicKey } = req.body;


  if (!username || !publicKey) {
    return res.status(400).json({ message: 'Missing username or publicKey' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const newUser = new User({ username, publicKey });
    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('❌ Registration error:', err);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

// Verify Falcon signature using liboqs CLI wrapper or WebAssembly
export const verify = async (req, res) => {
  const { username, signature } = req.body;

  if (!username || !signature) {
    return res.status(400).json({ message: 'Missing username or signature' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const challengeObj = user.currentChallenge;

    if (!challengeObj || challengeObj.used) {
      return res.status(400).json({ message: 'Invalid or used challenge' });
    }

    // Optional: check if challenge is expired (older than 2 minutes)
    const now = new Date();
    const age = (now - new Date(challengeObj.createdAt)) / 1000;
    if (age > 120) {
      return res.status(400).json({ message: 'Challenge expired' });
    }

    // Prepare files for verification (you could also use a native C binding)
    const pubKeyBase64 = user.publicKey;
    const signatureBase64 = signature;
    const challenge = challengeObj.challenge;

    // TEMP FILES (optionally use buffer-based OQS bindings)
    const tmpDir = path.resolve('./tmp');
    fs.mkdirSync(tmpDir, { recursive: true });
    const pubPath = path.join(tmpDir, `${username}.pub`);
    const sigPath = path.join(tmpDir, `${username}.sig`);
    const msgPath = path.join(tmpDir, `${username}.msg`);

    fs.writeFileSync(pubPath, Buffer.from(pubKeyBase64, 'base64'));
    fs.writeFileSync(sigPath, Buffer.from(signatureBase64, 'base64'));
    fs.writeFileSync(msgPath, challenge);

    // Call CLI verifier (assuming you built liboqs CLI or wrapped via C API)
    // For now simulate success
    const isValid = true; // Replace with real OQS_SIG_verify logic

    if (isValid) {
      user.currentChallenge.used = true;
      await user.save();

      const token = generateToken(username);
      return res.status(200).json({ message: 'Login successful', token });
    } else {
      return res.status(401).json({ message: 'Invalid signature' });
    }
  } catch (err) {
    console.error('❌ Verification error:', err);
    return res.status(500).json({ message: 'Server error during verification' });
  }
};

// Challenge generator
export const getChallenge = async (req, res) => {
  const { username } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const challenge = generateChallenge();
  user.currentChallenge = {
    challenge,
    createdAt: new Date(),
    used: false
  };

  await user.save();

  return res.json({ challenge });
};

export const getallUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
};