import { Router } from "express";
import {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deactivateSupplier,
} from "../controllers/supplier_controller";
import { isAdmin } from "../middlewares/isAdmin";

const router = Router();

router.post("/", isAdmin, createSupplier);
router.get("/", isAdmin, getSuppliers);
router.get("/:id", isAdmin, getSupplierById);
router.put("/:id", isAdmin, updateSupplier);
router.delete("/:id", isAdmin, deactivateSupplier);

export default router;
