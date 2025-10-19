import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../../services/products";
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

 
  const { data: product, isLoading: isFetching, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getProductById(id),
  });


  const mutation = useMutation({
    mutationFn: (productData: ProductForm) =>
      productService.updateProduct(id, productData, accessToken, userId),
    onSuccess: () => {
      alert("Produto atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/admin");
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
    };

    mutation.mutate(productData);
  };


  if (isFetching) return <p>Carregando produto...</p>;
  if (error) return <p>Erro ao carregar o produto.</p>;
  if (!product) return <p>Produto não encontrado.</p>;

 
  const priceNumber = parseFloat(product.price.toString()).toFixed(2);
 
  const stockNumber = parseInt(product.stock.toString(), 10);

  return (
    <section>
      <h1>Atualizar Produto</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Imagem:
          <img src={product.imageUrl} alt={product.name} />
          <input type="file" name="imageUrl" accept="image/*" />
        </label>

        <label>
          Nome:
          <input type="text" name="name" required defaultValue={product.name} />
        </label>

        <label>
          Descrição:
          <textarea name="description" required defaultValue={product.description}></textarea>
        </label>

        <label>
          Preço:
          <input
            type="number"
            name="price"
            step="0.01"
            required
            defaultValue={priceNumber}
          />
        </label>

        <label>
          Estoque:
          <input
            type="number"
            name="stock"
            required
            defaultValue={stockNumber}
          />
        </label>

        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Atualizando..." : "Atualizar Produto"}
        </button>
      </form>
    </section>
  );
};
