import { useSuspenseQuery } from "@tanstack/react-query";
import { productService } from "../../services/products";
import { ProductCard } from "./product-card";

export const ProductsGrid = () =>  {

    const { data }  = useSuspenseQuery({
        queryKey:["products"],
        queryFn:productService.getAllProducts,
    });


    return(<div>
        {data.map((product) =>(
            <ProductCard key={product.id} product={product} />
        ))}
    </div>)
};