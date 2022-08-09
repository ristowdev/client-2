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
import { authService } from '@services/index'
import { required } from '@utils/form-validators'
import { useClinic } from '@hooks/useClinic'
import Head from 'next/head'
import { useRouter } from 'next/router'

function ClinicDetails() {
  const [showForm, setShowForm] = useState(false)
  const [uploadFile, setUploadFile] = useState(false)

  const { token } = useAuth()
  const { clinicId, revalidateClinics } = useClinic()
  const { translations } = useLang()
  const T = translations
  const router = useRouter()

  const {
    data,
    revalidate,
    error
  } = useRequest(token && clinicId && `/prod/clinicapi/GetClinicDetails?clinic_id=${clinicId}`, { token })
  const { clinic_header, clinic_details } = data || {}

  const onSubmit = async (values, form) => {
    let imageUrl = clinic_details.logo_image_file_uid
    values.clinic_id = clinicId
    delete values.file_uid

    if (uploadFile) {
      const { file_uid } = await Promise.resolve(uploadImage(uploadFile, token, 'UploadProfileImage'))
      imageUrl = file_uid
    }

    values.logo_image_file_uid = imageUrl
    values.token = token

    try {
      await authService.editClinicDetails(values)
      await revalidateClinics()
      await revalidate()
      setShowForm(false)
    } catch (e) {
      return toast.error(T[showErrorMessage(e.message)])
    }
  }

  if(error) {
    router.push('/')
    return toast.error('Unknown error')
  }

  if (!data) {
    return <ContainerLoader/>
  }

  return (
    <>
      <Head>
        <title>{T['Page.AdminPages.ClinicDetailsLink.Caption']} | {clinic_header.display_name}</title>
      </Head>
      <SubNavigation
        image={clinic_header.small_image_url}
        header={clinic_header.display_name}
      >
        <Link
          href="/clinic-details"
          activeClassName="font-bold txt-info border-light-blue"
        >
          <a className="border-b-2 border-transparent">
            {T['Page.AdminPages.ClinicDetailsLink.Caption']}
          </a>
        </Link>
        <Link
          href="/clinic-settings"
          activeClassName="font-bold txt-info border-light-blue"
        >
          <a
            className="mx-5 border-b-2 border-transparent"
          >
            {T['Page.AdminPages.ClinicSettingsLink.Caption']}
          </a>
        </Link>
        <Link
          href="/clinic-plan"
          activeClassName="font-bold txt-info border-light-blue"
        >
          <a
            className="mr-5 border-b-2 border-transparent"
          >
            {T['Page.AdminPages.ClinicPlanLink.Caption']}
          </a>
        </Link>
      </SubNavigation>
      <div className="row md:mt-10 mt-6">
        <div className="col-md-12">
          <div className="card card-box">
            <div className="card-head">
              <div className="flex items-center justify-between">
                <header>
                  {T['Page.AdminPages.ClinicDetailsLink.Caption']}
                </header>
                <button
                  className="btn btn-circle btn-info"
                  onClick={() => setShowForm(prevState => !prevState)}
                >
                  {showForm ? T['PageComponent.VesForm.DiscardAction.Caption'] : T['PageComponent.VesForm.EditAction.Caption']}
                </button>
              </div>
            </div>
            <Form
              onSubmit={onSubmit}
              validate={(values) => {
              }}
              render={({ handleSubmit, form, submitting, pristine, values, submitErrors, errors }) => (
                <form onSubmit={handleSubmit} className="card-body">
                  <div className="login-form">
                    <div className="row items-center md:mb-10 mb-6">
                      <div className="col-md-2">
                        <label>{T['Page.ClinicDetails.LogoField.Label']}</label>
                      </div>
                      {!showForm ?
                        <div className="col-md-10">
                          <img src={clinic_details.logo_mini_image_url}/>
                        </div> :
                        <div className="col-md-10">
                          <Field
                            type="file"
                            name="file_uid"
                          >
                            {({ input, meta }) => (
                              <input
                                {...input}
                                disabled={!showForm}
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
                        <label>{T['Page.ClinicDetails.NameField.Label']}</label>
                      </div>
                      <div className="col-md-10">
                        <Field
                          type="text"
                          name="clinic_name"
                          defaultValue={clinic_details.name}
                          validate={required}
                        >
                          {({ input, meta }) => (
                            <input
                              {...input}
                              disabled={!showForm}
                              className="form-control input-height"
                            />
                          )}
                        </Field>
                      </div>
                    </div>
                    <div className="row items-center md:mb-10 mb-6">
                      <div className="col-md-2">
                        <label>{T['Page.ClinicDetails.WebsiteField.Label']}</label>
                      </div>
                      <div className="col-md-10">
                        <Field
                          type="text"
                          name="website"
                          defaultValue={clinic_details.website}
                        >
                          {({ input, meta }) => (
                            <input
                              {...input}
                              disabled={!showForm}
                              className="form-control input-height"
                            />
                          )}
                        </Field>
                      </div>
                    </div>
                    <div className="row items-center md:mb-10 mb-6">
                      <div className="col-md-2">
                        <label>{T['Page.ClinicDetails.EmailField.Label']}</label>
                      </div>
                      <div className="col-md-10">
                        <Field
                          type="email"
                          name="email"
                          defaultValue={clinic_details.email}
                        >
                          {({ input, meta }) => (
                            <input
                              {...input}
                              disabled={!showForm}
                              className="form-control input-height"
                            />
                          )}
                        </Field>
                      </div>
                    </div>
                    {showForm &&
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

export default withAuth(ClinicDetails)