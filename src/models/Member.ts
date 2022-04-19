import { Schema, models, model } from 'mongoose';

const MemberSchema = new Schema({
  discord_id: {
    type: String,
    unique: true,
    static: true,
  },
  username: String,
  coin: Number,
  createAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

export const Member = models.Member || model('Member', MemberSchema);
