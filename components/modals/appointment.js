import React, { useEffect, useState } from 'react'
import { Field, Form } from 'react-final-form'
import Modal from '@components/modals/index'
import { useLang } from '@hooks/useLang'
import Button from '@components/button'
import { getMaxDate, showErrorMessage } from '@utils/helpers'
import TimePicker from 'rc-time-picker'
import { useMembers } from '@hooks/shared/members'
import appointmentService from '@services/appointmentService'
import { toast } from 'react-toastify'
import { useRequest } from '@services/api'
import { BASE_URL_CLINIC } from '@common/constants'
import moment from 'moment'

function AppointmentModal(
  {
    token,
    clinicId,
    patientId,
    appointmentId,
    modalIsOpen,
    onCloseModal,
    appointmentsRevalidation,
    is12Hour,
    formatType
  }
) {
  const members = useMembers({ token, clinic_id: clinicId })

  const {
    data,
    revalidate
  } = useRequest(appointmentId && `${BASE_URL_CLINIC}/GetAppointmentDetails?clinic_id=${clinicId}&appointment_id=${appointmentId}`, { token })

  const { appointment_details, available_actions } = data || {}

  const { translations } = useLang()
  const T = translations

  const [time, setTime] = useState()

  const handleValueChange = value => {
    setTime(value)
  }

  useEffect(() => {
    if (appointment_details?.appointment_time) {
      setTime(moment(appointment_details.appointment_time, formatType))
    }
  }, [data])

  const onSubmit = async (values) => {
    values.token = token
    values.clinic_id = clinicId
    values.patient_id = patientId
    values.appointment_time = time ? moment(time).format(formatType) : null

    if (appointmentId) {
      values.appointment_id = appointmentId
      delete values.patient_id
    }

    try {
      if (appointmentId) {
        await appointmentService.editAppointment(values)
        await revalidate()
      } else {
        await appointmentService.createAppointment(values)
      }
      await appointmentsRevalidation()
      onCloseModal()
    } catch (e) {
      return toast.error(T[showErrorMessage(e.message)])
    }
  }

  return (
    <Modal
      modalIsOpen={modalIsOpen}
      onCloseModal={onCloseModal}
      header={T['Page.AppointmentDetails.Title.Caption']}
    >
      <Form
        onSubmit={onSubmit}
        validate={(values) => {
        }}
        render={({ handleSubmit, submitting, pristine }) => (
          <form onSubmit={handleSubmit} className="form-body">
            <div className="login-form">
              <Field
                type="date"
                name="appointment_date"
                defaultValue={appointmentId && available_actions ? appointment_details.appointment_date : null}
              >
                {({ input, meta }) => (
                  <div className="form-group mb-3">
                    <label>{T['Page.AppointmentDetails.DateField.Label']}</label>
                    <input
                      {...input}
                      min={getMaxDate()}
                      className="form-control input-height"
                      placeholder={T['Page.PatientDetails.DateOfBirthField.Label']}
                    />
                    {meta.error && meta.touched && <span className="text-red-500 text-xs mt-1">{meta.error}</span>}
                  </div>
                )}
              </Field>
              <Field
                type="text"
                name="appointment_time"
                defaultValue={appointmentId && available_actions ? appointment_details.appointment_time : null}
              >
                {({ input, meta }) => (
                  <div className="form-group mb-3">
                    <label>{T['Page.AppointmentDetails.TimeField.Label']}</label>
                    {/*<TimePicker*/}
                    {/*  value={input.value}*/}
                    {/*  format={formatType}*/}
                    {/*  locale={"en-US"}*/}
                    {/*  onChange={input.onChange}*/}
                    {/*  className="form-control input-height"*/}
                    {/*/>*/}
                    <TimePicker
                      showSecond={false}
                      minuteStep={5}
                      className="form-control input-height"
                      value={time}
                      allowEmpty
                      onChange={(e) => {
                        handleValueChange(e)
                      }}
                      use12Hours={is12Hour}
                    />
                    {meta.error && meta.touched && <span className="text-red-500 text-xs mt-1">{meta.error}</span>}
                  </div>
                )}
              </Field>
              <Field
                type="text"
                name="duration_minutes"
                defaultValue={appointmentId && available_actions ? appointment_details.duration_minutes : null}
              >
                {({ input, meta }) => (
                  <div className="form-group mb-3">
                    <label>{T['Page.AppointmentDetails.DurationField.Label']}</label>
                    <input
                      {...input}
                      className="form-control input-height"
                      placeholder={T['Page.AppointmentDetails.DurationField.Label']}
                    />
                    {meta.error && meta.touched && <span className="text-red-500 text-xs mt-1">{meta.error}</span>}
                  </div>
                )}
              </Field>
              <Field
                type="text"
                name="with_member_id"
                defaultValue={appointmentId && available_actions ? appointment_details.with_member.member_id : null}
              >
                {({ input, meta }) => (
                  <div className="form-group mb-3">
                    <label>{T['Page.AppointmentDetails.WithField.Label']}</label>
                    <select
                      {...input}
                      className="form-control input-height"
                    >
                      <option value="">{' '}</option>
                      {members.map((member, idx) => (
                        <option key={idx} value={member.id}>{member.display_name}</option>
                      ))}
                    </select>
                    {meta.error && meta.touched && <span className="text-red-500 text-xs mt-1">{meta.error}</span>}
                  </div>
                )}
              </Field>
              <Field
                type="text"
                name="comment"
                defaultValue={appointmentId && available_actions ? appointment_details.comment : null}
              >
                {({ input, meta }) => (
                  <div className="form-group mb-3">
                    <label>{T['Page.AppointmentDetails.CommentField.Label']}</label>
                    <textarea
                      {...input}
                      rows={5}
                      className="form-control"
                      placeholder={T['Page.AppointmentDetails.CommentField.Label']}
                    />
                    {meta.error && meta.touched && <span className="text-red-500 text-xs mt-1">{meta.error}</span>}
                  </div>
                )}
              </Field>
              <div className="btn-block mt-4">
                <Button
                  classList="btn btn-info btn-block w-full text-lg flex items-center justify-center"
                  buttonSpinnerColor="#fff"
                  disabled={submitting || pristine || available_actions?.edit_appointment_details === 0}
                  loading={submitting}
                  text={appointmentId && available_actions ? T['PageComponent.VesForm.SaveAction.Caption'] : T['Page.ClinicMembers.SubmitAction.Caption']}
                />
              </div>
            </div>
          </form>
        )}
      />
    </Modal>
  )
}

export default React.memo(AppointmentModal)