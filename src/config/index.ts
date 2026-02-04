import dotenv from 'dotenv';

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("Couldn't find .env file");
}

export default {
  name: process.env.NAME || 'marbleimpact_api',
  port: process.env.PORT || 3001,
  databaseURL: process.env.MONGODB_URI,
  jwtSecretKey: process.env.JWT_SECRET_KEY || 'marble-impact-jwt-secret',
};
