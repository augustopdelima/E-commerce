import { Suspense } from "react";
import { ErrorBoundary, ErrorFallback } from "../../../components/error-boundary";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { useAuth } from "../../../context/auth";
import { ListOrders } from "../../../components/list-orders-admin";

export const AdminOrdersPage = () => {
  const { reset } = useQueryErrorResetBoundary();
  const { user, accessToken } = useAuth();

  if (!user || !accessToken) {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        Acesso negado. Por favor, faça login.
      </div>
    );
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
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-64 text-gray-500">
            Carregando pedidos...
          </div>
        }
      >
        <section className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Pedidos</h1>
          <div className="bg-white shadow-md rounded-lg p-4">
            <ListOrders accessToken={accessToken} userId={user.id} />
          </div>
        </section>
      </Suspense>
    </ErrorBoundary>
  );
};

