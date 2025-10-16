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
    onSettled: () => {
      console.log("Mutação finalizada");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate.mutate(address);
  };

  if (!user) return <div>Usuário não autenticado</div>;

  return (
    <section>
      <h2>Registrar Novo Endereço</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Rua:</label>
          <input
            type="text"
            name="street"
            value={address.street}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Número:</label>
          <input
            type="text"
            name="number"
            value={address.number}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Cidade:</label>
          <input
            type="text"
            name="city"
            value={address.city}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Estado:</label>
          <input
            type="text"
            name="state"
            value={address.state}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>CEP:</label>
          <input
            type="text"
            name="zipcode"
            value={address.zipcode}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={mutate.isPending}>
          {mutate.isPending ? "Registrando..." : "Registrar Endereço"}
        </button>
      </form>
      {mutate.isError && (
        <div>Erro ao registrar endereço. Tente novamente.</div>
      )}
    </section>
  );
};
