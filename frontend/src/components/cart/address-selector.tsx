import { useQuery } from "@tanstack/react-query";
import { addressService } from "../../services/addresses";
import type { AddressResponse } from "../../types";
import type { JSX } from "react/jsx-dev-runtime";
import { useEffect } from "react";

interface AddressSelectorProps {
  userId: string;
  selected: number | null;
  onSelect: (id: number) => void;
}

export const AddressSelector = ({
  userId,
  selected,
  onSelect,
}: AddressSelectorProps): JSX.Element => {
  const {
    data: addresses = [],
    isLoading,
    isError,
  } = useQuery<AddressResponse[]>({
    queryKey: ["addresses", userId],
    queryFn: () => addressService.getAll(userId),
  });

  useEffect(() => {
    if (!selected && addresses.length > 0) {
      onSelect(addresses[0].id);
    }
  }, [addresses, selected, onSelect]);

  if (isLoading)
    return (
      <p className="text-gray-500 text-sm italic">Carregando endereços...</p>
    );
  if (isError)
    return (
      <p className="text-red-500 text-sm italic">
        Erro ao carregar endereços.
      </p>
    );

  if (addresses.length === 0) {
    return (
      <p className="text-gray-500 text-sm">
        Nenhum endereço cadastrado.{" "}
        <a
          href="/user/address/register"
          className="text-blue-600 hover:underline"
        >
          Cadastre um endereço
        </a>
      </p>
    );
  }

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-gray-700 font-medium">Selecione o endereço de entrega:</label>
      <select
        className="border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={selected ?? ""}
        onChange={(e) => onSelect(Number(e.target.value))}
      >
        {addresses.map((addr) => (
          <option key={addr.id} value={addr.id}>
            {addr.street}, {addr.number} - {addr.city}/{addr.state}
          </option>
        ))}
      </select>
    </div>
  );
};
