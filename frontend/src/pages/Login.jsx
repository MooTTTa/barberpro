import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login } from '../api/agendamentos'

export default function Login() {
  const { register, handleSubmit } = useForm()
  const { signin } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      const res = await login({ email: data.email, senha: data.senha })
      signin(res.data)
      navigate('/painel')
    } catch {
      alert('Email ou senha invalidos')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-1">BarberPro</h1>
        <p className="text-center text-gray-500 text-sm mb-6">Acesso do barbeiro</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register('email')}
            type="email"
            placeholder="Email"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            {...register('senha')}
            type="password"
            placeholder="Senha"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="submit"
            className="w-full bg-black text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-800 transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}
