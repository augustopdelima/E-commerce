import { Suspense } from "react";
import { OrdersList } from "../../../components/orders-list";
import {
  ErrorBoundary,
  ErrorFallback,
} from "../../../components/error-boundary";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";

export const OrdersPage = () => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      fallback={({ resetErrorBoundary }) => (
        <ErrorFallback
          message="Falha ao carregar os pedidos!"
          resetErrorBoundary={resetErrorBoundary}
        />
      )}
      onReset={reset}
    >
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-full py-20">
            <div className="text-gray-500 animate-pulse text-lg">
              Carregando pedidos...
            </div>
          </div>
        }
      >
        <section className="h-full">
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
              Meus Pedidos
            </h2>
            <OrdersList />
          </div>
        </section>
      </Suspense>
    </ErrorBoundary>
  );
};
