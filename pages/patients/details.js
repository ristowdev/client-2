import React, { useState } from 'react'
import withAuth from '@hocs/withAuth'
import Link from '@components/link'
import { useAuth } from '@hooks/useAuth'
import SubNavigation from '@components/sub-navigation'
import { useRequest } from '@services/api'
import { useLang } from '@hooks/useLang'
import ContainerLoader from '@components/loader/container'
import { Field, Form } from 'react-final-form'
import Button from '@components/button'
import { showErrorMessage, uploadImage } from '@utils/helpers'
import { toast } from 'react-toastify'
import { patientService } from '@services/index'
import { useClinic } from '@hooks/useClinic'
import { useRouter } from 'next/router'
import Head from 'next/head'

function PatientDetails() {
  const router = useRouter()

  //fetching patient ID from query string parameter
  const { id } = router.query

  const [showDetailsForm, setShowDetailsForm] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [uploadFile, setUploadFile] = useState(false)

  const { token } = useAuth()
  const { clinicId } = useClinic()
  const { translations } = useLang()
  const T = translations

  const {
    data,
    revalidate,
    error
  } = useRequest(token && clinicId && `/prod/clinicapi/GetPatientDetails?clinic_id=${clinicId}&patient_id=${id}`, { token })
  const { patient_header, patient_details, contact_details } = data || {}

  const onSubmitPatientDetails = async (values, form) => {
    values.token = token

    try {
      let imageUrl = patient_details.profile_image_file_uid
      values.clinic_id = clinicId
      values.patient_id = id

      delete values.file_uid

      if (uploadFile) {
        const { file_uid } = await Promise.resolve(uploadImage(uploadFile, token, 'UploadProfileImage'))
        imageUrl = file_uid
      }

      values.profile_image_file_uid = imageUrl

      await patientService.editPatientDetails(values)
      await revalidate()
      setShowDetailsForm(false)
    } catch (e) {
      return toast.error(T[showErrorMessage(e.message)])
    }
  }

  const onSubmitPatientContact = async (values) => {
    if(values.gender_key === '') {
      values.gender_key = null
    }
    values.token = token

    try {
      values.clinic_id = clinicId
      values.patient_id = id

      await patientService.editPatientContact(values)
      await revalidate()
      setShowContactForm(false)
    } catch (e) {
      return toast.error(T[showErrorMessage(e.message)])
    }
  }

  if (error) {
    router.push('/patients')
    return toast.error('Unknown error')
  }

  if (!data) {
    return <ContainerLoader/>
  }

  return (
    <>
      <Head>
        <title>{T['Page.PatientDetails.Title.Caption']} | {patient_header.display_name}</title>
      </Head>
      <SubNavigation
        image={patient_header.small_image_url}
        header={patient_header.display_name}
        deletePatient={true}
        translation={T}
        clinicId={clinicId}
        token={token}
        patientId={id}
      >
        <Link
          href={`/patients/details?id=${id}`}
          activeClassName="font-bold txt-info border-light-blue"
        >
          <a className="border-b-2 border-transparent">
            {T['Page.PatientDetails.Title.Caption']}
          </a>
        </Link>
        <Link
          href={`/patients/visits?id=${id}`}
          activeClassName="font-bold txt-info border-light-blue"
        >
          <a
            className="mx-5 border-b-2 border-transparent"
          >
            {T['Page.PatientPages.VisitsLink.Caption']}
          </a>
        </Link>
        <Link
          href={`/patients/appointments?id=${id}`}
          activeClassName="font-bold txt-info border-light-blue"
        >
          <a
            className="mr-5 border-b-2 border-transparent"
          >
            {T['Page.PatientPages.Appointments.Caption']}
          </a>
        </Link>
      </SubNavigation>
      <div className="row md:mt-10 mt-6">
        <div className="col-md-12">
          <div className="card card-box">
            <div className="card-head">
              <div className="flex items-center justify-between">
                <header>
                  {T['Page.PatientPages.PatientDetailsLink.Caption']}
                </header>
                <button
                  className="btn btn-circle btn-info"
                  onClick={() => setShowDetailsForm(prevState => !prevState)}
                >
                  {showDetailsForm ? T['PageComponent.VesForm.DiscardAction.Caption'] : T['PageComponent.VesForm.EditAction.Caption']}
                </button>
              </div>
            </div>
            <Form
              onSubmit={onSubmitPatientDetails}
              validate={(values) => {
              }}
              render={({ handleSubmit, form, submitting, pristine, values, submitErrors, errors }) => (
                <form onSubmit={handleSubmit} className="card-body">
                  <div className="login-form">
                    <div className="row items-center md:mb-10 mb-6">
                      <div className="col-md-2">
                        <label>{T['Page.PatientDetails.ProfileImageField.Label']}</label>
                      </div>
                      {!showDetailsForm ?
                        <div className="col-md-10">
                          <img src={patient_details.profile_mini_image_url}/>
                        </div> :
                        <div className="col-md-10">
                          <Field
                            type="file"
                            name="file_uid"
                          >
                            {({ input, meta }) => (
                              <input
                                {...input}
                                disabled={!showDetailsForm}
                                type="file"
                                className="form-control input-height"
                                onChange={(e) => {
                                  input.onChange(e)
                                  setUploadFile(e.target.files[0])
                                }}
                              />
                            )}
                          </Field>
                        </div>
                      }
                    </div>
                    <div className="row items-center md:mb-10 mb-6">
                      <div className="col-md-2">
                        <label>{T['Page.PatientDetails.FirstNameField.Label']}</label>
                      </div>
                      <div className="col-md-10">
                        <Field
                          type="text"
                          name="first_name"
                          defaultValue={patient_details.first_name}
                        >
                          {({ input, meta }) => (
                            <input
                              {...input}
                              disabled={!showDetailsForm}
                              className="form-control input-height"
                            />
                          )}
                        </Field>
                      </div>
                    </div>
                    <div className="row items-center md:mb-10 mb-6">
                      <div className="col-md-2">
                        <label>{T['Page.PatientDetails.MiddleNameField.Label']}</label>
                      </div>
                      <div className="col-md-10">
                        <Field
                          type="text"
                          name="middle_name"
                          defaultValue={patient_details.middle_name}
                        >
                          {({ input, meta }) => (
                            <input
                              {...input}
                              disabled={!showDetailsForm}
                              className="form-control input-height"
                            />
                          )}
                        </Field>
                      </div>
                    </div>
                    <div className="row items-center md:mb-10 mb-6">
                      <div className="col-md-2">
                        <label>{T['Page.PatientDetails.LastNameField.Label']}</label>
                      </div>
                      <div className="col-md-10">
                        <Field
                          type="text"
                          name="last_name"
                          defaultValue={patient_details.last_name}
                        >
                          {({ input, meta }) => (
                            <input
                              {...input}
                              disabled={!showDetailsForm}
                              className="form-control input-height"
                            />
                          )}
                        </Field>
                      </div>
                    </div>
                    <div className="row items-center md:mb-10 mb-6">
                      <div className="col-md-2">
                        <label>{T['Page.PatientDetails.GenderField.Label']}</label>
                      </div>
                      <div className="col-md-10">
                        <Field
                          type="text"
                          name="gender_key"
                          defaultValue={patient_details.gender_key}
                        >
                          {({ input, meta }) => (
                            <select
                              {...input}
                              disabled={!showDetailsForm}
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
                          )}
                        </Field>
                      </div>
                    </div>
                    <div className="row items-center md:mb-10 mb-6">
                      <div className="col-md-2">
                        <label>{T['Page.PatientDetails.DateOfBirthField.Label']}</label>
                      </div>
                      <div className="col-md-10">
                        <Field
                          type="date"
                          name="date_of_birth"
                          defaultValue={patient_details.date_of_birth}
                        >
                          {({ input, meta }) => (
                            <input
                              {...input}
                              disabled={!showDetailsForm}
                              className="form-control input-height"
                            />
                          )}
                        </Field>
                      </div>
                    </div>
                    <div className="row items-center md:mb-10 mb-6">
                      <div className="col-md-2">
                        <label>{T['Page.PatientDetails.PatientNumberField.Label']}</label>
                      </div>
                      <div className="col-md-10">
                        <Field
                          type="text"
                          name="patient_number"
                          defaultValue={patient_details.patient_number}
                        >
                          {({ input, meta }) => (
                            <input
                              {...input}
                              disabled={!showDetailsForm}
                              className="form-control input-height"
                            />
                          )}
                        </Field>
                      </div>
                    </div>
                    {showDetailsForm &&
                    <div className="btn-block mt-4">
                      <Button
                        classList="btn btn-info btn-block w-full text-lg flex items-center justify-center"
                        buttonSpinnerColor="#fff"
                        disabled={submitting || pristine}
                        loading={submitting}
                        text={T['PageComponent.VesForm.SaveAction.Caption']}
                      />
                    </div>
                    }
                  </div>
                </form>
              )}
            />
          </div>
        </div>
      </div>
      <div className="row md:mt-10 mt-6">
        <div className="col-md-12">
          <div className="card card-box">
            <div className="card-head">
              <div className="flex items-center justify-between">
                <header>
                  {T['Page.ContactInformation.Title.Caption']}
                </header>
                <button
                  className="btn btn-circle btn-info"
                  onClick={() => setShowContactForm(prevState => !prevState)}
                >
                  {showContactForm ? T['PageComponent.VesForm.DiscardAction.Caption'] : T['PageComponent.VesForm.EditAction.Caption']}
                </button>
              </div>
            </div>
            <Form
              onSubmit={onSubmitPatientContact}
              validate={(values) => {}}
              render={({ handleSubmit, submitting, pristine}) => (
                <form onSubmit={handleSubmit} className="card-body">
                  <div className="login-form">
                    <div className="row items-center md:mb-10 mb-6">
                      <div className="col-md-2">
                        <label>{T['Page.ContactInformation.EmailField.Label']}</label>
                      </div>
                      <div className="col-md-10">
                        <Field
                          type="text"
                          name="email_address"
                          defaultValue={contact_details.email_address}
                        >
                          {({ input, meta }) => (
                            <input
                              {...input}
                              disabled={!showContactForm}
                              className="form-control input-height"
                            />
                          )}
                        </Field>
                      </div>
                    </div>
                    <div className="row items-center md:mb-10 mb-6">
                      <div className="col-md-2">
                        <label>{T['Page.ContactInformation.HomeAddress.Label']}</label>
                      </div>
                      <div className="col-md-10">
                        <Field
                          type="text"
                          name="home_address"
                          defaultValue={contact_details.home_address}
                        >
                          {({ input, meta }) => (
                            <input
                              {...input}
                              disabled={!showContactForm}
                              className="form-control input-height"
                            />
                          )}
                        </Field>
                      </div>
                    </div>
                    <div className="row items-center md:mb-10 mb-6">
                      <div className="col-md-2">
                        <label>{T['Page.ContactInformation.PrimaryPhoneField.Label']}</label>
                      </div>
                      <div className="col-md-10">
                        <Field
                          type="text"
                          name="primary_phone_number"
                          defaultValue={contact_details.primary_phone_number}
                        >
                          {({ input, meta }) => (
                            <input
                              {...input}
                              disabled={!showContactForm}
                              className="form-control input-height"
                            />
                          )}
                        </Field>
                      </div>
                    </div>
                    <div className="row items-center md:mb-10 mb-6">
                      <div className="col-md-2">
                        <label>{T['Page.ContactInformation.SecondaryPhoneField.Label']}</label>
                      </div>
                      <div className="col-md-10">
                        <Field
                          type="text"
                          name="secondary_phone_number"
                          defaultValue={contact_details.secondary_phone_number}
                        >
                          {({ input, meta }) => (
                            <input
                              {...input}
                              disabled={!showContactForm}
                              className="form-control input-height"
                            />
                          )}
                        </Field>
                      </div>
                    </div>
                    <div className="row items-center md:mb-10 mb-6">
                      <div className="col-md-2">
                        <label>{T['Page.ContactInformation.Comments']}</label>
                      </div>
                      <div className="col-md-10">
                        <Field
                          type="text"
                          name="contact_comment"
                          defaultValue={contact_details.contact_comment}
                        >
                          {({ input, meta }) => (
                            <textarea
                              {...input}
                              disabled={!showContactForm}
                              rows={5}
                              className="form-control"
                            />
                          )}
                        </Field>
                      </div>
                    </div>
                    {showContactForm &&
                    <div className="btn-block mt-4">
                      <Button
                        classList="btn btn-info btn-block w-full text-lg flex items-center justify-center"
                        buttonSpinnerColor="#fff"
                        disabled={submitting || pristine}
                        loading={submitting}
                        text={T['PageComponent.VesForm.SaveAction.Caption']}
                      />
                    </div>
                    }
                  </div>
                </form>
              )}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default withAuth(PatientDetails)