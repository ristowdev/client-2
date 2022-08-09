import React from 'react'
import { clinicService } from '@services/index'
import { toast } from 'react-toastify'
import { useLang } from '@hooks/useLang'
import { showErrorMessage } from '@utils/helpers'

function RoleSelect({ roles, selectedRole, memberId, clinicId, token, revalidate, canEditRole }) {
  const { translations } = useLang()
  const T = translations

  const onChangeRole = async(e) => {
    const selectedRole = e.target.value
    const values = {
      member_role_key: selectedRole,
      token,
      clinic_id: clinicId,
      member_id: memberId
    }

    try {
      await clinicService.editMemberRole(values)
      await revalidate()
    } catch (e) {
      return toast.error(T[showErrorMessage(e.message)])
    }
  }

  return (
    <select
      defaultValue={selectedRole}
      onChange={onChangeRole}
      disabled={canEditRole === 0}
    >
      {roles.map((role, idx) => (
        <option key={idx} value={role.key}>{T[role.trans_key]}</option>
      ))}
    </select>
  )
}

export default RoleSelect