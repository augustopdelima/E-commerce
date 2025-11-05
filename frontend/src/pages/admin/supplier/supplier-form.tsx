import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supplierService } from "../../../services/supplier";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../../../context/auth";
import type { SupplierForm } from "../../../types/supplier";
import { useState, useEffect } from "react";

export const SupplierFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, accessToken } = useAuth();

  const [form, setForm] = useState<SupplierForm>({
    name: "",
    email: "",
    phone: "",
  });

  const { data: supplier } = useQuery({
    queryKey: ["supplier", id],
    queryFn: async () => {
      if (!accessToken || !user || !id) return;
      return supplierService.getById(id, accessToken, user.id);
    },
    enabled: isEdit && !!accessToken && !!user,
  });

  useEffect(() => {
    if (supplier) {
      setForm({
        name: supplier.name,
        email: supplier.email,
        phone: supplier.phone,
      });
    }
  }, [supplier]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!accessToken || !user) throw new Error("Não autenticado!");
      if (isEdit) {
        return supplierService.update(id!, form, accessToken, user.id);
      }
      return supplierService.create(form, accessToken, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      navigate("/admin/suppliers");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        {isEdit ? "Editar Fornecedor" : "Novo Fornecedor"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700">Nome</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Telefone</label>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate("/admin/suppliers")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={mutation.isPending}
            className={`${
              mutation.isPending
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            } text-white px-4 py-2 rounded-lg transition flex items-center justify-center gap-2`}
          >
            {mutation.isPending ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Salvando...
              </>
            ) : (
              isEdit ? "Salvar Alterações" : "Cadastrar"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
