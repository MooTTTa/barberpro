import { useState, useEffect } from 'react'
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, addDays, isSameDay, isToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { listarPorSemana, listarTodos, cancelarAgendamento, confirmarAgendamento, recusarAgendamento } from '../api/agendamentos'
import { useAuth } from '../context/AuthContext'

const statusConfig = {
  PENDENTE:   { label: 'Pendente',   style: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  CONFIRMADO: { label: 'Confirmado', style: 'bg-green-100 text-green-700 border-green-200'   },
  CANCELADO:  { label: 'Cancelado',  style: 'bg-red-100 text-red-700 border-red-200'         },
  CONCLUIDO:  { label: 'Concluído',  style: 'bg-gray-100 text-gray-500 border-gray-200'      },
}

function DrawerLista({ titulo, agendamentos, onClose, onConfirmar, onRecusar, onCancelar }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-zinc-900 border-l border-zinc-800 flex flex-col h-full shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h2 className="text-white font-semibold">{titulo}</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white text-xl transition">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {agendamentos.length === 0 && (
            <p className="text-zinc-500 text-sm text-center py-8">Nenhum agendamento</p>
          )}
          {agendamentos.map(ag => (
            <div key={ag.id} className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-white font-semibold">{ag.clienteNome}</p>
                  <p className="text-zinc-400 text-sm">{ag.servicoNome} · {ag.duracaoMinutos}min</p>
                  <p className="text-zinc-500 text-xs">{ag.clienteTelefone}</p>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm font-medium">
                    {format(new Date(ag.dataHora), "dd/MM · HH:mm")}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${statusConfig[ag.status]?.style}`}>
                    {statusConfig[ag.status]?.label}
                  </span>
                </div>
              </div>

              {ag.barbeiroNome && (
                <p className="text-zinc-500 text-xs mb-2">💈 {ag.barbeiroNome}</p>
              )}
              {ag.observacao && (
                <p className="text-zinc-500 text-xs mb-2">📝 {ag.observacao}</p>
              )}

              {ag.status === 'PENDENTE' && (
                <div className="flex gap-2 mt-2">
                  <button onClick={() => onConfirmar(ag.id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium py-2 rounded-lg transition">
                    Confirmar
                  </button>
                  <button onClick={() => onRecusar(ag.id)} className="flex-1 bg-red-900/40 hover:bg-red-900/60 text-red-400 text-xs font-medium py-2 rounded-lg transition border border-red-800">
                    Recusar
                  </button>
                </div>
              )}
              {ag.status === 'CONFIRMADO' && (
                <button onClick={() => onCancelar(ag.id)} className="mt-2 text-xs text-red-400 hover:underline">
                  Cancelar agendamento
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Painel() {
  const { user, signout } = useAuth()
  const [semanaBase, setSemanaBase] = useState(new Date())
  const [agendamentos, setAgendamentos] = useState([])
  const [todos, setTodos] = useState([])
  const [drawer, setDrawer] = useState(null)

  const inicioSemana = startOfWeek(semanaBase, { weekStartsOn: 1 })
  const fimSemana    = endOfWeek(semanaBase, { weekStartsOn: 1 })
  const dias         = Array.from({ length: 7 }, (_, i) => addDays(inicioSemana, i))

  const carregarSemana = () => {
    listarPorSemana(
      format(inicioSemana, 'yyyy-MM-dd'),
      format(fimSemana, 'yyyy-MM-dd')
    ).then(r => setAgendamentos(r.data))
  }

  const carregarTodos = () => {
    listarTodos().then(r => setTodos(r.data))
  }

  const carregar = () => { carregarSemana(); carregarTodos() }

  useEffect(() => { carregarSemana() }, [semanaBase])
  useEffect(() => { carregarTodos() }, [])

  const confirmar = async (id) => { await confirmarAgendamento(id); carregarSemana(); carregarTodos() }
  const recusar   = async (id) => { if (!confirm('Recusar?')) return; await recusarAgendamento(id); carregarSemana(); carregarTodos() }
  const cancelar  = async (id) => { if (!confirm('Cancelar?')) return; await cancelarAgendamento(id); carregarSemana(); carregarTodos() }

  const agsPorDia = (dia) =>
    agendamentos
      .filter(a => isSameDay(new Date(a.dataHora), dia))
      .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))

  const pendentes   = todos.filter(a => a.status === 'PENDENTE')
  const confirmados = todos.filter(a => a.status === 'CONFIRMADO')

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">

      {/* Header */}
      <header className="bg-black border-b border-zinc-800 px-6 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-6 h-0.5 bg-amber-400" />
          <h1 className="font-bold text-white text-lg">BarberPro</h1>
        </div>
        <div className="flex items-center gap-5">
          <button
            onClick={() => setDrawer('PENDENTE')}
            className="flex items-center gap-1.5 hover:opacity-80 transition"
          >
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            <span className="text-yellow-400 font-semibold text-sm">{pendentes.length} pendentes</span>
          </button>
          <span className="text-zinc-700">·</span>
          <button
            onClick={() => setDrawer('CONFIRMADO')}
            className="flex items-center gap-1.5 hover:opacity-80 transition"
          >
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-green-400 font-semibold text-sm">{confirmados.length} confirmados</span>
          </button>
          <span className="text-zinc-500 text-sm">{user?.nome}</span>
          <button onClick={signout} className="text-zinc-500 text-sm hover:text-white transition">Sair</button>
        </div>
      </header>

      {/* Navegação da semana */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-6 py-3 flex items-center justify-between shrink-0">
        <button
          onClick={() => setSemanaBase(subWeeks(semanaBase, 1))}
          className="text-zinc-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-zinc-800 text-sm"
        >
          ← Semana anterior
        </button>
        <div className="text-center">
          <p className="text-white font-semibold text-sm">
            {format(inicioSemana, "d 'de' MMM", { locale: ptBR })} — {format(fimSemana, "d 'de' MMM 'de' yyyy", { locale: ptBR })}
          </p>
          <button onClick={() => setSemanaBase(new Date())} className="text-amber-400 text-xs hover:underline mt-0.5">
            Hoje
          </button>
        </div>
        <button
          onClick={() => setSemanaBase(addWeeks(semanaBase, 1))}
          className="text-zinc-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-zinc-800 text-sm"
        >
          Próxima semana →
        </button>
      </div>

      {/* Grade de dias */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex h-full min-w-[900px]" style={{ minHeight: 'calc(100vh - 120px)' }}>
          {dias.map(dia => {
            const ags = agsPorDia(dia)
            const hoje = isToday(dia)

            return (
              <div key={dia.toISOString()} className="flex-1 border-r border-zinc-800 last:border-r-0 flex flex-col">
                <div className={`px-3 py-3 border-b border-zinc-800 text-center shrink-0 ${hoje ? 'bg-amber-400/10' : 'bg-zinc-900'}`}>
                  <p className={`text-xs font-semibold uppercase tracking-wider ${hoje ? 'text-amber-400' : 'text-zinc-500'}`}>
                    {format(dia, 'EEE', { locale: ptBR })}
                  </p>
                  <p className={`text-xl font-bold mt-0.5 ${hoje ? 'text-amber-400' : 'text-white'}`}>
                    {format(dia, 'd')}
                  </p>
                  {ags.length > 0 && (
                    <span className="text-xs text-zinc-600">{ags.length} ag.</span>
                  )}
                </div>

                <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                  {ags.length === 0 && (
                    <p className="text-zinc-800 text-xs text-center pt-8">—</p>
                  )}
                  {ags.map(ag => (
                    <div key={ag.id} className="rounded-lg border bg-white p-2.5 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-gray-800">{format(new Date(ag.dataHora), 'HH:mm')}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${statusConfig[ag.status]?.style}`}>
                          {statusConfig[ag.status]?.label}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-800 truncate">{ag.clienteNome}</p>
                      <p className="text-gray-500 truncate">{ag.servicoNome}</p>

                      {ag.status === 'PENDENTE' && (
                        <div className="flex gap-1 mt-2">
                          <button onClick={() => confirmar(ag.id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded py-1 font-medium transition">✓</button>
                          <button onClick={() => recusar(ag.id)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 rounded py-1 font-medium transition border border-red-200">✕</button>
                        </div>
                      )}
                      {ag.status === 'CONFIRMADO' && (
                        <button onClick={() => cancelar(ag.id)} className="mt-1.5 w-full text-red-400 hover:text-red-600 text-xs hover:underline">
                          Cancelar
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Drawer lateral */}
      {drawer && (
        <DrawerLista
          titulo={drawer === 'PENDENTE' ? `Pendentes (${pendentes.length})` : `Confirmados (${confirmados.length})`}
          agendamentos={drawer === 'PENDENTE' ? pendentes : confirmados}
          onClose={() => setDrawer(null)}
          onConfirmar={confirmar}
          onRecusar={recusar}
          onCancelar={cancelar}
        />
      )}
    </div>
  )
}
