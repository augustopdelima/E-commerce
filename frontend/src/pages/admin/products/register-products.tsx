import { useNavigate } from "react-router";
import { useAuth } from "../../../context/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productService } from "../../../services/products";
import { supplierService } from "../../../services/supplier";
import type { ProductForm } from "../../../types";
import React from "react";

export const RegisterProducts = () => {
  const { user,accessToken } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  
  const {
    data: suppliers,
    isLoading: loadingSuppliers,
    error: suppliersError,
  } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () =>{ 

      if(!accessToken || !user) {
        throw Error("Usuário não autenticado!");
      }

      return supplierService.getAll(accessToken,user.id);
    },
  });

  const mutation = useMutation({
    mutationFn: async (productData: ProductForm) => {
      if(!accessToken || !user) {
        throw Error("Usuário não autenticado!");
      }

      return productService.createProduct(productData, accessToken,user.id);
    },
    onSuccess: () => {
      navigate("/admin");
      alert("Produto registrado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      console.error("Erro ao registrar produto:", error);
      alert("Erro ao registrar produto. Tente novamente.");
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const productData: ProductForm = {
      image: formData.get("imageUrl") as File,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string).toString(),
      stock: parseInt(formData.get("stock") as string, 10).toString(),
      supplierId: parseInt(formData.get("supplierId") as string, 10).toString(),
    };
    mutation.mutate(productData);
  };

  if (!user) return <div>Usuário não está logado!</div>;

 
  if (loadingSuppliers)
    return <p className="text-gray-500 italic text-center mt-8">Carregando fornecedores...</p>;

  if (suppliersError)
    return <p className="text-red-500 italic text-center mt-8">Erro ao carregar fornecedores.</p>;

  if (!suppliers || suppliers.length === 0)
    return <p className="text-gray-500 italic text-center mt-8">Nenhum fornecedor disponível.</p>;

  return (
    <section className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b">
          Registrar Produto
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
              URL da Imagem:
              <input
                type="file"
                name="imageUrl"
                required
                accept="image/*"
                className="mt-1 block w-full p-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </label>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Nome do Produto:
              <input
                type="text"
                name="name"
                required
                className="mt-1 block w-full p-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </label>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Descrição:
              <textarea
                name="description"
                required
                className="mt-1 block w-full p-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </label>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Preço:
              <input
                type="number"
                name="price"
                step="0.01"
                required
                className="mt-1 block w-full p-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </label>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Estoque:
              <input
                type="number"
                name="stock"
                required
                className="mt-1 block w-full p-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </label>
          </div>

          {/* 🔹 Seleção de fornecedor */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Fornecedor:
              <select
                name="supplierId"
                required
                className="mt-1 block w-full p-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Selecione um fornecedor</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {mutation.isPending ? "Registrando..." : "Registrar Produto"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
