import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { criarAgendamento, listarServicos, listarClientes } from '../api/agendamentos'

export default function Agendamento() {
  const { register, handleSubmit, reset } = useForm()
  const [servicos, setServicos] = useState([])
  const [clientes, setClientes] = useState([])
  const [sucesso, setSucesso] = useState(false)

  useEffect(() => {
    listarServicos().then(r => setServicos(r.data))
    listarClientes().then(r => setClientes(r.data))
  }, [])

  const onSubmit = async (data) => {
    try {
      await criarAgendamento({
        clienteId: Number(data.clienteId),
        servicoId: Number(data.servicoId),
        dataHora: data.dataHora,
        observacao: data.observacao,
      })
      setSucesso(true)
      reset()
      setTimeout(() => setSucesso(false), 4000)
    } catch (e) {
      alert(e.response?.data?.message || 'Erro ao agendar')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-1">Agendar horario</h1>
        <p className="text-gray-500 text-sm mb-6">
          Preencha e receba a confirmacao pelo WhatsApp
        </p>

        {sucesso && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-4 text-sm">
            Agendamento confirmado! Verifique seu WhatsApp.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <select
            {...register('clienteId')}
            required
            className="w-full border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Selecione o cliente</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>

          <select
            {...register('servicoId')}
            required
            className="w-full border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Selecione o servico</option>
            {servicos.map(s => (
              <option key={s.id} value={s.id}>
                {s.nome} — R$ {s.preco} ({s.duracaoMinutos}min)
              </option>
            ))}
          </select>

          <input
            {...register('dataHora')}
            type="datetime-local"
            required
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <input
            {...register('observacao')}
            placeholder="Observacao (opcional)"
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <button
            type="submit"
            className="w-full bg-black text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-800 transition"
          >
            Confirmar agendamento
          </button>
        </form>
      </div>
    </div>
  )
}
