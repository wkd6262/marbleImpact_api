import dayjs from "dayjs";
import { RankModel } from "../models/rank";

export class RankService {
  // 클리어 시마다 한 건 생성 (이번 클리어로 올린 점수, 레벨)
  public async create(
    userId: string,
    nickName: string,
    score: number,
    level: number
  ) {
    const date = new Date(dayjs().format("YYYY-MM-DD HH:mm:ss"));
    const doc = await RankModel.create({
      userId,
      nickName,
      score,
      level,
      createdAt: date,
    });
    return doc;
  }

  // 주간 랭킹: 이번 주에 생성된 Rank만 조회, 유저별 score 합산 후 정렬
  public async findWeekly(page: number, limit: number) {
    const start = dayjs().startOf("week").toDate();
    const end = dayjs().endOf("week").toDate();
    const skip = (page - 1) * limit;
    const list = await RankModel.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: "$userId",
          nickName: { $first: "$nickName" },
          totalScore: { $sum: "$score" },
        },
      },
      { $sort: { totalScore: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);
    const totalResult = await RankModel.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: "$userId" } },
      { $count: "total" },
    ]);
    const total = totalResult[0] ? totalResult[0].total : 0;
    return { list, total };
  }

  // 월간 랭킹: 이번 달에 생성된 Rank만 조회, 유저별 score 합산 후 정렬
  public async findMonthly(page: number, limit: number) {
    const start = dayjs().startOf("month").toDate();
    const end = dayjs().endOf("month").toDate();
    const skip = (page - 1) * limit;
    const list = await RankModel.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: "$userId",
          nickName: { $first: "$nickName" },
          totalScore: { $sum: "$score" },
        },
      },
      { $sort: { totalScore: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);
    const totalResult = await RankModel.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: "$userId" } },
      { $count: "total" },
    ]);
    const total = totalResult[0] ? totalResult[0].total : 0;
    return { list, total };
  }
}
