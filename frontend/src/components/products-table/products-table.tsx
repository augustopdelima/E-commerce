import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { productService } from "../../services/products";
import { Link } from "react-router";
import type { FC } from "react";

interface ProductsTableProps {
  userId: string;
  accessToken: string;
}

export const ProductsTable: FC<ProductsTableProps> = ({ userId, accessToken }) => {
  const { data } = useSuspenseQuery({
    queryKey: ["products"],
    queryFn: () => productService.getAllProducts(),
  });

  const queryClient = useQueryClient();

  const deleteProduct = useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id, userId, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      alert("Produto excluído com sucesso!");
    },
    onError: (error) => {
      console.error(error);
      alert("Erro ao excluir o produto.");
    },
  });

  function handleDeleteProduct(id: number) {
    const idString = id.toString();
    deleteProduct.mutate(idString);
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">ID</th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Nome</th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Descrição</th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Preço</th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Estoque</th>
            <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.map((product) => (
            <tr key={product.id} className="border-t border-gray-200 hover:bg-gray-50">
              <td className="py-2 px-4 text-sm text-gray-700">{product.id}</td>
              <td className="py-2 px-4 text-sm text-gray-700">{product.name}</td>
              <td className="py-2 px-4 text-sm text-gray-700">{product.description}</td>
              <td className="py-2 px-4 text-sm text-gray-700">R$ {product.price.toFixed(2)}</td>
              <td className="py-2 px-4 text-sm text-gray-700">{product.stock}</td>
              <td className="py-2 px-4 text-sm text-gray-700">
                <div className="flex gap-2">
                  <Link
                    to={`/admin/edit-product/${product.id}`}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
