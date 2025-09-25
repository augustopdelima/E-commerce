import { Request, RequestHandler, Response } from "express";
import { UserServiceInterface } from "../services/user_service";
import bcrypt from "bcrypt";
import { AuthRequest } from "../middlewares/auth";

import jwt from "jsonwebtoken";

interface UserRegisterBody {
  name: string;
  email: string;
  password: string;
}

interface UserLoginBody {
  email: string;
  password: string;
}

interface RefreshTokenBody {
  refreshToken: string;
}

interface TokenPayload {
  id: number;
  type: string;
}

export function UserController(
  userService: UserServiceInterface,
  SECRET: string,
  REFRESH_SECRET: string
) {
  

  function generateTokens(user: { id: string; type: string }) {
    const accessToken = jwt.sign(
      { id: user.id, type: user.type },
      SECRET,
      { expiresIn: "1h" } // curto prazo
    );

    const refreshToken = jwt.sign(
      { id: user.id, type: user.type },
      REFRESH_SECRET,
      { expiresIn: "7d" } // longo prazo
    );

    return { accessToken, refreshToken };
  }

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

      const tokens = generateTokens({
        id: user.id.toString(),
        type: user.type,
      });

      

      return res.status(201).json({
        message: "Usuário cadastrado com sucesso",
        user: {
          id: user.id,
          email: user.email,
          type: user.type,
        },
        accessToken: tokens.accessToken,
        refreshToke: tokens.refreshToken,
      });
    } catch (err: unknown) {
      console.log(err);
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
      console.log(err);

      return res.status(400).json({ erro: "Algo deu errado" });
    }
  };


  async function login(req: Request, res: Response) {
    try {
      const { email, password } = req.body as UserLoginBody;

      const user = await userService.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Email ou senha inválidos!" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Email ou senha inválidos!" });
      }

      const tokens = generateTokens({
        id: user.id.toString(),
        type: user.type,
      });

     

      return res.json({
        message: "Login realizado com sucesso!",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          type: user.type,
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    } catch (err: unknown) {
      console.log(err);
      return res.status(400).json({ erro: "Erro interno no login" });
    }
  }

  function refresh(req: Request, res: Response) {
    
    const { refreshToken } = req.body as RefreshTokenBody;
    
    
    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token não fornecido" });
    }

    try {
      const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as TokenPayload;

      const accessToken = jwt.sign(
        { id: decoded.id, type: decoded.type },
        SECRET,
        {
          expiresIn: "1h",
          jwtid:crypto.randomUUID(),
        }
      );

      const newRefreshToken = jwt.sign(
        { id: decoded.id, type: decoded.type },
        REFRESH_SECRET,
        {
          expiresIn: "7d",
          jwtid: crypto.randomUUID(),
        }
      );

      return res.status(200).json({ accessToken, refreshToken: newRefreshToken});
    } catch (err: unknown) {
      console.log(err);
      return res
        .status(403)
        .json({ error: "Refresh token inválido ou expirado" });
    }
  }

  async function update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = Number(req.user?.id); // vem do authMiddleware
      const userType = req.user?.type;

      const existingUser = await userService.findUserById(Number(id));
      if (!existingUser) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      if (userId !== Number(id) && userType !== "admin") {
        return res.status(403).json({ error: "Acesso negado" });
      }

      const { name, password, email } = req.body as UserRegisterBody;

      const updatedUser = await userService.updateUser(Number(id), {
        name,
        password,
        email,
      });

      if (!updatedUser) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      return res.json({
        message: "Usuário atualizado com sucesso",
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          type: updatedUser.type,
        },
      });
    } catch (err: unknown) {
      return res.status(400).json({
        error: err instanceof Error ? err.message : "Erro ao atualizar usuário",
      });
    }
  }

  return {
    register,
    user,
    login,
    refresh,
    update,
  };
}
