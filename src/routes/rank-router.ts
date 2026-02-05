import { Router, Request, Response } from "express";
import { RankService } from "../services/rank-service";

const router = Router();

router.get("/weekly", async (request: Request, response: Response) => {
  const rankService = new RankService();
  try {
    const page = Math.max(1, parseInt(request.query.page as string, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(request.query.limit as string, 10) || 20)
    );
    const result = await rankService.findWeekly(page, limit);
    response.status(200).json(result);
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: "rank error" });
  }
});

router.get("/monthly", async (request: Request, response: Response) => {
  const rankService = new RankService();
  try {
    const page = Math.max(1, parseInt(request.query.page as string, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(request.query.limit as string, 10) || 20)
    );
    const result = await rankService.findMonthly(page, limit);
    response.status(200).json(result);
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: "rank error" });
  }
});

export = router;
