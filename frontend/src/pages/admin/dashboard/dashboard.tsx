import React from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../../../services/dashboard";
import type { DashboardStats } from "../../../types/dashboard";
import { useAuth } from "../../../context/auth";


 

const currency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value
  );

export const Dashboard: React.FC = () => {

  const { accessToken, user } = useAuth();

  const { data, isLoading, isError } = useQuery<DashboardStats>({
    queryKey: ["dashboard"],
    queryFn: () => dashboardService.getDashboardStats(accessToken, user?.id), // <-- retorna a Promise
    enabled: !!accessToken && !!user, // só busca quando o token estiver disponível
    staleTime: 1000 * 60, // opcional: cache por 1 min
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen p-8 bg-gray-50">
        <div role="status" aria-live="polite" className="text-gray-500">
          Carregando estatísticas...
        </div>
      </div>
    );

  console.log(data);

  if (isError || !data || !data.period)
    return (
      <div className="flex items-center justify-center min-h-screen p-8 bg-gray-50">
        <div className="text-red-600">Erro ao carregar dados do dashboard.</div>
      </div>
    );

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Painel Administrativo
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Período:{" "}
          <span className="font-medium text-gray-700">
            {new Date(data.period.start).toLocaleDateString()} —{" "}
            {new Date(data.period.end).toLocaleDateString()}
          </span>
        </p>
      </header>

      <main className="space-y-6">
        {/* Top stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-sm text-gray-500">Total de Vendas (mês)</h2>
            <p className="mt-3 text-2xl md:text-3xl font-bold text-green-600">
              {currency(data.totalSales)}
            </p>
            <p className="text-xs text-gray-400 mt-2">Receita de pedidos concluídos</p>
          </div>
 
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-sm text-gray-500">Produto mais vendido</h2>
            {data.topProduct ? (
              <>
                <p className="mt-3 text-lg font-semibold text-gray-800">
                  {data.topProduct.name}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {data.topProduct.quantity} unidades • {currency(data.topProduct.revenue)}
                </p>
              </>
            ) : (
              <p className="mt-3 text-sm text-gray-500">Nenhum produto vendido</p>
            )}
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-sm text-gray-500">Produtos com estoque baixo</h2>
            <p className="mt-3 text-lg font-semibold text-gray-800">
              {data.lowStock.length}
            </p>
            <p className="text-xs text-gray-400 mt-2">Itens abaixo do limite</p>
          </div>
        </section>

        {/* Low stock table */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Produtos com estoque baixo</h3>
            <span className="text-sm text-gray-500">
              {data.lowStock.length} itens
            </span>
          </div>

          {data.lowStock.length === 0 ? (
            <p className="text-gray-500">Nenhum produto com estoque baixo.</p>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="text-xs text-gray-500 uppercase">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Nome</th>
                    <th className="py-3 px-4">Estoque</th>
                    <th className="py-3 px-4">Preço</th>
                  </tr>
                </thead>
                <tbody>
                  {data.lowStock.map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="py-3 px-4 text-sm text-gray-700">{p.id}</td>
                      <td className="py-3 px-4 text-sm text-gray-800">{p.name}</td>
                      <td className="py-3 px-4 text-sm text-red-600 font-semibold">{p.stock}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{currency(p.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};