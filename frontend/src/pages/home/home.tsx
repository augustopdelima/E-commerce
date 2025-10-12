import { Suspense } from "react";
import { ProductsGrid } from "../../components/products-grid";
import { ErrorBoundary } from "../../components/error-boundary";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { ProductErrorFallback } from "./product-error-fallback";

export const Home = () => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      fallback={({ resetErrorBoundary }) => (
        <ProductErrorFallback resetErrorBoundary={resetErrorBoundary} />
      )}
      onReset={reset}
    >
      <Suspense fallback={<div>...Loading</div>}>
        <ProductsGrid  />
      </Suspense>
    </ErrorBoundary>
  );
};
