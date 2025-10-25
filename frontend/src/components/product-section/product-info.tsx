import type { FC } from "react";

interface ProductInfoProps {
  name: string;
  description: string;
  price: number;
  hasStockText: string;
}

export const Info: FC<ProductInfoProps> = ({
  description,
  hasStockText,
  name,
  price,
}) => {
  return (
    <main className="space-y-4 text-gray-800">
      <h1 className="text-4xl font-extrabold leading-tight">{name}</h1>

      <p className="text-base text-gray-600 border-b border-gray-200 pb-4">
        {description}
      </p>

      <p className="text-4xl font-bold text-indigo-700">
        R$ {price.toFixed(2)}
      </p>

      <p
        className={`text-lg font-semibold ${
          hasStockText.includes("Em Estoque")
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        {hasStockText}
      </p>
    </main>
  );
};
