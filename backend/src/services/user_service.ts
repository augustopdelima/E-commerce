import { User } from "../models/user";
import bcrypt from "bcryptjs";

const DEFAULT_TYPE_USER = "cliente";

export const UserService = {
    async register(name:string, email:string, password: string) {
        const exists = await User.findOne({ where: { email } });
        if(exists) throw new Error("Email já cadastrado!");
        
        const passHash = await bcrypt.hash(password,10);

        const user = await User.create({ name, email, password:passHash, type:DEFAULT_TYPE_USER })
        return user;
    }
};