import { Router } from "express";
import { UserController } from "../controllers/user_controller";
import { UserService } from "../services/user_service";
import { isAdmin } from "../middlewares/isAdmin";
const router = Router();


const SECRET = process.env.SECRET ?? "supersecretaccesstoken";

const REFRESH_SECRET = process.env.REFRESH_SECRET ??  "supersecretrefreshtoken";

const userService = UserService();
const userController = UserController(userService, SECRET,  REFRESH_SECRET);

router.post("/register", userController.register);
router.get("/:id", isAdmin, userController.user);
router.post("/login", userController.login);
router.post("/refresh",  userController.refresh);

export default router;
