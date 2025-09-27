import { Router } from "express";
import { UserController } from "../controllers/user_controller";
import { UserService } from "../services/user_service";
import { authMiddleware } from "../middlewares/auth";
const router = Router();


const SECRET = process.env.SECRET ?? "supersecretaccesstoken";

const REFRESH_SECRET = process.env.REFRESH_SECRET ??  "supersecretrefreshtoken";

const userService = UserService();
const userController = UserController(userService, SECRET,  REFRESH_SECRET);

router.post("/register", userController.register);
router.get("/:id", authMiddleware, userController.user);
router.post("/login", userController.login);
router.post("/refresh",  userController.refresh);
router.put("/:id", authMiddleware, userController.update)
export default router;
