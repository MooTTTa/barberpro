import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { listarPorDia, cancelarAgendamento } from '../api/agendamentos'
import { useAuth } from '../context/AuthContext'

export default function Painel() {
  const { user, signout } = useAuth()
  const [data, setData] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [agendamentos, setAgendamentos] = useState([])

  const carregar = () =>
    listarPorDia(data).then(r => setAgendamentos(r.data))

  useEffect(() => { carregar() }, [data])

  const cancelar = async (id) => {
    if (!confirm('Cancelar este agendamento?')) return
    await cancelarAgendamento(id)
    carregar()
  }

  const statusColor = {
    CONFIRMADO: 'bg-green-100 text-green-700',
    PENDENTE:   'bg-yellow-100 text-yellow-700',
    CANCELADO:  'bg-red-100 text-red-700',
    CONCLUIDO:  'bg-gray-100 text-gray-600',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white px-6 py-4 flex justify-between items-center">
        <h1 className="font-bold text-lg">BarberPro</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300">{user?.nome}</span>
          <button onClick={signout} className="text-sm underline">Sair</button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <input
            type="date"
            value={data}
            onChange={e => setData(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <span className="text-gray-500 text-sm">{agendamentos.length} agendamento(s)</span>
        </div>

        <div className="space-y-3">
          {agendamentos.length === 0 && (
            <p className="text-center text-gray-400 py-12">Nenhum agendamento neste dia</p>
          )}
          {agendamentos.map(ag => (
            <div key={ag.id} className="bg-white rounded-xl border p-4 flex justify-between items-start">
              <div>
                <p className="font-medium">{ag.clienteNome}</p>
                <p className="text-sm text-gray-500">{ag.servicoNome} · {ag.duracaoMinutos}min</p>
                <p className="text-sm text-gray-400">{ag.clienteTelefone}</p>
                {ag.observacao && (
                  <p className="text-xs text-gray-400 mt-1">{ag.observacao}</p>
                )}
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <span className="text-sm font-medium">
                  {format(new Date(ag.dataHora), 'HH:mm')}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[ag.status]}`}>
                  {ag.status}
                </span>
                {ag.status === 'CONFIRMADO' && (
                  <button
                    onClick={() => cancelar(ag.id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
