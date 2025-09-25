import AdminSidebar from "../../../components/admin-sidebar";
import { useEffect, useState } from "react";
import { productService } from "../../../services/products";
import { ProductTable } from "../../../components/product-table";
/**
 * Componente para a página inicial do admin.
 *
 * @component
 * @returns {JSX.Element} Página inicial do admin.
 */
export default function AdminHome() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main style={{backgroundColor: '#FFFFF',padding: '20px'}}>
      <h2>Produtos Cadastrados</h2>
      <ProductTable products={products} />
    </main>
  );
}
