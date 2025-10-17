import { Suspense } from "react";
import { ProductsTable } from "../../../components/products-table";
import { useAuth } from "../../../context/auth";
import {
  ErrorBoundary,
  ErrorFallback,
} from "../../../components/error-boundary";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";

export const AdminHomePage = () => {
  const { user, accessToken } = useAuth();
  const { reset } = useQueryErrorResetBoundary();

  if (!user || !accessToken) return <p>Usuário não autenticado</p>;

  const userId = user.id;

  return (
    <section>
      <h1>Produtos Cadastrados</h1>
      <ErrorBoundary
        onReset={reset}
        fallback={({ resetErrorBoundary }) => (
          <ErrorFallback message="Ocorreu um erro ao carregar os produtos!" resetErrorBoundary={resetErrorBoundary} />
        )}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <ProductsTable userId={userId} accessToken={accessToken} />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
};
