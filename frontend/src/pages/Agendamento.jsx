import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import DatePicker, { registerLocale } from 'react-datepicker'
import { ptBR } from 'date-fns/locale'
import { format } from 'date-fns'
import 'react-datepicker/dist/react-datepicker.css'
import { criarAgendamento, listarServicos, listarBarbeiros, horariosOcupados } from '../api/agendamentos'
import PhoneInput from '../components/PhoneInput'

registerLocale('pt-BR', ptBR)

const slides = ['/barber1.jpg', '/barber2.jpg', '/barber3.jpg']

export default function Agendamento() {
  const { register, handleSubmit, reset } = useForm()
  const [servicos, setServicos] = useState([])
  const [barbeiros, setBarbeiros] = useState([])
  const [sucesso, setSucesso] = useState(false)
  const [slideAtual, setSlideAtual] = useState(0)
  const [dataHora, setDataHora] = useState(null)
  const [ocupados, setOcupados] = useState([])
  const [erro, setErro] = useState('')
  const [telefone, setTelefone] = useState('')
  const [telefoneFormatado, setTelefoneFormatado] = useState('')

  useEffect(() => {
    listarServicos().then(r => setServicos(r.data))
    listarBarbeiros().then(r => setBarbeiros(r.data))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideAtual(prev => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const filterDate = (date) => date.getDay() !== 0

  const filterTime = (time) => {
    const dia = time.getDay()
    const total = time.getHours() * 60 + time.getMinutes()
    if (dia === 0) return false
    if (dia === 6) return total >= 8 * 60 && total < 13 * 60
    return total >= 9 * 60 && total < 19 * 60
  }

  const handleDataChange = (date) => {
    setDataHora(date)
    setErro('')
    if (date) {
      const dataStr = format(date, 'yyyy-MM-dd')
      horariosOcupados(dataStr).then(r => setOcupados(r.data))
    }
  }

  const isOcupado = (time) => {
    const h = String(time.getHours()).padStart(2, '0')
    const m = String(time.getMinutes()).padStart(2, '0')
    return ocupados.includes(`${h}:${m}`)
  }

  const onSubmit = async (data) => {
    if (!dataHora) { alert('Selecione a data e hora'); return }
    if (!telefone) { alert('Informe o WhatsApp'); return }
    try {
      await criarAgendamento({
        clienteNome: data.clienteNome,
        clienteTelefone: telefone,
        barbeiroId: Number(data.barbeiroId),
        servicoId: Number(data.servicoId),
        dataHora: format(dataHora, "yyyy-MM-dd'T'HH:mm:ss"),
        observacao: data.observacao,
      })
      setSucesso(true)
      reset()
      setDataHora(null)
      setTelefone('')
      setTelefoneFormatado('')
      setTimeout(() => setSucesso(false), 5000)
    } catch (e) {
      setErro(e.response?.data?.message || 'Erro ao agendar. Tente novamente.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* Banner mobile — aparece só em telas pequenas */}
      <div className="lg:hidden relative h-48 overflow-hidden shrink-0">
        {slides.map((src, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === slideAtual ? 1 : 0 }}
          >
            <img src={src} alt="" className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-black/60" />
          </div>
        ))}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-0.5 bg-amber-400" />
            <span className="text-amber-400 text-xs font-semibold tracking-widest uppercase">BarberPro</span>
            <div className="w-6 h-0.5 bg-amber-400" />
          </div>
          <h1 className="text-white text-2xl font-bold">Seu estilo, nossa arte.</h1>
        </div>
      </div>

      {/* Lado esquerdo — fotos com slideshow */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        {slides.map((src, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === slideAtual ? 1 : 0 }}
          >
            <img src={src} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ))}

        <div className="absolute inset-0 flex flex-col justify-end p-12 z-10">
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-2">
            Bem-vindo
          </p>
          <h1 className="text-white text-4xl font-bold leading-tight mb-4">
            Seu estilo,<br />nossa arte.
          </h1>
          <p className="text-gray-300 text-sm max-w-xs">
            Agende seu horário em segundos e receba confirmação direto no WhatsApp.
          </p>
          <div className="flex gap-2 mt-8">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideAtual(i)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === slideAtual ? 'w-8 bg-amber-400' : 'w-2 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lado direito — formulário */}
      <div className="w-full lg:w-1/2 bg-zinc-950 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-0.5 bg-amber-400" />
              <span className="text-amber-400 text-xs font-semibold tracking-widest uppercase">
                BarberPro
              </span>
            </div>
            <h2 className="text-white text-3xl font-bold">Agendar horário</h2>
            <p className="text-zinc-400 text-sm mt-1">
              Preencha os dados e receba confirmação pelo WhatsApp
            </p>
          </div>

          {sucesso && (
            <div className="bg-amber-400/10 border border-amber-400/30 text-amber-400 rounded-lg p-4 mb-6 text-sm flex items-center gap-2">
              <span>✓</span>
              Solicitação enviada! Aguarde a confirmação pelo WhatsApp.
            </div>
          )}

          {erro && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4 mb-6 text-sm flex items-center gap-2">
              <span>✕</span>
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div>
              <label className="text-zinc-400 text-xs uppercase tracking-wider mb-1.5 block">
                Seu nome
              </label>
              <input
                {...register('clienteNome')}
                required
                placeholder="João Silva"
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg px-4 py-3 text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            <div>
              <label className="text-zinc-400 text-xs uppercase tracking-wider mb-1.5 block">
                WhatsApp
              </label>
              <PhoneInput
                value={telefoneFormatado}
                onChange={(e164, formatado) => {
                  setTelefone(e164)
                  setTelefoneFormatado(formatado)
                }}
              />
            </div>

            <div>
              <label className="text-zinc-400 text-xs uppercase tracking-wider mb-1.5 block">
                Barbeiro
              </label>
              <select
                {...register('barbeiroId')}
                required
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition"
              >
                <option value="">Selecione o barbeiro</option>
                {barbeiros.map(b => (
                  <option key={b.id} value={b.id}>{b.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-zinc-400 text-xs uppercase tracking-wider mb-1.5 block">
                Serviço
              </label>
              <select
                {...register('servicoId')}
                required
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition"
              >
                <option value="">Selecione o serviço</option>
                {servicos.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.nome} — R$ {s.preco} ({s.duracaoMinutos}min)
                  </option>
                ))}
              </select>
            </div>

            {/* Date Picker */}
            <div>
              <label className="text-zinc-400 text-xs uppercase tracking-wider mb-1.5 block">
                Data e hora
              </label>
              <DatePicker
                selected={dataHora}
                onChange={handleDataChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={30}
                dateFormat="dd/MM/yyyy 'às' HH:mm"
                locale="pt-BR"
                placeholderText="Selecione a data e hora"
                minDate={new Date()}
                filterDate={filterDate}
                filterTime={(time) => filterTime(time) && !isOcupado(time)}
                timeClassName={(time) => isOcupado(time) ? 'horario-ocupado' : ''}
                dayClassName={date => date.getDay() === 0 ? 'domingo-fechado' : undefined}
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg px-4 py-3 text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition"
                calendarClassName="barberpro-calendar"
                wrapperClassName="w-full"
              />
              <p className="text-zinc-600 text-xs mt-1">
                Seg–Sex: 09h às 19h &nbsp;·&nbsp; Sáb: 08h às 13h &nbsp;·&nbsp; Dom: fechado
              </p>
            </div>

            <div>
              <label className="text-zinc-400 text-xs uppercase tracking-wider mb-1.5 block">
                Observação <span className="normal-case text-zinc-600">(opcional)</span>
              </label>
              <input
                {...register('observacao')}
                placeholder="Ex: quero degradê na máquina 2"
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg px-4 py-3 text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-400 hover:bg-amber-300 text-black font-semibold rounded-lg py-3 text-sm transition mt-2"
            >
              Confirmar agendamento
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
