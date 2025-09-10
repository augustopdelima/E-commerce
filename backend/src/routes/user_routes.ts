import { Router } from "express";
import { UserController } from "../controllers/user_controller";
const router = Router();

router.post("/user/register", UserController.register);

export default router;