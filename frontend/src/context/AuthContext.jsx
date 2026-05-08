import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token')
    const nome  = localStorage.getItem('nome')
    return token ? { token, nome } : null
  })

  const signin = ({ token, nome, role }) => {
    localStorage.setItem('token', token)
    localStorage.setItem('nome', nome)
    setUser({ token, nome, role })
  }

  const signout = () => {
    localStorage.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, signin, signout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
