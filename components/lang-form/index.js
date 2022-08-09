import React, { useEffect, useState } from 'react'
import { capitalizeFirstLetter } from '@utils/helpers'

function LangForm({ languages, lang, setLang }) {
  const [langKey, setLangKey] = useState()

  useEffect(() => {
    setLangKey(capitalizeFirstLetter(lang))
  }, [lang])

  return (
    <div className="text-left mt-2 flex">
      {languages.map(l => (
        <a
          key={l.display_name}
          className={`txt1 mr-3 ${langKey === l.language_key && 'font-bold text-black'}`}
          onClick={() => setLang(l.language_key)}
        >
          {l.display_name}
        </a>
      ))}
    </div>
  )
}

export default LangForm