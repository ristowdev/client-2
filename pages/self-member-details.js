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
import Head from 'next/head'
import { useRouter } from 'next/router'

function SelfMemberDetails() {
  const [showForm, setShowForm] = useState(false)
  const [uploadFile, setUploadFile] = useState(false)

  const { token } = useAuth()
  const { translations } = useLang()
  const T = translations
  const router = useRouter()

  const { data, revalidate, error } = useRequest(token && `/prod/clinicapi/GetSelfMemberDetails`, { token })
  const { member_header, member_details } = data || {}

  const onSubmit = async (values, form) => {
    let imageUrl = member_details.profile_image_file_uid
    delete values.file_uid
    if (uploadFile) {
      const { file_uid } = await Promise.resolve(uploadImage(uploadFile, token, 'UploadProfileImage'))
      imageUrl = file_uid
    }

    values.profile_image_file_uid = imageUrl
    values.token = token

    try {
      await authService.editSelfMemberDetails(values)
      await revalidate()
      setShowForm(false)
    } catch (e) {
      return toast.error(T[showErrorMessage(e.message)])
    }
  }

  if (error) {
    router.push('/')
    return toast.error('Unknown error')
  }

  if (!data) {
    return <ContainerLoader/>
  }

  return (
    <>
      <Head>
        <title>{T['Page.MemberDetails.Title.Caption']} | {member_header.display_name}</title>
      </Head>
      <SubNavigation
        image={member_header.small_image_url}
        header={member_header.display_name}
      >
        <Link
          href="/self-member-details"
          activeClassName="font-bold txt-info border-light-blue"
        >
          <a className="border-b-2 border-transparent">
            {T['Page.MemberDetails.Title.Caption']}
          </a>
        </Link>
        <Link
          href="/self-login-details"
          activeClassName="font-bold txt-info border-light-blue"
        >
          <a
            className="mx-5 border-b-2 border-transparent"
          >
            {T['Page.SelfMemberPages.SelfLoginDetailsLink.Caption']}
          </a>
        </Link>
      </SubNavigation>
      <div className="row md:mt-10 mt-6">
        <div className="col-md-12">
          <div className="card card-box">
            <div className="card-head">
              <div className="flex items-center justify-between">
                <header>
                  {T['Page.MemberDetails.Title.Caption']}
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
                        <label>{T['Page.MemberDetails.ProfileImageField.Label']}</label>
                      </div>
                      {!showForm ?
                        <div className="col-md-10">
                          <img src={member_details.profile_mini_image_url}/>
                        </div>
                        :
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
                        <label>{T['Page.MemberDetails.FirstNameField.Label']}</label>
                      </div>
                      <div className="col-md-10">
                        <Field
                          type="text"
                          name="first_name"
                          defaultValue={member_details.first_name}
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
                        <label>{T['Page.MemberDetails.LastNameField.Label']}</label>
                      </div>
                      <div className="col-md-10">
                        <Field
                          type="text"
                          name="last_name"
                          defaultValue={member_details.last_name}
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
                        <label>{T['Page.MemberDetails.PhoneNumber.Label']}</label>
                      </div>
                      <div className="col-md-10">
                        <Field
                          type="text"
                          name="phone_number"
                          defaultValue={member_details.phone_number}
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

export default withAuth(SelfMemberDetails)