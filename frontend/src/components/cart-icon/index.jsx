import { Link } from "react-router";
import Cart from "../../assets/cart.svg";
import "./index.css";
/**
 * CartIcon component
 * @param {number} totalItems
 * @returns
 */
export default function CartIcon({ totalItems }) {
  return (
    <Link to="/cart" className="cart-icon">
      <img src={Cart} alt="Cart" height="24" />
      {totalItems > 0 && <span className="cart-icon-badge">{totalItems}</span>}
    </Link>
  );
}
