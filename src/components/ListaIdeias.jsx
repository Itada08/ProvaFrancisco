import CartaoIdeia from './CartaoIdeia.jsx'

export default function ListaIdeias({ ideias, carregando, erro, onAlternar, onEditar, onExcluir }) {
  if (carregando) {
    return <p className="estado estado--carregando">Carregando ideias...</p>
  }

  if (erro) {
    return (
      <div className="estado estado--erro">
        <p>Não foi possível conectar à API.</p>
        <p className="estado__detalhe">Verifique sua conexão com a internet e recarregue a página.</p>
        <p className="estado__detalhe">({erro})</p>
      </div>
    )
  }

  if (ideias.length === 0) {
    return (
      <p className="estado estado--vazio">
        Nenhuma ideia por aqui — que tal cadastrar a primeira?
      </p>
    )
  }

  return (
    <ul className="lista">
      {ideias.map((ideia) => (
        <CartaoIdeia
          key={ideia.id}
          ideia={ideia}
          onAlternar={onAlternar}
          onEditar={onEditar}
          onExcluir={onExcluir}
        />
      ))}
    </ul>
  )
}
