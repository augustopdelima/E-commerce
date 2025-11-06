import { useAuth } from "../../../context/auth";
import { useCart } from "../../../context/cart";
import { CartItemsList, CartSummary } from "../../../components/cart";

export const CartPage = () => {
  const { user, accessToken } = useAuth();
  const {
    cartItems,
    totalItems,
    totalPrice,
    clearCart,
    showModal,
    modalMessage,
    modalType,
  } = useCart();

  if (!user || !accessToken)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-600">
        <p className="text-lg font-medium">
          Usuário não autenticado. Faça login para continuar.
        </p>
      </div>
    );

  return (
    <section className="max-w-5xl mx-auto p-6">
      {modalMessage && (
        <p
          className={`mb-4 p-2 rounded-md ${
            modalType === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {modalMessage}
        </p>
      )}

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
          <p className="text-lg font-medium">Seu carrinho está vazio 🛒</p>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b">
            Seu Carrinho
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Itens no carrinho
              </h3>
              <CartItemsList />
            </div>

            <CartSummary
              userId={user.id}
              totalItems={totalItems}
              totalPrice={totalPrice}
              onClearCart={clearCart}
              onShowModal={showModal}
            />
          </div>
        </>
      )}
    </section>
  );
};
