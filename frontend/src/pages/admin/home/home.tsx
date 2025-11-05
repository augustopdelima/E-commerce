import { Suspense } from "react";
import { ProductsTable } from "../../../components/products-table";
import { useAuth } from "../../../context/auth";
import {
  ErrorBoundary,
} from "../../../components/error-boundary";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";

export const AdminHomePage = () => {
  const { user, accessToken } = useAuth();
  const { reset } = useQueryErrorResetBoundary();

  if (!user || !accessToken)
    return (
      <p className="text-center text-red-500 mt-10 font-semibold">
        Usuário não autenticado
      </p>
    );

  const userId = user.id;

  return (
    <section className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Produtos Cadastrados
      </h1>

      <ErrorBoundary
        onReset={reset}
        fallback={({ resetErrorBoundary }) => (
          <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-md mb-4">
            <p>Ocorreu um erro ao carregar os produtos!</p>
            <button
              onClick={resetErrorBoundary}
              className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Tentar novamente
            </button>
          </div>
        )}
      >
        <Suspense
          fallback={
            <div className="text-center py-10 text-gray-500 italic">
              Carregando produtos...
            </div>
          }
        >
          <ProductsTable userId={userId} accessToken={accessToken} />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
};
