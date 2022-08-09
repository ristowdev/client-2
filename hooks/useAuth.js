import { useContext } from 'react'
import { UserContext } from '@context/AuthContextProvider'

export const useAuth = () => {
  const { user, token, login, login2, register, logout, setUser } = useContext(UserContext)
  return { user, token, login, login2, register, logout, setUser }
}
