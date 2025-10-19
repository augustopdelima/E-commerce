import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { productService } from "../../services/products";
import { Link } from "react-router";
import type { FC } from "react";

interface ProductsTableProps {
    userId: string;
    accessToken: string;
}

export const ProductsTable:FC<ProductsTableProps> = ({ userId, accessToken }) => {
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
    }
  });

  function handleDeleteProduct(id:number) {
    const idString = id.toString();
    deleteProduct.mutate(idString);
  }


  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Descrição</th>
          <th>Preço</th>
          <th>Estoque</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {data.map((product) => (
          <tr key={product.id}>
            <td>{product.id}</td>
            <td>{product.name}</td>
            <td>{product.description}</td>
            <td>R$ {product.price}</td>
            <td>{product.stock}</td>
            <td>
              <div>
                <Link to={`/admin/edit-product/${product.id}`}>Editar</Link>
                <button onClick={() => handleDeleteProduct(product.id)}>Excluir</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
