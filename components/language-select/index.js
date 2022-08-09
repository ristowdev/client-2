import React from 'react'
import Select from 'react-select'
import { useLang } from '@hooks/useLang'

function LanguageSelect() {
  const { lang, setLang } = useLang()

  const options = [
    { label: 'Eng', value: 'Eng' },
    { label: 'Heb', value: 'Heb' }
  ]

  const onChange = (e) => {
    setLang(e.value)
  }

  return (
    <div className="w-full">
      <Select
        menuPlacement="top"
        styles={{
          menu: (provided) => ({ ...provided, zIndex: 9999, border: 0, }),
          indicatorSeparator: () => ({ display: 'none' }),
          dropdownIndicator: () => ({
            color: '#fff',
            position: 'absolute',
            left: lang === 'Heb' ? 'unset' : '40px',
            right: lang === 'Heb' ? '40px' : 'unset',
            top: '5px'
          }),
          singleValue: () => ({ color: '#fff', fontWeight: '500' }),
          control: () => ({ border: 0, display: 'flex' })
        }}
        options={options}
        onChange={onChange}
        value={options.filter(o => o.value === lang)[0]}
      >
      </Select>
    </div>
  )
}

export default LanguageSelect