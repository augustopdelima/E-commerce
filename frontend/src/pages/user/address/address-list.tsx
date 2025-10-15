import { Suspense } from "react";
import { useAuth } from "../../../context/auth";
import { AddressesList } from "../../../components/address-list";
import {
  ErrorBoundary,
  ErrorFallback,
} from "../../../components/error-boundary";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";

export const AddressesListPage = () => {
  const { user } = useAuth();

  const { reset } = useQueryErrorResetBoundary();

  if (!user) return <div>Usuário não autenticado</div>;

  return (
    <ErrorBoundary
      onReset={reset}
      fallback={({ resetErrorBoundary }) => (
        <ErrorFallback
          resetErrorBoundary={resetErrorBoundary}
          message="Não foi possível carregar os endereços!"
        />
      )}
    >
      <Suspense fallback={<div>Carregando endereços...</div>}>
        <AddressesList userId={user.id} />
      </Suspense>
    </ErrorBoundary>
  );
};
