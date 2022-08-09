import { createContext, useEffect, useState } from 'react'
import cookie from 'js-cookie'
import { registerService } from '@services/index'
import { useRouter } from 'next/router'

export const UserContext = createContext()

const AuthContextProvider = (props) => {
  const router = useRouter()

  const [user, setUser] = useState()
  const [token, setToken] = useState()

  // get the token from the cookie
  const cookieToken = cookie.get('clinic_token')

  // login function to be called on a login page
  const login = async (data) => {
    try {
      const { token } = await registerService.login(data)
      // // save the token from the login response in a cookie
      cookie.set('clinic_token', token, { expires: 365 })
      setToken(token)
    } catch (error) {
      throw new Error(error)
    }

    // trigger(`/api/users/${user.id}`)
  }

  // login function to be called on a login page
  const login2 = async (data) => {
    try {
      const { token } = await registerService.login2(data)
      // // save the token from the login response in a cookie
      cookie.set('clinic_token', token, { expires: 365 })
      setToken(token)
    } catch (error) {
      throw new Error(error)
    }

    // trigger(`/api/users/${user.id}`)
  }

  // login function to be called on a login page
  const register = async (data) => {
    try {
      const { token } = await registerService.register(data)
      // // save the token from the login response in a cookie
      cookie.set('clinic_token', token, { expires: 365 })
      setToken(token)
    } catch (error) {
      throw new Error(error)
    }

    // trigger(`/api/users/${user.id}`)
  }

  const logout = () => {
    setToken(null)
    cookie.remove('clinic_id')
    cookie.remove('clinic_token')
    router.push('/login')
  }

  useEffect(() => {
    if (cookieToken) setToken(cookieToken)
  }, [])

  return (
    <UserContext.Provider
      value={{
        user: user,
        token: cookieToken || token,
        login: login,
        login2: login2,
        register: register,
        logout: logout,
        setUser: setUser,
      }}>
      {props.children}
    </UserContext.Provider>
  )
}

export default AuthContextProvider
