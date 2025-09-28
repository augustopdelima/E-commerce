import { Router } from "express";
import { createOrder, listOrders, listAllOrders } from "../controllers/oder_controllers";


const router = Router();

router.post("/", createOrder);          
router.get("/:userId", listOrders);     
router.get("/", listAllOrders);        

export default router;
