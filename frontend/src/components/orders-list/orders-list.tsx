import { useSuspenseQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/auth";
import { orderService } from "../../services/order";

export const OrdersList = () => {
  const { user } = useAuth();

  const { data } = useSuspenseQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      if (user === null) {
        throw Error;
      }
      return orderService.getOrdersByUser(user.id);
    },
  });

  if (data.length === 0) {
    return (
      <p className="text-gray-500 text-center py-10 text-lg">
        Você ainda não fez nenhum pedido.
      </p>
    );
  }

  const formatNumber = (value: string) => {
    const number = Number(value);
    return number.toFixed(2);
  };

  return (
    <div className="h-full">
      <div className="space-y-6">
        {data.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow-md border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
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
              <strong>Total:</strong>{" "}
              <span className="text-blue-600 font-semibold">
                R$ {formatNumber(order.total)}
              </span>
            </p>

            <div className="mt-4">
              <h4 className="text-md font-semibold text-gray-800 mb-2">
                Itens:
              </h4>
              <ul className="divide-y divide-gray-100">
                {order.items.map((item) => (
                  <li
                    key={item.productId}
                    className="py-2 flex justify-between items-center text-gray-700"
                  >
                    <span>
                      Produto #{item.productId} — {item.quantity}x
                    </span>
                    <span className="font-medium">
                      R$ {formatNumber(item.price)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
