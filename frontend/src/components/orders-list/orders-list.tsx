import { useSuspenseQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/auth";
import { orderService } from "../../services/order";


export const OrdersList = () => {
    
    const { user } = useAuth();

    const { data } = useSuspenseQuery({
        queryKey:["orders", user?.id],
        queryFn:async () => {
            if(user === null) {
                throw Error;
            }

            return orderService.getOrdersByUser(user.id)
        }
    });


    if(data.length === 0) {
        return <p>Você ainda não fez nenhum pedido.</p>
    }

    const formatNumber = (value:string) => {
        const number = Number(value);

        return number.toFixed(2);
    }

    return (
        <ul>
            {data.map((order) => (
                <li key={order.id}>
                    <h3>Pedido #{order.id}</h3>
                    <p>
                        <strong>Status:</strong> {order.status}
                    </p>
                    <p>
                        <strong>Total:</strong> R$ {formatNumber(order.total)}
                    </p>

                    <h4>Itens:</h4>
                    <ul>
                        {order.items.map((item) => (
                            <li key={item.productId}>
                                Produto #{item.productId} - {item.quantity}x - R${" "}
                                {formatNumber(item.price)}
                            </li>
                        ))}
                    </ul>
                </li>
            ))}
        </ul>
    );

};