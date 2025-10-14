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
    <div>
      <p>R$ {price.toFixed(2)}</p>
      <p>{sendText}</p>
      <button onClick={addToCartHandler} disabled={!hasStock}>
        {addToCartText}
      </button>
    </div>
  );
};
