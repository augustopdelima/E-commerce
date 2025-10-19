import { useSuspenseQuery } from "@tanstack/react-query";
import { orderService } from "../../services/order";
import { formatPrice } from "../../helpers";

interface ListOrdersProps {
    accessToken: string;
}

export const ListOrders = ({ accessToken }: ListOrdersProps) => {


  const { data } = useSuspenseQuery({
    queryKey: ["orders-list"],
    queryFn: ()=> orderService.getOrders(accessToken),
  });


  if (data.length === 0) {
    return <p>Nenhum pedido encontrado.</p>;
  }

  return (
    <ul>
      {data.map((order) => (
        <li key={order.id}>
            <h3>Pedido #{order.id}</h3>
            <p> Usuário: {order.user.name}</p>
            <p>Total: {formatPrice(order.total)}</p>
            <p>Status: {order.status}</p>
            <h4>Itens:</h4>
            <ul>
              {order.items.map((item) => (
                <li key={item.productId}>
                  <p>Produto: {item.productId}</p>
                  <p>Quantidade: {item.quantity}</p>
                  <p>Preço: {formatPrice(item.price)}</p>
                </li>
              ))}
            </ul>
        </li>
      ))}
    </ul>   
  );
};
