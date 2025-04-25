import crypto from 'crypto';
export const generateRandomToken = () => crypto.randomBytes(40).toString('hex');
