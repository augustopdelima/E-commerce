import { Suspense } from "react";
import {
  ErrorBoundary,
  ErrorFallback,
} from "../../../components/error-boundary";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { useAuth } from "../../../context/auth";
import { ListOrders } from "../../../components/list-orders-admin";

export const AdminOrdersPage = () => {
  const { reset } = useQueryErrorResetBoundary();
  const { user, accessToken } = useAuth();


  if (!user || !accessToken) {
    return <div>Acesso negado. Por favor, faça login.</div>;
  }

  return (
    <ErrorBoundary
      onReset={reset}
      fallback={({ resetErrorBoundary }) => (
        <ErrorFallback
          resetErrorBoundary={resetErrorBoundary}
          message="Erro ao buscar os pedidos!"
        />
      )}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <section>
            <h1>Pedidos</h1>
            <ListOrders accessToken={accessToken} />
        </section>
      </Suspense>
    </ErrorBoundary>
  );
};
