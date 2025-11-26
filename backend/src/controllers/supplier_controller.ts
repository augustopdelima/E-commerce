import { Request, Response } from "express";
import { Supplier } from "../models";

export interface SupplierInput {
  name: string;
  email: string;
  phone: string;
  active?: boolean; 
}

export const createSupplier = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, active = true } = req.body as SupplierInput;
    const supplier = await Supplier.create({ name, email, phone, active }) ;
    return res.status(201).json(supplier);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao criar fornecedor" });
  }
};


export const getSuppliers = async (_req: Request, res: Response) => {
  try {
    const suppliers = await Supplier.findAll({ where: { active: true } });
    return res.json(suppliers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar fornecedores" });
  }
};


export const getSupplierById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findByPk(id);
    if (!supplier) return res.status(404).json({ message: "Fornecedor não encontrado" });
    return res.json(supplier);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar fornecedor" });
  }
};


export const updateSupplier = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone, active } = req.body as SupplierInput;

    const supplier = await Supplier.findByPk(id);
    if (!supplier) return res.status(404).json({ message: "Fornecedor não encontrado" });

    await supplier.update({ name, email, phone, active });
    return res.json(supplier);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao atualizar fornecedor" });
  }
};


export const deactivateSupplier = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findByPk(id);
    if (!supplier) return res.status(404).json({ message: "Fornecedor não encontrado" });

    await supplier.update({ active: false });
    return res.json({ message: "Fornecedor inativado com sucesso" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao inativar fornecedor" });
  }
};

export const reactivateSupplier = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findByPk(id);
    if (!supplier) return res.status(404).json({ message: "Fornecedor não encontrado" });

    await supplier.update({ active: true });
    return res.json({ message: "Fornecedor reativado com sucesso", supplier });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao reativar fornecedor" });
  }
};

export const  listDeactivatedSuppliers = async (_req: Request, res: Response) => {
  try {
    const suppliers = await Supplier.findAll({ where: { active: false } });
    return res.json(suppliers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar fornecedores inativados" });
  }
}