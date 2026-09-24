export default function FormularioIdeia({
  titulo,
  onMudarTitulo,
  onSubmit,
  emEdicao,
  onCancelar,
  enviando,
  erroAcao,
}) {
  return (
    <form className="formulario" onSubmit={onSubmit}>
      <h2>{emEdicao ? 'Editar ideia' : 'Nova ideia'}</h2>

      <label className="campo">
        <span>Título da ideia</span>
        <input
          name="title"
          value={titulo}
          onChange={(e) => onMudarTitulo(e.target.value)}
          placeholder="Ex: Jogar futebol com o Messi"
          disabled={enviando}
        />
      </label>

      <div className="formulario__acoes">
        <button className="botao botao--primario" disabled={enviando}>
          {enviando ? 'Salvando...' : emEdicao ? 'Salvar' : 'Adicionar ideia'}
        </button>
        {emEdicao && (
          <button type="button" className="botao botao--ghost" onClick={onCancelar} disabled={enviando}>
            Cancelar
          </button>
        )}
      </div>

      {erroAcao && <p className="formulario__erro">Erro: {erroAcao}</p>}
    </form>
  )
}
