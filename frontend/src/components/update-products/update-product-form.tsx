import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../../services/products";
import { supplierService } from "../../services/supplier";
import type { ProductForm } from "../../types";
import { useNavigate } from "react-router";
import React from "react";

interface Props {
  id: string;
  accessToken: string;
  userId: string;
}

export const UpdateProductForm: React.FC<Props> = ({ id, accessToken, userId }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();


 
  const { data: product, isLoading: isProductLoading, error: productError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getProductById(id),
  });

  
  const { data: suppliers, isLoading: isSuppliersLoading, error: supplierError } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
     
      return supplierService.getAll(accessToken, userId)
    },
  });

  const mutation = useMutation({
    mutationFn: (productData: ProductForm) =>
      productService.updateProduct(id, productData, accessToken, userId),
    onSuccess: () => {
      alert("Produto atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/admin/products");
    },
    onError: (err) => {
      console.error("Erro ao atualizar produto:", err);
      alert("Erro ao atualizar produto. Tente novamente.");
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
      supplierId: formData.get("supplierId") as string, 
    };

    mutation.mutate(productData);
  };

  
  if (isProductLoading || isSuppliersLoading) {
    return <p className="text-gray-500 italic text-center mt-10">Carregando dados...</p>;
  }

 
  if (productError || supplierError) {
    return (
      <p className="text-red-500 italic text-center mt-10">
        Erro ao carregar informações. Tente novamente.
      </p>
    );
  }

 
  if (!product || !suppliers) {
    return (
      <p className="text-gray-500 italic text-center mt-10">
        Não foi possível carregar o produto ou fornecedores.
      </p>
    );
  }

  const priceNumber = parseFloat(product.price.toString()).toFixed(2);
  const stockNumber = parseInt(product.stock.toString(), 10);

  return (
    <section className="bg-white p-6 rounded-2xl shadow-md max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Atualizar Produto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
       
        <div className="flex flex-col space-y-2">
          <label className="text-gray-700 font-medium">Imagem do Produto:</label>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-40 h-40 object-cover rounded-lg mb-2"
          />
          <input
            type="file"
            name="imageUrl"
            accept="image/*"
            className="block w-full text-gray-700 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        
        <div className="flex flex-col space-y-2">
          <label className="text-gray-700 font-medium">Nome:</label>
          <input
            type="text"
            name="name"
            required
            defaultValue={product.name}
            className="block w-full text-gray-700 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

       
        <div className="flex flex-col space-y-2">
          <label className="text-gray-700 font-medium">Descrição:</label>
          <textarea
            name="description"
            required
            defaultValue={product.description}
            className="block w-full text-gray-700 border border-gray-300 rounded-md p-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

      
        <div className="flex flex-col space-y-2">
          <label className="text-gray-700 font-medium">Preço:</label>
          <input
            type="number"
            name="price"
            step="0.01"
            required
            defaultValue={priceNumber}
            className="block w-full text-gray-700 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Estoque */}
        <div className="flex flex-col space-y-2">
          <label className="text-gray-700 font-medium">Estoque:</label>
          <input
            type="number"
            name="stock"
            required
            defaultValue={stockNumber}
            className="block w-full text-gray-700 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        
        <div className="flex flex-col space-y-2">
          <label className="text-gray-700 font-medium">Fornecedor:</label>
          <select
            name="supplierId"
            defaultValue={product.supplierId || ""}
            className="block w-full text-gray-700 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Selecione um fornecedor</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

        
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {mutation.isPending ? "Atualizando..." : "Atualizar Produto"}
        </button>
      </form>
    </section>
  );
};
