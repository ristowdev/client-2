import React from 'react'
import { useRouter } from "next/router"
import cookie from 'js-cookie'
import Navigation from '@components/navigation'
import SideNav from '@components/side-nav'
import ClinicContextProvider from '@context/ClinicContextProvider'

const withAuth = (WrappedComponent) => {
  return (props) => {
    // checks whether we are on client / browser or server.
    if (typeof window !== "undefined") {
      const Router = useRouter()

      const cookieToken = cookie.get('clinic_token')

      // If there is no access token we redirect to "/" page.
      if (!cookieToken) {
        Router.replace("/login")
        return null
      }

      // If this is an accessToken we just render the component that was passed with all its props

      return (
        <ClinicContextProvider>
          <Navigation/>
          <SideNav/>
          <div className="page-container">
            <div className="page-content-wrapper">
              <div className="page-content">
                <WrappedComponent {...props} />
              </div>
            </div>
          </div>
        </ClinicContextProvider>
      )
    }

    // If we are on server, return null
    return null
  }
}

export default withAuth