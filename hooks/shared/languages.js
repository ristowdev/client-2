import { useState, useEffect } from 'react'
import { translationService } from '@services/index'

export function useLanguages() {
  const [languages, setLanguages] = useState([])

  useEffect(() => {
    translationService.getLanguages().then(({ data }) => setLanguages(data))
  }, [])
  return languages
}