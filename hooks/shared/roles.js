import { useState, useEffect } from 'react'
import { clinicService } from '@services/index'

export function useRoles() {
  const [roles, setRoles] = useState([])

  useEffect(() => {
    clinicService.getRoles().then((data) => setRoles(data))
  }, [])
  return roles
}