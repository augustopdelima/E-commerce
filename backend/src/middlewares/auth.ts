import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


interface JwtPayload {
  id: number;
  type: string;
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const SECRET = process.env.SECRET!;

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface AuthUser {
  id: number;
  type: string;
}


export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>
  if (!token) {
    return res.status(401).json({ error: "Token inválido" });
  }

  try {
    const decoded = jwt.verify(token, SECRET) as JwtPayload;
    req.user = decoded; // adiciona usuário à requisição
    next();
  } catch (err:unknown) {
    console.log(err);
    return res.status(401).json({ error: "Token inválido ou expirado"});
  }
};