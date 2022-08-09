import { useContext } from 'react'
import { LanguageContext } from '@context/LangContextProvider'

export const useLang = () => {
  const { lang, setLang, translations, languages } = useContext(LanguageContext)
  return { lang, setLang, translations, languages }
}
