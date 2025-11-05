import React, { useState } from "react";
import { useAuth } from "../../../context/auth";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addressService } from "../../../services/addresses";

export const RegisterAddress = () => {
  const [address, setAddress] = useState({
    street: "",
    number: "",
    city: "",
    state: "",
    zipcode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: (newAddress: typeof address) => {
      if (!user) throw new Error("Usuário não autenticado");
      return addressService.create(user?.id, newAddress);
    },
    onSuccess: () => {
      if (!user) return;
      queryClient.invalidateQueries({
        queryKey: ["addresses", user.id],
      });
      navigate("/user/address");
    },
    onError: (error) => {
      console.error("Erro ao registrar endereço:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate.mutate(address);
  };

  if (!user)
    return (
      <div className="text-center text-gray-600 mt-10">
        Usuário não autenticado
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b">
          Registrar Novo Endereço
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Rua:
              <input
                type="text"
                name="street"
                value={address.street}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md p-4 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </label>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Número:
              <input
                type="text"
                name="number"
                value={address.number}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md p-4 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </label>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Cidade:
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md p-4 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </label>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Estado:
              <input
                type="text"
                name="state"
                value={address.state}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md p-4 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </label>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
              CEP:
              <input
                type="text"
                name="zipcode"
                value={address.zipcode}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md p-4 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={mutate.isPending}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                mutate.isPending
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
              } focus:outline-none focus:ring-2 focus:ring-offset-2`}
            >
              {mutate.isPending ? "Registrando..." : "Registrar Endereço"}
            </button>
          </div>
        </form>

        {mutate.isError && (
          <p className="mt-4 text-sm text-red-600">
            Erro ao registrar endereço. Tente novamente.
          </p>
        )}
      </div>
    </div>
  );
};
