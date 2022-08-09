import React, { useEffect, useState } from 'react'
import withAuth from '@hocs/withAuth'
import SubNavigation from '@components/sub-navigation'
import { useRequest } from '@services/api'
import { useAuth } from '@hooks/useAuth'
import Link from '@components/link'
import { useLang } from '@hooks/useLang'
import { useClinic } from '@hooks/useClinic'
import ContainerLoader from '@components/loader/container'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'

function HomePage() {
  const [patientsThisMonth, setPatientsThisMonth] = useState()
  const [visitsThisMonth, setVisitsThisMonth] = useState()
  const [patientsLastsMonth, setPatientsLastMonth] = useState()
  const [visitsLastsMonth, setVisitsLastMonth] = useState()

  const { clinicId } = useClinic()
  const { token } = useAuth()
  const { translations, lang } = useLang()
  const T = translations
  const router = useRouter()

  const { data, error } = useRequest(clinicId && `/prod/clinicapi/GetClinicOverview?clinic_id=${clinicId}`, { token })
  const { clinic_header, clinic_overview } = data || {}

  useEffect(() => {
    if (clinic_overview) {
      clinic_overview.monthly.map(e => {
        if (e.month_offset === 0) {
          setPatientsThisMonth(e.total_patients_created)
          setVisitsThisMonth(e.total_appointments_scheduled)
        }
        if (e.month_offset === -1) {
          setPatientsLastMonth(e.total_patients_created)
          setVisitsLastMonth(e.total_appointments_scheduled)
        }
      })
    }
  }, [clinic_overview])

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
        <title>{T['Page.Master.OverviewLink.Caption']} | {clinic_header.display_name}</title>
      </Head>
      <SubNavigation
        image={clinic_header.small_image_url}
        header={clinic_header.display_name}
      >
        <Link
          href="/"
          activeClassName="font-bold txt-info border-light-blue"
        >
          <a className="border-b-2 border-transparent">
            {T['Page.Master.OverviewLink.Caption']}
          </a>
        </Link>
        <Link
          href="/clinic-members"
          activeClassName="font-bold txt-info border-light-blue"
        >
          <a
            className="mx-5 border-b-2 border-transparent"
          >
            {T['Page.ClinicPages.ClinicMembersLink.Caption']}
          </a>
        </Link>
      </SubNavigation>
      <div className="row md:mt-10 mt-6">
        <div className="col-lg-6 col-md-12">
          <div className="card card-box">
            <div className="card-head flex">
              <header className={lang === 'Heb' && 'pr-0'}>
                {T['Page.ClinicOverview.PatientsCreated.Caption']}
              </header>
            </div>
            <div className="card-body no-padding height-9 my-3">
              <div className="flex mb-3 justify-between">
                <h4>
                  {T['Page.ClinicOverview.ThisMonthField.Label']}
                </h4>
                <button
                  className="btn btn-round btn-default w-16"
                >
                  {patientsThisMonth}
                </button>
              </div>
              <div className="flex mb-3 justify-between">
                <h4>
                  {T['Page.ClinicOverview.PreviousMonthField.Label']}
                </h4>
                <button
                  className="btn btn-round btn-default w-16"
                >
                  {patientsLastsMonth}
                </button>
              </div>
              <div className="flex mb-3 justify-between">
                <h4>
                  {T['Page.ClinicOverview.TotalPatientsField.Label']}
                </h4>
                <button
                  className="btn btn-round btn-default w-16"
                >
                  {clinic_overview.totals.total_patients_created}
                </button>
              </div>
              <div className="flex justify-between">
                <h4>
                  {T['Page.ClinicOverview.SlotsLeftField.Label']}
                </h4>
                <button
                  className="btn btn-round btn-default w-16"
                >
                  {clinic_overview.totals.total_patients_slots}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-12">
          <div className="card card-box">
            <div className="card-head flex">
              <header className={lang === 'Heb' && 'pr-0'}>
                {T['Page.ClinicOverview.VisitsAndAppointments.Caption']}
              </header>
            </div>
            <div className="card-body no-padding height-9 my-3">
              <div className="flex mb-3 justify-between">
                <h4>
                  {T['Page.ClinicOverview.ThisMonthField.Label']}
                </h4>
                <button
                  className="btn btn-round btn-default w-16"
                >
                  {visitsThisMonth}
                </button>
              </div>
              <div className="flex mb-3 justify-between">
                <h4>
                  {T['Page.ClinicOverview.PreviousMonthField.Label']}
                </h4>
                <button
                  className="btn btn-round btn-default w-16"
                >
                  {visitsLastsMonth}
                </button>
              </div>
              <div className="flex mb-3 justify-between">
                <h4>
                  {T['Page.ClinicOverview.TotalVisitsField.Label']}
                </h4>
                <button
                  className="btn btn-round btn-default w-16"
                >
                  {clinic_overview.totals.total_visited}
                </button>
              </div>
              <div className="flex justify-between">
                <h4>
                  {T['Page.ClinicOverview.TotalScheduledField.Label']}
                </h4>
                <button
                  className="btn btn-round btn-default w-16"
                >
                  {clinic_overview.totals.total_appointments_scheduled}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default withAuth(HomePage)
