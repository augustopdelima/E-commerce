import { useEffect, useState } from "react";
import { addressService } from "../../../services/addresses";
import { useAuth } from "../../../context/auth/auth_helpers";
import { Link } from "react-router";
import  "./index.css";

export default function AddressList() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const { user } = useAuth();

  const fetchAddresses = async (userId) => {
    try {
      setLoading(true);
      const data = await addressService.getAll(userId);
      setAddresses(data);
    } catch (err) {
      console.error(err);
      setMessage("Erro ao buscar endereços.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (addressId) => {
    try {
      await addressService.remove(user.id, addressId);
      setAddresses(addresses.filter((a) => a.id !== addressId));
      setMessage("Endereço removido com sucesso!");
    } catch (err) {
      console.error(err);
      setMessage("Erro ao remover endereço.");
    }
  };

  useEffect(() => {
    fetchAddresses(user.id);
  }, [user]);

  if (loading) return <p>Carregando endereços...</p>;

  return (
    <div className="address-list-container">
      <h2>Meus Endereços</h2>
      {message && <p className="message">{message}</p>}
      <Link to={"/user/address/register"}>Adicionar outro endereço</Link>
      {addresses.length === 0 ? (
        <p>Nenhum endereço cadastrado.</p>
      ) : (
        <ul className="address-list">
          {addresses.map((address) => (
            <li key={address.id} className="address-item">
              <span>
                {address.street}, {address.number} - {address.city}/
                {address.state} - CEP {address.zipcode}
              </span>
              <button
                className="delete-btn"
                onClick={() => handleDelete(address.id)}
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
