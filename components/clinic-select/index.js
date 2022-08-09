import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { useClinic } from '@hooks/useClinic'
import { useLang } from '@hooks/useLang'
import CreateClinicModal from '@components/modals/create-clinic'
import { useAuth } from '@hooks/useAuth'
import { renderClinicPlan } from '@utils/helpers'
import { useRouter } from 'next/router'

function ClinicSelect() {
  const router = useRouter()
  const { token } = useAuth()
  const { lang, translations } = useLang()
  const { clinics, clinicId, setClinicId, revalidateClinics } = useClinic()

  const T = translations

  const defaultOption = {
    value: 'ADD_NEW_CLINIC',
    label: <div className="flex items-center cursor-pointer">
      <div className="flex items-center justify-center" style={{ width: '44px', height: '44px' }}>
        <i className="fas fa-plus text-3xl" style={{ color: 'gray' }}/>
      </div>
      <span className="mx-3" style={{ color: 'gray' }}>{T['Page.Master.NewClinicItem.Caption']}</span>
    </div>
  }

  const [options, setOptions] = useState([])
  const [showModal, setShowModal] = useState(false)

  const handleOptionLink = () => {
    router.push('/clinic-details')
  }

  useEffect(() => {
    const clinicsOptions = clinics.map(clinic => {
      return {
        value: clinic.id,
        label:
          <div className="flex items-center cursor-pointer">
            <img src={clinic.mini_image_url}/>
            <div>
              <span className="mx-3">{clinic.display_name}</span>
              <div className="w-24 mx-3 text-sm">
                {renderClinicPlan(clinic.active_plan.key_name, clinic.active_plan.key_name.toUpperCase())}
              </div>
            </div>
          </div>,
      }
    })

    clinicsOptions.push(defaultOption)

    setOptions(clinicsOptions)
  }, [clinics, translations])

  const onChange = (e) => {
    if (e.value === 'ADD_NEW_CLINIC') {
      setShowModal(true)
    } else {
      handleOptionLink()
      setClinicId(e.value)
    }
  }

  return (
    <div className="w-full">
      <Select
        isSearchable={false}
        styles={{
          menu: (provided) => ({ ...provided, zIndex: 9999, border: 0, }),
          indicatorSeparator: () => ({ display: 'none' }),
          dropdownIndicator: () => ({
            color: '#fff',
            position: 'absolute',
            right: lang === 'Heb' ? 'unset' : '5px',
            left: lang === 'Heb' ? '5px' : 'unset',
            top: '10px'
          }),
          singleValue: () => ({ color: '#fff !important', fontWeight: '500', width: '100%' }),
          control: () => ({ border: 0, display: 'flex' }),
          option: (provided) => ({ ...provided, color: '#000' })
        }}
        options={options}
        onChange={onChange}
        value={options.filter(o => o.value === +clinicId)[0]}
      >
      </Select>
      <CreateClinicModal
        token={token}
        modalIsOpen={showModal}
        onCloseModal={() => setShowModal((prevState) => !prevState)}
        revalidate={revalidateClinics}
      />
    </div>
  )
}

export default ClinicSelect