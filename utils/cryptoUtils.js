import crypto from 'crypto';

export const generateChallenge = () => {
  return `LOGIN-${Date.now()}-${crypto.randomBytes(16).toString('hex')}`;
};

export const verifySignature = (publicKeyPEM, challenge, signatureHex) => {
  console.log("🔐 Verifying signature...");

  try {
    const verify = crypto.createVerify('sha256');
    verify.update(challenge);
    verify.end();

    const publicKey = crypto.createPublicKey({
      key: publicKeyPEM,
      format: 'pem',
      type: 'spki' // Important: tells Node to treat this as a public key
    });

    const isValid = verify.verify(publicKey, Buffer.from(signatureHex, 'hex'));

    console.log('✅ Is valid:', isValid);
    return isValid;
  } catch (error) {
    console.error('❌ Verification error:', error);
    return false;
  }
};
