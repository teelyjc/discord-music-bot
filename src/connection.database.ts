import 'dotenv/config';
import mongoose from 'mongoose';

const {
  MONGO_USER, MONGO_PASS, MONGO_DB, MONGO_HOST, MONGO_PORT, MONGO_DB_AUTHSRC,
} = process.env;

export default class Database {

  private MONGO_USER: string;

  private MONGO_PASS: string;

  private MONGO_DB: string;

  private MONGO_HOST: string;

  private MONGO_PORT: number;

  private MONGO_DB_AUTHSRC: string;

  public constructor() {
    this.MONGO_USER = MONGO_USER;
    this.MONGO_PASS = MONGO_PASS;
    this.MONGO_DB = MONGO_DB;
    this.MONGO_HOST = MONGO_HOST;
    this.MONGO_PORT = parseInt(MONGO_PORT, 10);
    this.MONGO_DB_AUTHSRC = MONGO_DB_AUTHSRC;
  }

  public async connect():Promise<void> {
    if (!this.MONGO_USER
      || !this.MONGO_PASS
      || !this.MONGO_DB
      || !this.MONGO_HOST
      || !this.MONGO_PORT
      || !this.MONGO_DB_AUTHSRC
    ) {
      throw new Error('Please define the MONGO environment variable on .env.local');
    }

    global.mongoose = global.mongoose || {};
    const cache = global.mongoose;

    const MONGO_URI = `mongodb://${this.MONGO_USER}:${this.MONGO_PASS}@${this.MONGO_HOST}:${this.MONGO_PORT}/${this.MONGO_DB}?authSource=${this.MONGO_DB_AUTHSRC}`;

    if (!cache.connection) {
      console.log('Connecting to MongoDB..');
      try {
        const { connection } = await mongoose.connect(MONGO_URI);

        cache.connection = connection;
        cache.client = connection.getClient;

        console.log('MongoDB connection established');
      } catch (error) {
        throw new Error(error.message);
      }
    }
  }

}
