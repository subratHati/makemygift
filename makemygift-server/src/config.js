import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGODB_URI || '', // empty = in-memory dev store
  clientOrigin: process.env.CLIENT_ORIGIN || '*',
  nodeEnv: process.env.NODE_ENV || 'development',

  // Razorpay — keys come from env (secret NEVER goes to the frontend)
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',
  pricePaise: parseInt(process.env.PRICE_PAISE, 10) || 15900, // ₹159.00 (in paise)
  invitationPricePaise: parseInt(process.env.INVITATION_PRICE_PAISE, 10) || 59900, // ₹599.00 (invitations)
  frontendUrl: process.env.FRONTEND_URL || 'https://makemygift.vercel.app', // where human visitors are sent
};