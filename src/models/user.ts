import { Document, Schema, model } from "mongoose";

export interface User {
  _id?: string;
  deviceId: string;
  nickName: string;
  joinDate: Date;
  lastLoginDate: Date;
  score: number;
  level: number;
}

const schema = new Schema({
  deviceId: { type: String, required: true, index: true, unique: true },
  nickName: { type: String, required: true },
  joinDate: { type: Date, required: true },
  lastLoginDate: { type: Date, required: true },
  score: { type: Number, required: true, default: 0 },
  level: { type: Number, required: true, default: 0 },
});

export const UserModel = model<User & Document>("User", schema);
