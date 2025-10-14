import { type FC } from "react";

type ProductErrorFallbackProps = {
  resetErrorBoundary: () => void;
};


export const ProductErrorFallback:FC<ProductErrorFallbackProps> = ({ resetErrorBoundary }) => {

    function handleTryAgain() {
        resetErrorBoundary();
    }

    return(
        <div>
            Não foi possível carregar os produto!
            <button onClick={handleTryAgain}>Tentar de novo!</button>
        </div>
    )
};