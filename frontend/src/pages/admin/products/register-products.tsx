import { useNavigate } from "react-router";
import { useAuth } from "../../../context/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../../../services/products";
import type { ProductForm } from "../../../types";

export const RegisterProducts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (productData: ProductForm) => productService.createProduct(productData),
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
    };
    mutation.mutate(productData);
  };

  if (!user) return <div>Usuário não está logado!</div>;

  return (
    <section>
      <h1>Registrar Produtos</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Url da image:
          <input type="file" name="imageUrl" required accept="image/*" />
        </label>
        <label>
          Nome do Produto:
          <input type="text" name="name" required />
        </label>
        <label>
          Descrição:
          <textarea name="description" required></textarea>
        </label>
        <label>
          Preço:
          <input type="number" name="price" step="0.01" required />
        </label>
        <label>
          Estoque:
          <input type="number" name="stock" required />
        </label>
        <button type="submit">Registrar Produto</button>
      </form>
    </section>
  );
};
