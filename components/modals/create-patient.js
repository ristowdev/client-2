import React, { useState } from 'react'
import { Field, Form } from 'react-final-form'
import Modal from '@components/modals/index'
import { patientService } from '@services/index'
import { toast } from 'react-toastify'
import { useLang } from '@hooks/useLang'
import Button from '@components/button'
import { getMaxDate, showErrorMessage, uploadImage } from '@utils/helpers'
import { useRouter } from 'next/router'

function CreatePatientModal({ token, clinicId, modalIsOpen, onCloseModal, revalidate }) {
  const router = useRouter()
  const [uploadFile, setUploadFile] = useState(false)

  const { translations } = useLang()
  const T = translations

  const onSubmit = async (values, form) => {
    if(values.gender_key === '') {
      values.gender_key = null
    }
    values.token = token
    values.clinic_id = clinicId

    delete values.file_uid

    if (uploadFile) {
      const { file_uid } = await Promise.resolve(uploadImage(uploadFile, token, 'UploadProfileImage'))
      values.profile_image_file_uid = file_uid
    }

    try {
      const patient = await patientService.createPatient(values)
      await revalidate()
      onCloseModal()
      router.push(`/patients/visits?id=${patient.patient_details.id}`)
    } catch (e) {
      return toast.error(T[showErrorMessage(e.message)])
    }
  }

  return (
    <Modal
      modalIsOpen={modalIsOpen}
      onCloseModal={onCloseModal}
      header={T['Page.Patients.NewPatientItem.Caption']}
    >
      <Form
        onSubmit={onSubmit}
        validate={(values) => {
        }}
        render={({ handleSubmit, submitting, pristine }) => (
          <form onSubmit={handleSubmit} className="form-body">
            <div className="login-form">
              <Field
                type="file"
                name="file_uid"
              >
                {({ input, meta }) => (
                  <div className="form-group mb-3">
                    <label>{T['Page.PatientDetails.ProfileImageField.Label']}</label>
                    <input
                      {...input}
                      type="file"
                      className="form-control input-height"
                      placeholder={T['Page.PatientDetails.ProfileImageField.Label']}
                      onChange={(e) => {
                        input.onChange(e)
                        setUploadFile(e.target.files[0])
                      }}
                    />
                    {meta.error && meta.touched && <span className="text-red-500 text-xs mt-1">{meta.error}</span>}
                  </div>
                )}
              </Field>
              <Field
                type="text"
                name="first_name"
              >
                {({ input, meta }) => (
                  <div className="form-group mb-3">
                    <label>{T['Page.PatientDetails.FirstNameField.Label']}</label>
                    <input
                      {...input}
                      className="form-control input-height"
                      placeholder={T['Page.PatientDetails.FirstNameField.Label']}
                    />
                    {meta.error && meta.touched && <span className="text-red-500 text-xs mt-1">{meta.error}</span>}
                  </div>
                )}
              </Field>
              <Field
                type="text"
                name="middle_name"
              >
                {({ input, meta }) => (
                  <div className="form-group mb-3">
                    <label>{T['Page.PatientDetails.MiddleNameField.Label']}</label>
                    <input
                      {...input}
                      className="form-control input-height"
                      placeholder={T['Page.PatientDetails.MiddleNameField.Label']}
                    />
                    {meta.error && meta.touched && <span className="text-red-500 text-xs mt-1">{meta.error}</span>}
                  </div>
                )}
              </Field>
              <Field
                type="text"
                name="last_name"
              >
                {({ input, meta }) => (
                  <div className="form-group mb-3">
                    <label>{T['Page.PatientDetails.LastNameField.Label']}</label>
                    <input
                      {...input}
                      className="form-control input-height"
                      placeholder={T['Page.PatientDetails.LastNameField.Label']}
                    />
                    {meta.error && meta.touched && <span className="text-red-500 text-xs mt-1">{meta.error}</span>}
                  </div>
                )}
              </Field>
              <Field
                type="text"
                name="gender_key"
                defaultValue=""
              >
                {({ input, meta }) => (
                  <div className="form-group mb-3">
                    <label>{T['Page.PatientDetails.GenderField.Label']}</label>
                    <select
                      {...input}
                      className="form-control input-height"

                    >
                      <option value="">{' '}</option>
                      <option value="Male">
                        {T['Db.Gender.Male']}
                      </option>
                      <option value="Female">
                        {T['Db.Gender.Female']}
                      </option>
                    </select>
                    {meta.error && meta.touched && <span className="text-red-500 text-xs mt-1">{meta.error}</span>}
                  </div>
                )}
              </Field>
              <Field
                type="date"
                name="date_of_birth"
              >
                {({ input, meta }) => (
                  <div className="form-group mb-3">
                    <label>{T['Page.PatientDetails.DateOfBirthField.Label']}</label>
                    <input
                      {...input}
                      max={getMaxDate()}
                      className="form-control input-height"
                      placeholder={T['Page.PatientDetails.DateOfBirthField.Label']}
                    />
                    {meta.error && meta.touched && <span className="text-red-500 text-xs mt-1">{meta.error}</span>}
                  </div>
                )}
              </Field>
              <Field
                type="text"
                name="patient_number"
              >
                {({ input, meta }) => (
                  <div className="form-group mb-3">
                    <label>{T['Page.PatientDetails.PatientNumberField.Label']}</label>
                    <input
                      {...input}
                      className="form-control input-height"
                      placeholder={T['Page.PatientDetails.PatientNumberField.Label']}
                    />
                    {meta.error && meta.touched && <span className="text-red-500 text-xs mt-1">{meta.error}</span>}
                  </div>
                )}
              </Field>
              <div className="btn-block mt-4">
                <Button
                  classList="btn btn-info btn-block w-full text-lg flex items-center justify-center"
                  buttonSpinnerColor="#fff"
                  disabled={submitting || pristine}
                  loading={submitting}
                  text={T['PageComponent.VesForm.CreateAction.Caption']}
                />
              </div>
            </div>
          </form>
        )}
      />
    </Modal>
  )
}

export default React.memo(CreatePatientModal)