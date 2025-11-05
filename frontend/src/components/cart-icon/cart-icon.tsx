import { Link } from "react-router";
import Cart from "../../assets/cart.svg";
import type { FC } from "react";

interface CartIconProps {
  totalItems: number;
}

export const CartIcon: FC<CartIconProps> = ({ totalItems }) => {
  return (
    <Link
      to="/user/cart"
      className="relative flex items-center p-2 text-gray-700 hover:text-indigo-600 transition duration-150"
    >
      <img src={Cart} alt="Cart" className="w-6 h-6" />
      {totalItems > 0 && (
        <span
          className="absolute top-0 right-0
                 bg-red-600 text-white text-xs font-bold
                 rounded-full h-5 w-5 flex items-center justify-center
                 transform translate-x-1/2 -translate-y-1/2"
        >
          {totalItems}
        </span>
      )}
    </Link>
  );
};
