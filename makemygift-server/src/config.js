import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGODB_URI || '', // empty = in-memory dev store
  clientOrigin: process.env.CLIENT_ORIGIN || '*',
  nodeEnv: process.env.NODE_ENV || 'development',
};
