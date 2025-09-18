import { Request, RequestHandler, Response } from "express";
import { UserServiceInterface } from "../services/user_service";

import jwt from "jsonwebtoken";

interface UserRegisterBody {
  name: string;
  email: string;
  password: string;
}

export function UserController(
  userService: UserServiceInterface,
  SECRET: string
) {
  async function register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body as UserRegisterBody;

      const exists = await userService.findUserByEmail(email);

      if (exists) {
        return res
          .status(400)
          .json({ error: "E-mail já cadastrado", field: "Email" });
      }

      const user = await userService.register(name, email, password);

      const token = jwt.sign({ id: user.id, role: user.type }, SECRET, {
        expiresIn: "1d",
      });

      return res.status(201).json({
        message: "Usuário cadastrado com sucesso",
        user: {
          id: user.id,
          email: user.email,
          type: user.type,
        },
        token,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        return res.status(400).json({ erro: err.message });
      }

      return res.status(400).json({ erro: "Algo deu errado" });
    }
  }

  const user: RequestHandler<{ id: string }> = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await userService.getUser(id);

      return res.status(200).json({
        email: user.email,
        name: user.name,
        id: user.id,
        type: user.type,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        return res.status(400).json({ erro: err.message });
      }

      return res.status(400).json({ erro: "Algo deu errado" });
    }
  };

  return {
    register,
    user,
  };
}
