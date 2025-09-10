import { Router } from "express";
import { UserController } from "../controllers/user_controller";
import { UserService } from "../services/user_service";
const router = Router();

const userService = UserService();
const userController = UserController(userService);

router.post("/register", userController.register);
router.get("/:id", userController.user);

export default router;