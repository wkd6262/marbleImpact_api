import dayjs from 'dayjs';
import { User, UserModel } from '../models/user';

export class UserService {
  public async createUser(sessionId: string | undefined, nickName: string): Promise<User> {
    const date = new Date(dayjs().format('YYYY-MM-DD HH:mm:ss'));
    const doc = await UserModel.create({
      sessionId: sessionId || undefined,
      nickName,
      joinDate: date,
      lastLoginDate: date,
      score: 0,
      clearedStages: [],
    });
    return doc.toObject ? doc.toObject() : (doc as unknown as User);
  }

  public async findBySessionId(sessionId: string): Promise<(User & { _id: string }) | null> {
    const user = await UserModel.findOne({ sessionId }).lean();
    return user as (User & { _id: string }) | null;
  }

  public async findById(id: string): Promise<(User & { _id: string }) | null> {
    const user = await UserModel.findById(id).lean();
    return user as (User & { _id: string }) | null;
  }

  public async updateLastLogin(id: string): Promise<void> {
    const date = new Date(dayjs().format('YYYY-MM-DD HH:mm:ss'));
    await UserModel.updateOne({ _id: id }, { $set: { lastLoginDate: date } });
  }

  public async updateScoreAndStages(
    id: string,
    score?: number,
    clearedStages?: number[]
  ): Promise<void> {
    const update: Record<string, unknown> = {};
    if (score !== undefined) update.score = score;
    if (clearedStages !== undefined) update.clearedStages = clearedStages;
    if (Object.keys(update).length) {
      await UserModel.updateOne({ _id: id }, { $set: update });
    }
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

  /** 스테이지 클리어한 유저 조회 (find + clearedStages, sort score 내림차순) */
  public async findRankingByStage(stageNumber: number, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const filter = { clearedStages: stageNumber };
    const [list, total] = await Promise.all([
      UserModel.find(filter).sort({ score: -1 }).skip(skip).limit(limit).lean(),
      UserModel.countDocuments(filter),
    ]);
    return { list, total };
  }
}
