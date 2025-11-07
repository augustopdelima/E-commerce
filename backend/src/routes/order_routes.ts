import { Router } from "express";
import { createOrder, listOrders, listAllOrders } from "../controllers/oder_controllers";
import { isAdmin } from "../middlewares/isAdmin";
import { authMiddleware } from "../middlewares/auth";


const router = Router();

router.post("/", authMiddleware, createOrder);          
router.get("/:userId", authMiddleware,listOrders);     
router.get("/", authMiddleware,isAdmin,listAllOrders);        

export default router;
