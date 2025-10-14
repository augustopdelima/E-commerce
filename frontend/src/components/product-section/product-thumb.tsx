import type { FC } from "react";

interface ProductThumbProps {
    imageUrl:string,
    name:string,
}

export const Thumb:FC<ProductThumbProps> = ({ imageUrl, name }) => {
  return (
    <aside>
      <img src={imageUrl} alt={name} />
      <div>
        <img src={imageUrl} alt="thumb" />
      </div>
    </aside>
  );
};
