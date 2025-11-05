import { useCart } from "../../context/cart/cart_hook";
import type { ProductCart } from "../../types";

export function CartItemsList() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const handleIncreaseQuantity = (item: ProductCart) => {
    const incrementQuantity = item.quantity + 1;
    const stock = Number(item.stock)
    updateQuantity(item.id, incrementQuantity, stock);
  };

  const handleDecreaseQuantity = (item: ProductCart) => {
    const decrementQuantity = item.quantity - 1;
    const stock = Number(item.stock)
    updateQuantity(item.id, decrementQuantity,stock);
  };

  return (
    <ul className="space-y-6">
      {cartItems.map((item) => (
        <li
          key={item.id}
          className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-200"
        >
          
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-24 h-24 object-cover rounded-lg border border-gray-200"
          />

          
          <div className="flex-1 w-full">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-lg font-semibold text-gray-800">
                {item.name}
              </h4>
              <p className="text-blue-600 font-bold text-md">
                R$ {item.price.toFixed(2)}
              </p>
            </div>

           
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => handleDecreaseQuantity(item)}
                className="w-8 h-8 flex cursor-pointer items-center justify-center bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
              >
                −
              </button>
              <span className="text-gray-800 font-medium min-w-[1.5rem] text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => handleIncreaseQuantity(item)}
                className="w-8 h-8 cursor-pointer flex items-center justify-center bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
              >
                +
              </button>
            </div>

            
            <button
              onClick={() => removeFromCart(item.id)}
              className="mt-4 text-sm text-red-600 hover:text-red-800 transition"
            >
              Remover
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
