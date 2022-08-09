import React, { useState } from 'react'
import { useLang } from '@hooks/useLang'
import appointmentService from '@services/appointmentService'
import { toast } from 'react-toastify'
import { showErrorMessage } from '@utils/helpers'
import { useAuth } from '@hooks/useAuth'
import AppointmentModal from '@components/modals/appointment'
import { useClinic } from '@hooks/useClinic'

function VisitAppointment({ nextAppointment, revalidate, clinicId, patientId }) {
  const { token } = useAuth()
  const { translations: T, lang } = useLang()
  const { selectedClinic } = useClinic()
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [appointmentId, setAppointmentId] = useState()

  const deleteAppointment = async (appointment_id) => {
    const values = {
      appointment_id,
      token,
      clinic_id: clinicId
    }

    try {
      await appointmentService.deleteAppointment(values)
      await revalidate()
    } catch (e) {
      return toast.error(T[showErrorMessage(e.message)])
    }
  }

  return (
    <div className="py-3 lg:overflow-x-hidden overflow-x-scroll lg:w-auto w-full">
      <div className="flex items-center">
        {nextAppointment.appointment_id ? (
          <div
            className="text-center cursor-pointer lg:min-w-44 min-w-28"
            onClick={() => {
              setShowAppointmentModal(true)
              setAppointmentId(nextAppointment.appointment_id)
            }}
          >
            <a
              className="lg:text-3xl text-base font-medium w-full inline-block text-primary"
            >
              {nextAppointment.friendly.scope_name_trans_key && T[nextAppointment.friendly.scope_name_trans_key]}
            </a>
            <a
              className="lg:text-3xl text-base font-medium w-full inline-block text-primary"
            >
              {nextAppointment.friendly.specifical_value && nextAppointment.friendly.specifical_value}
            </a>
          </div>
        ): (
          <div className="min-w-40 text-center">
            <h4 className="block">
              {T['Page.PatientAppointments.AddNewItem.Caption']}
            </h4>
            <div className="">
              <i className="fas fa-ellipsis-h text-xl"/>
            </div>
          </div>
        )}

        <div className={`flex justify-between w-full border-black h-full ${lang === 'Heb' ? 'border-right pr-10' : 'border-left pl-10'}`}>
          {nextAppointment.appointment_id ? (
            <>
              <div className="min-w-28">
                <h4 className="text-grey lg:text-base text-sm">
                  {T['Page.VisitDetails.DateField.Label']}
                </h4>
                <p className="lg:text-base text-sm">{nextAppointment.friendly.date_value}</p>
                <p className="lg:text-base text-sm">{nextAppointment.friendly.time_value}</p>
              </div>
              <div className="min-w-28">
                <h4 className="text-grey lg:text-base text-sm">
                  {T['Page.PatientAppointments.DurationHeader.Caption']}
                </h4>
                <p className="lg:text-base text-sm">
                  {nextAppointment.duration_minutes && nextAppointment.duration_minutes + " " + T['Page.PatientAppointments.Minutes.Caption']}
                </p>
              </div>
              <div className="min-w-28">
                <h4 className="text-grey lg:text-base text-sm">
                  {T['Page.PatientAppointments.WithHeader.Caption']}
                </h4>
                <p className="lg:text-base text-sm">
                  {nextAppointment.with_member.display_name}
                </p>
              </div>
              <div className="flex items-center">
                <i
                  className={`material-icons text-blue-500 cursor-pointer ${lang === 'Heb' ? 'ml-4' : 'mr-4'}`}
                  onClick={() => {
                    setShowAppointmentModal(true)
                    setAppointmentId(nextAppointment.appointment_id)
                  }}
                >
                  mode_edit
                </i>
                <i
                  className="material-icons text-red-500 cursor-pointer"
                  onClick={() => deleteAppointment(nextAppointment.appointment_id)}
                >
                  delete
                </i>
              </div>
            </>
          ) : (
            <div
              className="flex items-center h-20"
              onClick={() => {
                setShowAppointmentModal(true)
                setAppointmentId(null)
              }}
            >
              <h4 className="text-primary cursor-pointer hover:underline">
                {T['Page.PatientAppointments.AddNewItem.Description']}
              </h4>
            </div>
          )}
        </div>
      </div>
      {showAppointmentModal && (
        <AppointmentModal
          modalIsOpen={showAppointmentModal}
          onCloseModal={() => setShowAppointmentModal(false)}
          appointmentsRevalidation={revalidate}
          patientId={patientId}
          appointmentId={appointmentId}
          token={token}
          clinicId={clinicId}
          formatType={selectedClinic.page_settings.time_format.is_24_hour_format ? "HH:mm" : "hh:mm a"}
        />
      )}
    </div>
  )
}

export default VisitAppointment