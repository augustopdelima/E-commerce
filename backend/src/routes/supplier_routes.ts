import { Router } from "express";
import {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deactivateSupplier,
} from "../controllers/supplier_controller";
import { isAdmin } from "../middlewares/isAdmin";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.post("/", authMiddleware,isAdmin, createSupplier);
router.get("/", authMiddleware ,isAdmin, getSuppliers);
router.get("/:id", authMiddleware ,isAdmin, getSupplierById);
router.put("/:id", authMiddleware,isAdmin, updateSupplier);
router.put("/:id/deactivate", authMiddleware ,isAdmin, deactivateSupplier);

export default router;
