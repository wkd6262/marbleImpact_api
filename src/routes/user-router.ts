import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import { Global } from "../global";
import { UserService } from "../services/user-service";
import { verifyToken } from "../authorization";
import config from "../config";

const router = Router();

/**
 * 유저 조회 또는 생성 (deviceId 기준, Flutter 앱 WebView 로그인)
 */
router.post("/", async (request: Request, response: Response) => {
  const userService = new UserService();
  try {
    const deviceId: string | undefined = request.body?.deviceId;
    if (!deviceId || typeof deviceId !== "string") {
      return response.status(400).json({ message: "deviceId is required" });
    }

    const existing = await userService.findByDeviceId(deviceId);
    if (existing) {
      await userService.updateLastLogin(existing._id);
      const user = await userService.findById(existing._id);
      if (!user) {
        return response.status(500).json({ message: "user not found" });
      }
      const token = jwt.sign({ id: user._id }, config.jwtSecretKey!, {
        expiresIn: 60 * 60 * 24 * 365,
      });
      const date = new Date(dayjs().format("YYYY-MM-DD HH:mm:ss"));
      return response.status(200).json({
        user: {
          _id: user._id,
          nickName: user.nickName,
          joinDate: user.joinDate,
          lastLoginDate: date,
          score: user.score ?? 0,
          level: user.level ?? 0,
        },
        token,
      });
    }

    // 새 유저 생성 (랜덤 닉네임)
    let nickName = Global.getInstance().generateRandomNickName();
    let retry = 0;
    while (retry < 5) {
      const exists = await userService.findUserByNickName(nickName);
      if (!exists) break;
      nickName = Global.getInstance().generateRandomNickName();
      retry++;
    }

    const newUser = await userService.createUser(deviceId, nickName);
    const userId = String((newUser as { _id: unknown })._id);
    const token = jwt.sign({ id: userId }, config.jwtSecretKey!, {
      expiresIn: 60 * 60 * 24 * 365,
    });

    const date = new Date(dayjs().format("YYYY-MM-DD HH:mm:ss"));
    response.status(200).json({
      user: {
        _id: userId,
        nickName: newUser.nickName,
        joinDate: newUser.joinDate,
        lastLoginDate: date,
        score: newUser.score ?? 0,
        level: newUser.level ?? 0,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: "user error" });
  }
});

/** 랭킹: 스코어순 조회 GET /user/ranking/score?page=1&limit=20 */
router.get("/ranking/score", async (request: Request, response: Response) => {
  const userService = new UserService();
  try {
    const page = Math.max(1, parseInt(request.query.page as string, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(request.query.limit as string, 10) || 20)
    );
    const result = await userService.findRankingByScore(page, limit);
    response.status(200).json(result);
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: "ranking error" });
  }
});

/** 랭킹: 스테이지 클리어 유저 조회 GET /user/ranking/stage/:stageNumber?page=1&limit=20 */
router.get(
  "/ranking/stage/:stageNumber",
  async (request: Request, response: Response) => {
    const userService = new UserService();
    try {
      const stageNumber = parseInt(request.params.stageNumber, 10);
      if (Number.isNaN(stageNumber) || stageNumber < 1) {
        response.status(400).json({ message: "invalid stage number" });
        return;
      }
      const page = Math.max(1, parseInt(request.query.page as string, 10) || 1);
      const limit = Math.min(
        100,
        Math.max(1, parseInt(request.query.limit as string, 10) || 20)
      );
      const result = await userService.findRankingByStage(
        stageNumber,
        page,
        limit
      );
      response.status(200).json(result);
    } catch (err) {
      console.error(err);
      response.status(500).json({ message: "ranking error" });
    }
  }
);

/** 점수·스테이지 저장 (JWT 필요) PUT /user/score */
router.use("/score", verifyToken);
router.put("/score", async (request: Request, response: Response) => {
  const userService = new UserService();
  try {
    const userId: string = response.locals["id"];
    const user = await userService.findById(userId);
    if (!user) {
      return response.status(404).json({ message: "user not found" });
    }
    const { score, level } = request.body || {};
    if (score != null) await userService.saveScore(userId, Number(score));
    if (level != null) await userService.saveLevel(userId, Number(level));
    const updated = await userService.findById(userId);
    return response.status(200).json({
      score: updated?.score ?? 0,
      level: updated?.level ?? 0,
    });
  } catch (err) {
    console.error(err);
    return response.status(500).json({ message: "save progress error" });
  }
});

export = router;
