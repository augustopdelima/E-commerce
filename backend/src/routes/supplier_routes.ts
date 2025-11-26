import { Router } from "express";
import {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deactivateSupplier,
  reactivateSupplier,
  listDeactivatedSuppliers
} from "../controllers/supplier_controller";
import { isAdmin } from "../middlewares/isAdmin";
import { authMiddleware } from "../middlewares/auth";

const router = Router();


router.post("/", authMiddleware, isAdmin, createSupplier);

router.get("/", authMiddleware, isAdmin, getSuppliers);

router.get("/deactivated", authMiddleware, isAdmin, listDeactivatedSuppliers);

router.put("/:id/deactivate", authMiddleware, isAdmin, deactivateSupplier);
router.put("/reactivate/:id", authMiddleware, isAdmin, reactivateSupplier);

router.get("/:id", authMiddleware, isAdmin, getSupplierById);
router.put("/:id", authMiddleware, isAdmin, updateSupplier);

export default router;
