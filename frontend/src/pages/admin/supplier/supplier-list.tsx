import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supplierService } from "../../../services/supplier";
import type { Supplier } from "../../../types/supplier";
import { useNavigate } from "react-router";
import { useAuth } from "../../../context/auth";

export const SupplierList = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();

  const { data: suppliers, isLoading } = useQuery<Supplier[]>({
    queryKey: ["suppliers"],
    queryFn: async () => {
      if (!accessToken || !user) {
        throw new Error("Não autenticado!");
      }
      return supplierService.getAll(accessToken, user.id);
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: string) =>
      supplierService.deactivate(id, accessToken!, user!.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["suppliers"] }),
  });

  if (isLoading) return <p className="text-center mt-6">Carregando fornecedores...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Fornecedores</h1>
        <button
          onClick={() => navigate("/admin/suppliers/new")}
          className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          + Novo Fornecedor
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border bg-white rounded-xl shadow-md overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-gray-700">Nome</th>
              <th className="p-3 text-left text-gray-700">Email</th>
              <th className="p-3 text-left text-gray-700">Telefone</th>
              <th className="p-3 text-left text-gray-700">Status</th>
              <th className="p-3 text-center text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            {suppliers?.map((s) => (
              <tr key={s.id} className="border-t hover:bg-gray-50 transition">
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.email}</td>
                <td className="p-3">{s.phone}</td> 
                <td className="p-3">
                  {s.active ? (
                    <span className="text-green-600 font-medium">Ativo</span>
                  ) : (
                    <span className="text-red-600 font-medium">Inativo</span>
                  )}
                </td>
                <td className="p-3 flex gap-3 justify-center">
                  <button
                    onClick={() => navigate(`/admin/suppliers/edit/${s.id}`)}
                    className="bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-white px-3 py-1 rounded-lg transition-colors"
                  >
                    Editar
                  </button>

                  {s.active && (
                    <button
                      onClick={() => deactivateMutation.mutate(String(s.id))}
                      className="bg-red-600 cursor-pointer hover:bg-red-700 text-white px-3 py-1 rounded-lg transition-colors"
                    >
                      Inativar
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {suppliers?.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-6 text-gray-500 italic"
                >
                  Nenhum fornecedor cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
