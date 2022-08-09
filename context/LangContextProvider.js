import React, { Fragment } from 'react'
import { createContext, useEffect, useState } from 'react'
import cookie from 'js-cookie'
import { useTranslations } from '@hooks/shared/translations'
import { useLanguages } from '@hooks/shared/languages'
import { ToastContainer } from 'react-toastify'

export const LanguageContext = createContext()

const LanguageContextProvider = (props) => {
  const languageCookie = cookie.get('language_key')
  const [lang, setLang] = useState(languageCookie || 'Eng')
  const translations = useTranslations(lang?.toLowerCase() || 'eng')
  const languages = useLanguages()

  useEffect(() => {
    if (lang === 'Heb') {
      document.getElementsByTagName('body')[0].setAttribute('dir', 'rtl')
    }
  }, [])

  useEffect(() => {
    if (!languageCookie) {
      cookie.set('language_key', 'Eng', { expires: 365 })
    }
    if (lang !== languageCookie) {
      window.location.reload()
    }
    if (lang !== languageCookie) {
      cookie.set('language_key', lang, { expires: 365 })
    }
  }, [lang])

  return (
    <LanguageContext.Provider
      value={{
        lang: lang,
        setLang: setLang,
        translations: translations,
        languages: languages
      }}
    >
      <Fragment>
        <ToastContainer rtl={lang === "Heb"}/>
        {props.children}
      </Fragment>
    </LanguageContext.Provider>
  )
}

export default LanguageContextProvider
