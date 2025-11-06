export interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierFormInput {
  name: string;
  email: string;
  phone: string;
  active?: boolean;
}

export interface SupplierForm {
  name: string;
  email: string;
  phone: string;
}