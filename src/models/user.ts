import { Document, Schema, model } from 'mongoose';

export interface User {
  _id?: string;
  sessionId?: string;
  nickName: string;
  joinDate: Date;
  lastLoginDate: Date;
  score: number;
  clearedStages: number[];
}

const schema = new Schema({
  sessionId: { type: String, required: false, index: true, sparse: true },
  nickName: { type: String, required: true },
  joinDate: { type: Date, required: true },
  lastLoginDate: { type: Date, required: true },
  score: { type: Number, required: true, default: 0 },
  clearedStages: { type: [Number], required: true, default: [] },
});

export const UserModel = model<User & Document>('User', schema);
