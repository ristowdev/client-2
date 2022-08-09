import React from 'react'
import { useLang } from '@hooks/useLang'
import { clinicService } from '@services/index'
import { toast } from 'react-toastify'
import { useClinic } from '@hooks/useClinic'
import { showErrorMessage } from '@utils/helpers'

function ClinicAction({ action, revalidate, memberId, token, clinicId }) {
  const { setClinicId, clinics, revalidateClinics } = useClinic()
  const { translations } = useLang()
  const T = translations

  const leaveClinic = async () => {
    const values = {
      clinic_id: clinicId,
      token
    }

    try {
      await clinicService.leaveClinic(values)
      setClinicId(clinics[0].id)
      await revalidate()
      await revalidateClinics()
    } catch (e) {
      return toast.error(T[showErrorMessage(e.message)])
    }
  }

  const removeMember = async () => {
    const values = {
      clinic_id: clinicId,
      token,
      member_id: memberId
    }

    try {
      await clinicService.removeMember(values)
      await revalidate()
    } catch (e) {
      return toast.error(T[showErrorMessage(e.message)])
    }
  }

  return (
    <>
      {action.leave_clinic === 1 &&
        <a
          className="action-link txt-info"
          onClick={leaveClinic}
        >
          {T['Page.ClinicMembers.LeaveClinicAction.Caption']}
        </a>
      }
      {action.remove_member === 1 &&
        <a
          className="action-link txt-info"
          onClick={removeMember}
        >
          {T['Page.ClinicMembers.RemoveMemberAction.Caption']}
        </a>
      }
    </>
  )
}

export default ClinicAction