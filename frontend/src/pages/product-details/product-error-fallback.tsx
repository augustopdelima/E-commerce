import { type FC } from "react";

type ProductErrorFallbackProps = {
  resetErrorBoundary: () => void;
};

export const ProductErrorFallback: FC<ProductErrorFallbackProps> = ({
  resetErrorBoundary,
}) => {
  function handleTryAgain() {
    resetErrorBoundary();
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-xl m-8 max-w-lg mx-auto border border-red-300">
      <p className="text-xl font-semibold mb-4 text-red-600">
        Não foi possível carregar os produtos! 😔
      </p>

      <button
        onClick={handleTryAgain}
        className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 
                 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 
                 transition duration-150 ease-in-out transform hover:scale-[1.05]"
      >
        Tentar de novo!
      </button>
    </div>
  );
};
