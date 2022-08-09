import React, { useState } from 'react'
import { authService, clinicService } from '@services/index'
import withAuth from '@hocs/withAuth'
import { useAuth } from '@hooks/useAuth'
import { useLang } from '@hooks/useLang'
import { useRequest } from '@services/api'
import { toast } from 'react-toastify'
import { showErrorMessage } from '@utils/helpers'
import ContainerLoader from '@components/loader/container'
import Link from '@components/link'
import SubNavigation from '@components/sub-navigation'
import { useClinic } from '@hooks/useClinic'
import { Field, Form } from 'react-final-form'
import { required } from '@utils/form-validators'
import Button from '@components/button'
import Head from 'next/head'
import { useRouter } from 'next/router'

function ClinicSettings({ timeFormats, timeZones }) {
  const [showForm, setShowForm] = useState(false)

  const { token } = useAuth()
  const { clinicId, revalidateClinics } = useClinic()
  const { translations } = useLang()
  const T = translations
  const router = useRouter()

  const {
    data,
    revalidate,
    error
  } = useRequest(token && clinicId && `/prod/clinicapi/GetClinicSettings?clinic_id=${clinicId}`, { token })
  const { clinic_header, clinic_settings } = data || {}

  const onSubmit = async (values) => {
    values.clinic_id = clinicId
    values.token = token

    try {
      await authService.editClinicSettings(values)
      await revalidate()
      await revalidateClinics()
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
        <title>{T['Page.AdminPages.ClinicSettingsLink.Caption']} | {clinic_header.display_name}</title>
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
                  {T['Page.ClinicSettings.Title.Caption']}
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
                        <label>{T['Page.ClinicSettings.TimeZoneField.Label']}</label>
                      </div>
                      <div className="col-md-10">
                        <Field
                          type="text"
                          name="time_zone_key"
                          defaultValue={clinic_settings.time_zone_key}
                          validate={required}
                        >
                          {({ input, meta }) => (
                            <select
                              {...input}
                              disabled={!showForm}
                              className="form-control input-height"
                            >
                              {timeZones.map((t, idx) => (
                                <option key={idx} value={t.key}>{t.display_name}</option>
                              ))}
                            </select>
                          )}
                        </Field>
                      </div>
                    </div>
                    <div className="row items-center md:mb-10 mb-6">
                      <div className="col-md-2">
                        <label>{T['Page.ClinicSettings.TimeFormatField.Label']}</label>
                      </div>
                      <div className="col-md-10">
                        <Field
                          type="text"
                          name="time_format_key"
                          defaultValue={clinic_settings.time_format_key}
                        >
                          {({ input, meta }) => (
                            <select
                              {...input}
                              disabled={!showForm}
                              className="form-control input-height"
                            >
                              {timeFormats.map((t, idx) => (
                                <option key={idx} value={t.key}>{T[t.trans_key]}</option>
                              ))}
                            </select>
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

export async function getStaticProps() {
  const timeFormats = await clinicService.getTimeFormats()
  const timeZones = await clinicService.getTimeZones()
  return { props: { timeFormats, timeZones } }
}

export default withAuth(ClinicSettings)