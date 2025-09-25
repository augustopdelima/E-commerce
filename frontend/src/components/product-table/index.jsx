import { Link } from "react-router";
import "./index.css";

/** 
 * Componente para exibir uma tabela de produtos.
 *
 * @component
 * @param {Object} props - Propriedades do componente.
 * @param {Object[]} props.products - Lista de produtos.
 * @param {(number|string)} props.products[].id - ID do produto.
 * @param {string} props.products[].name - Nome do produto.
 * @param {string} props.products[].description - Descrição do produto.
 * @param {number} props.products[].price - Preço do produto.
 * @param {number} props.products[].stock - Quantidade em estoque.
 * @returns {JSX.Element} Tabela de produtos.
 */
export function ProductTable({ products }) {
  return (
    <table className="product-table">
      <thead>
        <tr>
          <th>Identificador</th>
          <th>Nome</th>
          <th>Descrição</th>
          <th>Preço</th>
          <th>Estoque</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <th>{product.id}</th>
            <td>{product.name}</td>
            <td>{product.description}</td>
            <td>R$ {product.price.toFixed(2)}</td>
            <td>{product.stock}</td>
            <td className="actions-cell">
              <Link
                to={`/admin/edit-product/${product.id}`}
                className="btn-edit"
              >
                Editar
              </Link>
              <button className="btn-delete">Excluir</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
