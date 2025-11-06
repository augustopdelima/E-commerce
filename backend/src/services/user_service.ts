import { User } from "../models";
import bcrypt from "bcryptjs";
import { emailFormatChecker } from "../utils/email_format_checker";
const DEFAULT_TYPE_USER = "client";


export interface UserServiceInterface {
  register: (name: string, email: string, password: string) => Promise<User>;
  getUser: (id: string) => Promise<User>;
  findUserByEmail: (email: string) => Promise<User | null>;
  findUserById: (id:number) => Promise<User| null >;
  updateUser: (
    id: number,
    data: {
      name?: string | undefined;
      password?: string | undefined;
      email?:string  | undefined;
    }
  ) => Promise<User | null>;
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

  async function findUserByEmail(email: string) {
    return User.findOne({ where: { email } });
  }

  async function findUserById(id:number) {
    return User.findOne({ where:{ id }})
  }

  async function updateUser(
    id: number,
    data: { name?: string; password?: string; email?:string }
  ) {
    const user = await User.findByPk(id);
    if (!user) return null;

    if(!data.email) {
      throw new Error("Email inválido!")
    }

    if(!emailFormatChecker(data.email)) {
      throw new Error("Formato de email não é válido!");
    }

    if (data.name) user.name = data.name;
    if (data.password) {
      const hashed = await bcrypt.hash(data.password, 10);
      user.password = hashed;
    }
    
    user.email = data.email;
    

    await user.save();

    return user;
  }

  return {
    register,
    getUser,
    findUserByEmail,
    updateUser,
    findUserById,
  };
}
