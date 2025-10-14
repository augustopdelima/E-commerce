import { Suspense } from "react";
import { ProductsGrid } from "../../components/products-grid";
import { ErrorBoundary } from "../../components/error-boundary";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { ProductsErrorFallback } from "./products-error-fallback";

export const Home = () => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      fallback={({ resetErrorBoundary }) => (
        <ProductsErrorFallback resetErrorBoundary={resetErrorBoundary} />
      )}
      onReset={reset}
    >
      <Suspense fallback={<div>...Loading</div>}>
        <ProductsGrid  />
      </Suspense>
    </ErrorBoundary>
  );
};
