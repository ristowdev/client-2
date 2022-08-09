import React, { createContext, useEffect, useState } from 'react'
import { useAuth } from '@hooks/useAuth'
import { BASE_URL_CLINIC } from '@common/constants'
import PageLoader from '@components/loader'
import cookie from 'js-cookie'
import { useRequest } from '@services/api'

export const ClinicContext = createContext()

const ClinicContextProvider = React.memo((props) => {
  const { token } = useAuth()

  const [clinics, setClinics] = useState([])
  const [selectedClinic, setSelectedClinic] = useState(false)
  const [clinicId, setClinicId] = useState()
  const [userDetails, setUserDetails] = useState()
  const [loading, setLoading] = useState(true)

  const cookieClinicId = cookie.get('clinic_id')

  const { data, revalidate } = useRequest(`${BASE_URL_CLINIC}/GetMyClinics`, { token })

  useEffect(() => {
    if (data) {
      setClinics(data.clinics)
      setUserDetails(data.member_header)
      setLoading(false)
      setSelectedClinic(data.clinics.filter(o => o.id === +clinicId)[0])
    }
  }, [data])

  useEffect(() => {
    if (clinics.length > 0) {
      if (cookieClinicId) {
        setClinicId(cookieClinicId)
      } else {
        setClinicId(clinics[0].id)
        cookie.set('clinic_id', clinics[0].id, { expires: 365 })
      }
    }
  }, [clinics])

  useEffect(() => {
    if (clinicId && cookieClinicId) {
      if (clinicId != cookieClinicId) {
        cookie.set('clinic_id', clinicId, { expires: 365 })
      }
    }
    setSelectedClinic(clinics.filter(o => o.id === +clinicId)[0])
    setLoading(false)
  }, [clinicId])

  return (
    <ClinicContext.Provider
      value={{
        data,
        clinics,
        userDetails,
        clinicId,
        setClinicId,
        setSelectedClinic,
        selectedClinic,
        revalidateClinics: revalidate,
      }}>
      {loading || !selectedClinic ? <PageLoader/> : props.children}
    </ClinicContext.Provider>
  )
})

export default ClinicContextProvider
