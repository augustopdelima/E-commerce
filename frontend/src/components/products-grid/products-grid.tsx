import { useSuspenseQuery } from "@tanstack/react-query";
import { productService } from "../../services/products";
import { ProductCard } from "./product-card";

export const ProductsGrid = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["products"],
    queryFn: productService.getAllProducts,
  });

  return (
    <div
      className="grid
      gap-6 
      grid-cols-1 
      sm:grid-cols-2 
      md:grid-cols-3 
      lg:grid-cols-4 
      xl:grid-cols-5
      p-4"
    >
      {data.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
