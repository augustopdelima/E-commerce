import type { FC } from "react";

interface ActionsProps {
  price: number;
  addToCartHandler: () => void;
  hasStock: boolean;
  sendText: string;
  addToCartText: string;
}

export const Actions: FC<ActionsProps> = ({
  addToCartHandler,
  addToCartText,
  hasStock,
  price,
  sendText,
}) => {
  return (
    <div className="space-y-4">
      <p className="text-3xl font-bold text-gray-800">R$ {price.toFixed(2)}</p>

      <p className="text-sm text-green-700 font-semibold">{sendText}</p>

      <button
        onClick={addToCartHandler}
        disabled={!hasStock}
        className={`w-full py-4 text-white font-bold rounded-lg shadow-lg 
                transition duration-200 ease-in-out uppercase tracking-wider 
                cursor-pointer
                ${
                  !hasStock
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transform hover:scale-[1.01]" // Estilo quando habilitado
                }`}
      >
        {addToCartText}
      </button>
    </div>
  );
};
