export default function CartaoIdeia({ ideia, onAlternar, onEditar, onExcluir }) {
  return (
    <li className={`cartao ${ideia.completed ? 'cartao--feita' : ''}`}>
      <p className="cartao__titulo">{ideia.title}</p>

      <div className="cartao__rodape">
        <span className="cartao__badge">
          {ideia.completed ? 'Executada' : 'Pendente'}
        </span>

        <div className="cartao__acoes">
          <button type="button" className="botao botao--ghost" onClick={() => onAlternar(ideia)}>
            {ideia.completed ? 'Reabrir' : 'Concluir'}
          </button>
          <button type="button" className="botao botao--ghost" onClick={() => onEditar(ideia)}>
            Editar
          </button>
          <button type="button" className="botao botao--perigo" onClick={() => onExcluir(ideia)}>
            Excluir
          </button>
        </div>
      </div>
    </li>
  )
}
