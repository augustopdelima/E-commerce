import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supplierService } from "../../../services/supplier";
import { useAuth } from "../../../context/auth";
import { useNavigate } from "react-router";

interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  active: boolean;
}

export const DeactivatedSuppliers = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { accessToken, user } = useAuth();

  const { data: suppliers, isLoading, isError } = useQuery<Supplier[]>({
    queryKey: ["deactivated-suppliers"],
    queryFn: async () => {
      if (!accessToken || !user) {
        throw new Error("Não autenticado!");
      }
      return supplierService.listDeactivated(accessToken, user.id);
    },
    enabled: !!accessToken && !!user,
  });

  const reactivateMutation = useMutation({
    mutationFn: (id: number) =>
      supplierService.reactivate(id.toString(), accessToken!, user!.id),

    onSuccess: () => {
      alert("Fornecedor reativado com sucesso!"); 
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["deactivated-suppliers"] });  
    },

    onError: () => {
      alert("Erro ao reativar fornecedor.");
    },
  });

  const handleReactivate = (id: number) => {
    if (confirm("Deseja realmente reativar este fornecedor?")) {
      reactivateMutation.mutate(id);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen p-8 bg-gray-50">
        <div className="text-gray-500">Carregando fornecedores...</div>
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center min-h-screen p-8 bg-gray-50">
        <div className="text-red-600">
          Erro ao carregar fornecedores desativados.
        </div>
      </div>
    );

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Fornecedores Desativados
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Gerencie fornecedores inativos e reative quando necessário
        </p>
        <button
          onClick={() => navigate("/admin/suppliers")}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
        >
          Voltar para Fornecedores Ativos
        </button>
      </header>

      {!suppliers || suppliers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-gray-500 text-lg">Nenhum fornecedor desativado.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr className="text-sm text-gray-600 uppercase">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Nome</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Telefone</th>
                  <th className="py-3 px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <tr
                    key={supplier.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {supplier.id}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800 font-medium">
                      {supplier.name}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {supplier.email}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {supplier.phone}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <button
                        onClick={() => handleReactivate(supplier.id)}
                        disabled={reactivateMutation.isPending}
                        className="bg-green-600 cursor-pointer hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm transition"
                      >
                        {reactivateMutation.isPending
                          ? "Reativando..."
                          : "Reativar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
