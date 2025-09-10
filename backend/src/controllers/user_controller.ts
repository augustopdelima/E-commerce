import { Request, Response } from "express"
import { UserService } from "../services/user_service";

interface UserRegisterBody {
  name: string;
  email: string;
  password: string;
}



export const UserController = {

    async register(req:Request, res: Response) {
        try {
            const { name, email, password } = req.body as UserRegisterBody
            const user = await UserService.register(name, email, password);

            res.status(201).json({
                id:user.id,
                email:user.email,
                type:user.type
            })
        } catch (err: unknown) {
            res.status(400).json({erro:err});
        }
    }
}