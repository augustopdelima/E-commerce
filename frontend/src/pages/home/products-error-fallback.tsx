import { type FC } from "react";

type ProductsErrorFallbackProps = {
  resetErrorBoundary: () => void;
};

export const ProductsErrorFallback: FC<ProductsErrorFallbackProps> = ({
  resetErrorBoundary,
}) => {
  function handleTryAgain() {
    resetErrorBoundary();
  }

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Não foi possível carregar os produtos!
      </h2>
      <p className="text-gray-500 mb-6">
        Algo deu errado ao buscar os dados. Tente novamente.
      </p>
      <button
        onClick={handleTryAgain}
        className="px-5 py-2 bg-blue-500 cursor-pointer text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Tentar de novo
      </button>
    </div>
  );
};
