import { useQuery } from "@tanstack/react-query";
import { addressService } from "../../services/addresses";
import type { AddressResponse } from "../../types";
import type { JSX } from "react/jsx-dev-runtime";

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

  if (isLoading) return <p>Carregando endereços...</p>;
  if (isError) return <p>Erro ao carregar endereços.</p>;

  if (addresses.length === 0) {
    return (
      <p className="no-address">
        Nenhum endereço cadastrado.{" "}
        <a href="/user/address/register" className="register-link">
          Cadastre um endereço
        </a>
      </p>
    );
  }

  return (
    <div className="address-section">
      <h3>Selecione o endereço de entrega:</h3>
      <select
        className="address-select"
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
