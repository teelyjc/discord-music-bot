import mongoose from 'mongoose';
import 'dotenv/config';

export default class DatabaseManager {

  private MONGO_URI: string;

  public async connect(): Promise<void> {
    const {
      MONGO_PROTOCAL,
      MONGO_USER,
      MONGO_PASS,
      MONGO_HOST,
      MONGO_PORT,
      MONGO_DB,
    } = process.env;

    if (!MONGO_PROTOCAL || !MONGO_USER || !MONGO_PASS || !MONGO_HOST || !MONGO_PORT || !MONGO_DB) {
      throw new Error('Please define the MONGO environment variable on .env.local');
    }

    if (MONGO_PROTOCAL === 'mongodb') {
      this.MONGO_URI = `${MONGO_PROTOCAL}://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
    } else if (MONGO_PROTOCAL === 'mongodb+srv') {
      this.MONGO_URI = `${MONGO_PROTOCAL}://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/${MONGO_DB}?authSource=admin`;
    } else {
      throw new Error('Protocal invalid.');
    }

    const { connection } = await mongoose.connect(this.MONGO_URI);

    if (connection) {
      console.log('✅ MongoDB connection established.');
    } else {
      console.log('❌ Can\'t connect to MongoDB !');
    }
  }

}
