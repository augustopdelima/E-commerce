import { type FC } from "react";

type ProductsErrorFallbackProps = {
  resetErrorBoundary: () => void;
};


export const ProductsErrorFallback:FC<ProductsErrorFallbackProps> = ({ resetErrorBoundary }) => {

    function handleTryAgain() {
        resetErrorBoundary();
    }

    return(
        <div>
            Não foi possível carregar os produtos!
            <button onClick={handleTryAgain}>Tentar de novo!</button>
        </div>
    )
};