import { useState, useEffect } from 'react'
import { clinicService } from '@services/index'

export function useMembers(data) {
  const [members, setMembers] = useState([])

  useEffect(() => {
    clinicService.getClinicMembers(data).then((members) => setMembers(members))
  }, [])

  return members
}