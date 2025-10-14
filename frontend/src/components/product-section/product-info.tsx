import type { FC } from "react";

interface ProductInfoProps {
    name:string;
    description:string;
    price:number;
    hasStockText:string;
}

export const Info:FC<ProductInfoProps> = ({ description, hasStockText, name, price }) => {
  return (
    <main>
      <h1>{name}</h1>
      <p>{description}</p>
      <p>{price.toFixed(2)}</p>
      <p>{hasStockText}</p>
    </main>
  );
};
