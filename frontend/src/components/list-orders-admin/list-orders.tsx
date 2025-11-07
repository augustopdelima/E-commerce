import { useSuspenseQuery } from "@tanstack/react-query";
import { orderService } from "../../services/order";
import { formatPrice } from "../../helpers";

interface ListOrdersProps {
  accessToken: string;
  userId:string;
}

export const ListOrders = ({ accessToken, userId }: ListOrdersProps) => {
  const { data } = useSuspenseQuery({
    queryKey: ["orders-list"],
    queryFn: () => orderService.getOrders(accessToken, userId),
  });

  if (data.length === 0) {
    return (
      <p className="text-center text-gray-500 py-6">
        Nenhum pedido encontrado.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {data.map((order) => (
        <div
          key={order.id}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Pedido #{order.id}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.status === "Concluído"
                  ? "bg-green-100 text-green-700"
                  : order.status === "Pendente"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {order.status}
            </span>
          </div>

          <p className="text-gray-700 mb-2">
            <strong>Usuário:</strong> {order.user.name}
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Total:</strong> {formatPrice(order.total)}
          </p>

          <div>
            <h4 className="text-md font-semibold text-gray-800 mb-2">Itens:</h4>
            <ul className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <li
                  key={item.productId}
                  className="py-2 flex justify-between items-center text-gray-700"
                >
                  <span>
                    Produto #{item.Product.name} — {item.quantity}x
                  </span>
                  <span className="font-medium">{formatPrice(item.price)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};
