import React from 'react'
import Router from 'next/router'
import NProgress from 'nprogress'
import AuthContextProvider from '@context/AuthContextProvider'
import Head from 'next/head'
import LangContextProvider from '@context/LangContextProvider'

// module styles
import 'react-toastify/dist/ReactToastify.css'
import 'react-time-picker/dist/TimePicker.css'
import 'rc-slider/assets/index.css'
import 'react-responsive-modal/styles.css'
import 'rc-time-picker/assets/index.css'
import 'react-popper-tooltip/dist/styles.css'
import 'react-input-range-rtl/lib/css/index.css'
import 'react-accessible-accordion/dist/fancy-example.css';
// app styles
import '../styles/app.css'
import '../styles/nprocess.css'

// running process bar
NProgress.configure({ showSpinner: false })
Router.onRouteChangeStart = () => NProgress.start()
Router.onRouteChangeComplete = () => {
  NProgress.done()
}
Router.onRouteChangeError = () => NProgress.done()

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
      </Head>
      <AuthContextProvider>
        <LangContextProvider>
          <Component {...pageProps} />
        </LangContextProvider>
      </AuthContextProvider>
    </>
  )
}


export default App

