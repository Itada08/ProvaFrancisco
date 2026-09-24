import { useEffect, useState } from 'react'
import FormularioIdeia from './components/FormularioIdeia.jsx'
import ListaIdeias from './components/ListaIdeias.jsx'
import './App.css'

const API_URL = 'https://jsonplaceholder.typicode.com/todos'
const HEADERS = { 'Content-Type': 'application/json' }

export default function App() {
  // Lista 
  const [ideias, setIdeias] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  // Formulário
  const [titulo, setTitulo] = useState('')
  const [editandoId, setEditandoId] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [erroAcao, setErroAcao] = useState(null)

  // GET inicial com AbortController
  useEffect(() => {
    const controle = new AbortController()

    async function buscar() {
      try {
        const resp = await fetch(`${API_URL}?_limit=15`, { signal: controle.signal })
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
        const data = await resp.json()
        setIdeias(data)
      } catch (e) {
        if (e.name !== 'AbortError') setErro(e.message)
      } finally {
        if (!controle.signal.aborted) setCarregando(false)
      }
    }

    buscar()

    return () => controle.abort()
  }, [])

  function iniciarEdicao(ideia) {
    setEditandoId(ideia.id)
    setTitulo(ideia.title)
    setErroAcao(null)
  }

  function cancelar() {
    setEditandoId(null)
    setTitulo('')
    setErroAcao(null)
  }


  async function salvar(e) {
    e.preventDefault()

    if (!titulo.trim()) {
      setErroAcao('Escreva um título para a ideia.')
      return
    }

    setEnviando(true)
    setErroAcao(null)

    try {
      if (editandoId) {
        const ideiaAtual = ideias.find((i) => i.id === editandoId)
        const resp = await fetch(`${API_URL}/${editandoId}`, {
          method: 'PUT',
          headers: HEADERS,
          body: JSON.stringify({ ...ideiaAtual, title: titulo }),
        })
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
        setIdeias((prev) =>
          prev.map((i) => (i.id === editandoId ? { ...i, title: titulo } : i))
        )
      } else {
        const resp = await fetch(API_URL, {
          method: 'POST',
          headers: HEADERS,
          body: JSON.stringify({ userId: 1, title: titulo, completed: false }),
        })
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
        const criada = await resp.json()
        
        setIdeias((prev) => [...prev, { ...criada, id: Date.now() }])
      }
      cancelar() // limpa o formulário depois de ocorrer o sucesso
    } catch (e) {
      setErroAcao(e.message) // se der erro, o título permanece preenchido
    } finally {
      setEnviando(false)
    }
  }

  //  excluir 
  async function excluir(ideia) {
    const anterior = ideias
    setIdeias((prev) => prev.filter((i) => i.id !== ideia.id))
    setErroAcao(null)

    try {
      const resp = await fetch(`${API_URL}/${ideia.id}`, { method: 'DELETE' })
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    } catch (e) {
      setIdeias(anterior) 
      setErroAcao(e.message)
    }
  }

  // alternar pendente/executada com PUT, sem refazer o GET
  async function alternarStatus(ideia) {
    const anterior = ideias
    const atualizada = { ...ideia, completed: !ideia.completed }
    setIdeias((prev) => prev.map((i) => (i.id === ideia.id ? atualizada : i)))
    setErroAcao(null)

    try {
      const resp = await fetch(`${API_URL}/${ideia.id}`, {
        method: 'PUT',
        headers: HEADERS,
        body: JSON.stringify(atualizada),
      })
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    } catch (e) {
      setIdeias(anterior) // cancelar a alteração e voltar atras -- quando for feito alteração e der erro, mantera oque ja estava escrito antes.
      setErroAcao(e.message)
    }
  }

  return (
    <div className="pagina">
      <header className="cabecalho">
        <h1>Banco de Ideias</h1>
      </header>

      <main className="conteudo">
        <aside className="coluna-formulario">
          <FormularioIdeia
            titulo={titulo}
            onMudarTitulo={setTitulo}
            onSubmit={salvar}
            emEdicao={editandoId !== null}
            onCancelar={cancelar}
            enviando={enviando}
            erroAcao={erroAcao}
          />
        </aside>

        <section className="area-lista">
          <ListaIdeias
            ideias={ideias}
            carregando={carregando}
            erro={erro}
            onAlternar={alternarStatus}
            onEditar={iniciarEdicao}
            onExcluir={excluir}
          />
        </section>
      </main>
    </div>
  )
}
