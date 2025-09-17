import { User } from "../models";
import bcrypt from "bcryptjs";

const DEFAULT_TYPE_USER = "client";

export interface UserServiceInterface {
  register: (name: string, email: string, password: string) => Promise<User>;
  getUser: (id: string) => Promise<User>;
}

export function UserService(): UserServiceInterface {
  async function register(name: string, email: string, password: string) {
    const exists = await User.findOne({ where: { email } });
    if (exists) throw new Error("Email já cadastrado!");

    const passHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: passHash,
      type: DEFAULT_TYPE_USER,
    });
    return user;
  }

  async function getUser(id: string) {
    try {
      const user = await User.findOne({ where: { id } });

      if (!user) {
        throw new Error("Usuário não encontrado!");
      }

      return user.get({ plain: true }) as User;
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
      throw err;
    }
  }

  return {
    register,
    getUser,
  };
}
