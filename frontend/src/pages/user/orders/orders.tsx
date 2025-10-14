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
      <Suspense fallback={<>Carregando...</>}>
        <section>
          <h2>Meus Pedidos</h2>
          <OrdersList />
        </section>
      </Suspense>
    </ErrorBoundary>
  );
};
