import { useState } from "react";
import { addressService } from "../../../services/addresses";
import { useAuth } from "../../../context/auth/auth_helpers";
import { useNavigate } from "react-router";
import "./index.css";

export default function AddressForm() {
  const [form, setForm] = useState({
    street: "",
    number: "",
    city: "",
    state: "",
    zipcode: "",
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addressService.create(user.id, form);
      setMessage("Endereço cadastrado com sucesso!");
      setForm({
        street: "",
        number: "",
        city: "",
        state: "",
        zipcode: "",
      });
      navigate("/user/address");
    } catch (err) {
      console.error(err);
      setMessage("Erro ao cadastrar endereço.");
    }
  };

  return (
    <div className="address-form-container">
      <h2>Cadastrar Endereço</h2>
      <form className="address-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="street"
          placeholder="Rua"
          value={form.street}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="number"
          placeholder="Número"
          value={form.number}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="city"
          placeholder="Cidade"
          value={form.city}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="state"
          placeholder="Estado"
          value={form.state}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="zipcode"
          placeholder="CEP"
          value={form.zipcode}
          onChange={handleChange}
          required
        />

        <button type="submit">Cadastrar</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
