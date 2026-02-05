import dayjs from "dayjs";
import { User, UserModel } from "../models/user";

export class UserService {
  public async createUser(deviceId: string, nickName: string): Promise<User> {
    const date = new Date(dayjs().format("YYYY-MM-DD HH:mm:ss"));
    const doc = await UserModel.create({
      deviceId,
      nickName,
      joinDate: date,
      lastLoginDate: date,
      score: 0,
      level: 0,
    });
    return doc.toObject ? doc.toObject() : (doc as unknown as User);
  }

  public async findByDeviceId(
    deviceId: string
  ): Promise<(User & { _id: string }) | null> {
    const user = await UserModel.findOne({ deviceId }).lean();
    return user as (User & { _id: string }) | null;
  }

  public async findById(id: string): Promise<(User & { _id: string }) | null> {
    const user = await UserModel.findById(id).lean();
    return user as (User & { _id: string }) | null;
  }

  public async updateLastLogin(id: string): Promise<void> {
    const date = new Date(dayjs().format("YYYY-MM-DD HH:mm:ss"));
    await UserModel.updateOne({ _id: id }, { $set: { lastLoginDate: date } });
  }

  public async updateScoreAndStages(
    id: string,
    score?: number,
    level?: number
  ): Promise<void> {
    const update: Record<string, unknown> = {};
    if (score !== undefined) update.score = score;
    if (level !== undefined) update.level = level;
    if (Object.keys(update).length) {
      await UserModel.updateOne({ _id: id }, { $set: update });
    }
  }

  // 점수 저장 (합산: 클라이언트가 보낸 추가 점수(delta)를 기존 점수에 더함)
  public async saveScore(id: string, score: number) {
    const user: any = await UserModel.findOne({ _id: id }).lean();
    if (!user) return;
    const newScore: number = (user.score ?? 0) + score;
    const userData = await UserModel.updateOne(
      { _id: id },
      { $set: { score: newScore } }
    );
    return userData;
  }

  // 클리어 스테이지 저장 (기존보다 클 때만 갱신, 숫자 하나로 저장)
  public async saveLevel(id: string, stageNumber: number) {
    if (
      typeof stageNumber !== "number" ||
      Number.isNaN(stageNumber) ||
      stageNumber < 1
    )
      return;
    const user: any = await UserModel.findOne({ _id: id }).lean();
    if (!user) return;
    const newStage: number = Math.max(user.level ?? 0, stageNumber);
    const userData = await UserModel.updateOne(
      { _id: id },
      { $set: { level: newStage } }
    );
    return userData;
  }

  public async findUserByNickName(nickName: string): Promise<User | null> {
    return await UserModel.findOne({ nickName }).lean();
  }

  /** 스코어순 조회 (find + sort score 내림차순) */
  public async findRankingByScore(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [list, total] = await Promise.all([
      UserModel.find({}).sort({ score: -1 }).skip(skip).limit(limit).lean(),
      UserModel.countDocuments({}),
    ]);
    return { list, total };
  }

  /** 해당 스테이지 이상 클리어한 유저 조회 (level >= stageNumber, sort score 내림차순) */
  public async findRankingByStage(
    stageNumber: number,
    page: number,
    limit: number
  ) {
    const skip = (page - 1) * limit;
    const filter = { level: { $gte: stageNumber } };
    const [list, total] = await Promise.all([
      UserModel.find(filter).sort({ score: -1 }).skip(skip).limit(limit).lean(),
      UserModel.countDocuments(filter),
    ]);
    return { list, total };
  }
}
