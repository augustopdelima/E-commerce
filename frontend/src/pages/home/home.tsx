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
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center h-[70vh] text-gray-600 text-lg">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>Carregando...</p>
          </div>
        }
      >
        <ProductsGrid />
      </Suspense>
    </ErrorBoundary>
  );
};
