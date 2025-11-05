import { useParams } from "react-router";
import { ProductSection } from "../../components/product-section";
import { Suspense } from "react";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "../../components/error-boundary";
import { ProductErrorFallback } from "./product-error-fallback";

export const ProductDetails = () => {
  const { id } = useParams();

  const { reset } = useQueryErrorResetBoundary();

  if (!id) {
    return <>Não foi possível carregar a página!!</>;
  }

  return (
    <ErrorBoundary
      fallback={({ resetErrorBoundary }) => (
        <ProductErrorFallback resetErrorBoundary={resetErrorBoundary} />
      )}
      onReset={reset}
    >
      <Suspense fallback={<div>...Loading</div>}>
        <ProductSection id={id} />
      </Suspense>
    </ErrorBoundary>
  );
};
