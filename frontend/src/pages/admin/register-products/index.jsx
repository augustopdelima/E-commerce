import { useAuth } from "../../../context/auth/auth_helpers";
import { useNavigate } from "react-router";
import "./index.css";
import { useEffect, useState } from "react";
import { productService } from "../../../services/products";

export default function RegisterProducts() {
  const { user, loadingUser } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (user === null) {
      navigate("/login");
    } else if (user.type !== "admin") {
      navigate("/");
    } else {
      setChecking(false); // só libera se for admin
    }
  }, [user, navigate, loadingUser]);

  if (checking || loadingUser) {
    return <p>Verificando permissões...</p>;
  }

  function handleSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const productData = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: parseFloat(formData.get("price")),
      stock: parseInt(formData.get("stock"), 10),
    };

    productService.createProduct(productData).then(() => { 
      alert("Produto registrado com sucesso!");
    });

   
    event.target.reset();
  }


  return (
    <div className="register-products-container">
      <h1>Registrar Produtos</h1>
      <form className="register-products-form" onSubmit={handleSubmit}>
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
    </div>
  );
}
