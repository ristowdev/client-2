import { useContext } from 'react'
import { ClinicContext } from '@context/ClinicContextProvider'

export const useClinic = () => {
  const { data, clinics, userDetails, clinicId, setClinicId, selectedClinic, setSelectedClinic, revalidateClinics } = useContext(ClinicContext)
  return { data, clinics, userDetails, clinicId, setClinicId, selectedClinic, setSelectedClinic, revalidateClinics }
}
