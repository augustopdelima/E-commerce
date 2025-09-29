import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { productService } from "../../../services/products";
import { useAuth } from "../../../context/auth/auth_helpers";
import "./index.css";

export default function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken, user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      const data = await productService.getProductById(id);
      setProduct(data);
      setLoading(false);
    }

    fetchProduct();
  }, [id]);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const imageFile = formData.get("image");

    const productData = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: parseFloat(formData.get("price")),
      stock: parseInt(formData.get("stock"), 10),
      imageFile,
    };

    productService
      .updateProduct(id, productData, accessToken, user.id)
      .then(() => {
        alert("Produto atualizado com sucesso!");
        navigate("/admin");
      })
      .catch(() => {
        alert("Erro ao atualizar o produto. Tente novamente.");
      });
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="update-product-container">
      <h1>Editar Produto</h1>
      <form className="update-product-form" onSubmit={handleSubmit}>
        <label>
          Nome:
          <input type="text" name="name" defaultValue={product.name} required />
        </label>

        <label>
          Descrição:
          <textarea
            name="description"
            defaultValue={product.description}
            required
          />
        </label>

        <label>
          Preço:
          <input
            type="number"
            step="0.01"
            name="price"
            defaultValue={product.price}
            required
          />
        </label>

        <label>
          Estoque:
          <input
            type="number"
            name="stock"
            defaultValue={product.stock}
            required
          />
        </label>

        <label className="image-upload">
          Imagem:
          {product.imageUrl && (
            <img src={`${product.imageUrl}`} alt="Imagem atual" width="150" />
          )}
          <input type="file" name="image" accept="image/*" />
        </label>

        <button type="submit">Salvar Alterações</button>
      </form>
    </div>
  );
}
