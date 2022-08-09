import { useState, useEffect } from 'react'
import { translationService } from '@services/index'

export function useTranslations(lang) {
  const [translation, setTranslation] = useState([])

  useEffect(() => {
    translationService.getTranslations(lang).then(({ data }) => setTranslation(data))
  }, [])
  return translation
}