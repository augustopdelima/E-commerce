import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface TopProduct {
  name: string;
  quantity: number;
  revenue: number;
}

interface LowStockProduct {
  id: number;
  name: string;
  stock: number;
  price: number;
}

interface DashboardData {
  period: { start: string; end: string };
  totalSales: number;
  topProduct: TopProduct | null;
  lowStock: LowStockProduct[];
}


const fetchDashboard = async (): Promise<DashboardData> => {
  const { data } = await axios.get("/api/dashboard");
  return data;
};

export const Dashboard: React.FC = () => {
  const { data, isLoading, isError } = useQuery({queryKey:["dashboard"],queryFn:fetchDashboard });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-gray-500 text-lg">Carregando...</span>
      </div>
    );

  if (isError || !data || !data.period)
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-red-500 text-lg">Erro ao carregar dados</span>
      </div>
    );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Período:{" "}
        <span className="font-medium">
          {new Date(data.period.start).toLocaleDateString()} -{" "}
          {new Date(data.period.end).toLocaleDateString()}
        </span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
       
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Total de Vendas</h2>
          <p className="text-2xl font-bold text-green-600">R$ {data.totalSales.toFixed(2)}</p>
        </div>

       
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Produto mais vendido</h2>
          {data.topProduct ? (
            <>
              <p className="text-gray-800 font-medium">{data.topProduct.name}</p>
              <p className="text-gray-600">
                Quantidade: <span className="font-semibold">{data.topProduct.quantity}</span>
              </p>
              <p className="text-gray-600">
                Receita: <span className="font-semibold">R$ {data.topProduct.revenue.toFixed(2)}</span>
              </p>
            </>
          ) : (
            <p className="text-gray-500">Nenhum produto vendido neste período</p>
          )}
        </div>

        
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition col-span-1 md:col-span-3">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Produtos com estoque baixo</h2>
          {data.lowStock.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left text-gray-600">ID</th>
                    <th className="py-2 px-4 text-left text-gray-600">Nome</th>
                    <th className="py-2 px-4 text-left text-gray-600">Estoque</th>
                    <th className="py-2 px-4 text-left text-gray-600">Preço</th>
                  </tr>
                </thead>
                <tbody>
                  {data.lowStock.map((p) => (
                    <tr key={p.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{p.id}</td>
                      <td className="py-2 px-4">{p.name}</td>
                      <td className="py-2 px-4 text-red-600 font-semibold">{p.stock}</td>
                      <td className="py-2 px-4">R$ {p.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">Nenhum produto com estoque baixo</p>
          )}
        </div>
      </div>
    </div>
  );
};

