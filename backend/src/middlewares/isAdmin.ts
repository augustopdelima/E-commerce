import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  userId?: number;
}
import { User } from "../models/user";

export async function isAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = Number(req.headers.userid);
    if (!userId) return res.status(401).json({ error: "Não autenticado" });

    const user = await User.findByPk(userId);
    if (!user || user.type !== "admin") {
      return res.status(403).json({ error: "Acesso restrito a administradores" });
    }
    next();
  } catch (error:unknown) {
    res.status(500).json({ message: "Erro ao verificar permissão", error });
  }
}
