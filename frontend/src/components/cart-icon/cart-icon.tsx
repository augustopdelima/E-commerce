import { Link } from "react-router";
import Cart from "../../assets/cart.svg";
import type { FC } from "react";

interface CartIconProps {
  totalItems: number;
}

export const CartIcon: FC<CartIconProps> = ({ totalItems }) => {
  return (
    <Link to="/cart">
      <img src={Cart} alt="Cart" height="24" />
      {totalItems > 0 && <span>{totalItems}</span>}
    </Link>
  );
};
