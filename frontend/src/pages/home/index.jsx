import {  useEffect, useState } from "react";
import { productService } from "../../services/products";
import ProductCard from "../../components/card-product";
import "./index.css";

export default function Home() {

    const [products, setProducts] = useState([]);
    useEffect(() => {
      const fetchProducts = async () => {
        const res = await productService.getAllProducts();
        setProducts(res);
      };
      fetchProducts();
    }, []);


    return(
        <div className="products-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
    );
}