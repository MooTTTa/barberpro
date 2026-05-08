import api from './client'

export const criarAgendamento    = (data)  => api.post('/agendamentos', data)
export const listarPorDia        = (data)  => api.get('/agendamentos/dia', { params: { data } })
export const listarTodos         = ()      => api.get('/agendamentos/todos')
export const listarPorSemana    = (inicio, fim) => api.get('/agendamentos/semana', { params: { inicio, fim } })
export const cancelarAgendamento  = (id)   => api.patch(`/agendamentos/${id}/cancelar`)
export const confirmarAgendamento = (id)   => api.patch(`/agendamentos/${id}/confirmar`)
export const recusarAgendamento   = (id)   => api.patch(`/agendamentos/${id}/recusar`)
export const listarServicos      = ()      => api.get('/servicos')
export const listarBarbeiros     = ()      => api.get('/barbeiros')
export const horariosOcupados   = (data)  => api.get('/agendamentos/horarios-ocupados', { params: { data } })
export const login               = (creds) => api.post('/auth/login', creds)
