import { useEffect, useState } from "react";
import { orderService } from "../../../services/orders";
import { useAuth } from "../../../context/auth/auth_helpers";


export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { accessToken } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = accessToken;
        const data = await orderService.getOrders(token); // no backend: retorna todos os pedidos se admin
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar pedidos.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [accessToken]);

  if (loading) return <p>Carregando pedidos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="orders-container">
      <h2>Todos os Pedidos</h2>

      {orders.length === 0 ? (
        <p>Nenhum pedido foi feito ainda.</p>
      ) : (
        <ul className="orders-list">
          {orders.map((order) => (
            <li key={order.id} className="order-item">
              <h3>Pedido #{order.id}</h3>
              <p>
                <strong>Usuário:</strong> {order.user?.name || "Usuário ID " + order.userId}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Total:</strong> R$ {order.total.toFixed(2)}
              </p>
              <h4>Itens:</h4>
              <ul className="order-items">
                {order.items.map((item) => (
                  <li key={item.id} className="order-product">
                    Produto #{item.productId} - {item.quantity}x - R${" "}
                    {item.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
