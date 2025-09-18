import { Router } from "express";
import { UserController } from "../controllers/user_controller";
import { UserService } from "../services/user_service";
const router = Router();

const SECRET = process.env.SECRET as string;

const userService = UserService();
const userController = UserController(userService, SECRET);

router.post("/register", userController.register);
router.get("/:id", userController.user);

export default router;
