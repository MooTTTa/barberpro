import api from './client'

export const criarAgendamento    = (data)  => api.post('/agendamentos', data)
export const listarPorDia        = (data)  => api.get('/agendamentos/dia', { params: { data } })
export const cancelarAgendamento = (id)    => api.patch(`/agendamentos/${id}/cancelar`)
export const listarServicos      = ()      => api.get('/servicos')
export const listarBarbeiros     = ()      => api.get('/barbeiros')
export const login               = (creds) => api.post('/auth/login', creds)
