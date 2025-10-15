import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { addressService } from "../../services/addresses";
import { useState } from "react";
import type { FC } from "react";
import { Link } from "react-router";

interface AddressProps {
  userId: string;
}

export const AddressesList: FC<AddressProps> = ({ userId }) => {
  const queryKey = ["addresses", userId.toString()];

  const { data } = useSuspenseQuery({
    queryKey: queryKey,
    queryFn: () => addressService.getAll(userId.toString()),
  });

  const [message, setMessage] = useState("");

  const queryClient = useQueryClient();

  const hasAddresses = data && data.length > 0;

  const deleteMutation = useMutation({
    mutationFn: (addressId: number) =>
      addressService.remove(userId, addressId.toString()),

    onSuccess: () => {
      setMessage("Endereço deletado com sucesso.");
      // Invalida o cache para refazer o fetch
      queryClient.invalidateQueries({
        queryKey: ["addresses", userId.toString()],
      });
    },

    onError: () => {
      setMessage("Erro ao deletar o endereço. Tente novamente.");
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <div>
      <h2>Meus Endereços</h2>
      {message && <p>{message}</p>}
      <Link to="/user/address/register">Adicionar Novo Endereço</Link>
      {hasAddresses ? (
        <ul>
          {data!.map((address) => (
            <li key={address.id}>
              <p>
                {address.street}, {address.number}
              </p>
              <p>
                {address.city} - {address.state}
              </p>
              <p>{address.zipcode}</p>
              <button onClick={() => handleDelete(address.id)}>
                Deletar
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum endereço cadastrado.</p>
      )}{" "}
      ;
    </div>
  );
};
