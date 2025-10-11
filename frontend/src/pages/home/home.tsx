import { Suspense } from "react";
import { ProductsGrid } from "../../components/products-grid";


export const Home = () => {
    return(
        <Suspense>
            <ProductsGrid />
        </Suspense>
    )
};