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
    queryKey,
    queryFn: () => addressService.getAll(userId.toString()),
  });

  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();
  const hasAddresses = data && data.length > 0;

  const deleteMutation = useMutation({
    mutationFn: (addressId: number) =>
      addressService.remove(userId, addressId.toString()),
    onSuccess: () => {
      setMessage("✅ Endereço deletado com sucesso!");
      queryClient.invalidateQueries({ queryKey });
      setTimeout(() => setMessage(""), 3000);
    },
    onError: () => {
      setMessage("❌ Erro ao deletar o endereço. Tente novamente.");
      setTimeout(() => setMessage(""), 3000);
    },
  });

  const handleDelete = (id: number) => deleteMutation.mutate(id);

  return (
    <section className="max-w-3xl mx-auto p-6 md:p-8">
      <div className="bg-white rounded-2xl shadow-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-3">
            Meus Endereços
          </h2>
          <Link
            to="/user/address/register"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          >
            + Novo Endereço
          </Link>
        </div>

        {message && (
          <div
            className={`mb-4 px-4 py-3 rounded-md text-sm font-medium ${
              message.startsWith("✅")
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        {hasAddresses ? (
          <ul className="space-y-4">
            {data!.map((address) => (
              <li
                key={address.id}
                className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-800 font-semibold">
                      {address.street}, {address.number}
                    </p>
                    <p className="text-gray-600">
                      {address.city} - {address.state}
                    </p>
                    <p className="text-gray-500 text-sm">
                      CEP: {address.zipcode}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(address.id)}
                    className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 rounded-lg border border-red-600 transition-all"
                  >
                    Deletar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center py-10 text-lg">
            Nenhum endereço cadastrado.
          </p>
        )}
      </div>
    </section>
  );
};
