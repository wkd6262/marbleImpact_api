import { Document, Schema, model } from "mongoose";

export interface Rank {
  _id?: string;
  userId: string;
  nickName: string;
  score: number;
  level: number;
  createdAt: Date;
}

const schema = new Schema({
  userId: { type: String, required: true, index: true },
  nickName: { type: String, required: true },
  score: { type: Number, required: true },
  level: { type: Number, required: true },
  createdAt: { type: Date, required: true, index: true },
});

export const RankModel = model<Rank & Document>("Rank", schema);
