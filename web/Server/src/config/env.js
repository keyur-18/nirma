import dotenv from "dotenv";
dotenv.config();

const env = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET
}

if (!env.MONGODB_URI) {
  throw new Error('❌ MONGO_URI missing in .env');
}

export default env