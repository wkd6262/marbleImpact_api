import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "./config";

const verifyToken = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    if (!request.headers["authorization"]) {
      return response.status(403).json({
        success: false,
        message: "not logged in",
      });
    }

    const token = request.headers["authorization"]
      .toString()
      .split("Bearer ")[1];
    const secret_key = config.jwtSecretKey || "";

    if (!token) {
      return response.status(403).json({
        success: false,
        message: "not logged in",
      });
    }

    const decoded: any = jwt.verify(token, secret_key);

    if (decoded) {
      response.locals = {
        ...response.locals,
        id: decoded.id,
      };
      next();
    } else {
      response.status(401).json({ error: "unauthorized" });
    }
  } catch (err) {
    response.status(401).json({ error: "token expired" });
  }
};

export { verifyToken };
