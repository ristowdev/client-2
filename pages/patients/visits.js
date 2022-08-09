import React, { useMemo, useState } from 'react'
import withAuth from '@hocs/withAuth'
import Link from '@components/link'
import { useAuth } from '@hooks/useAuth'
import SubNavigation from '@components/sub-navigation'
import { useRequest } from '@services/api'
import { useLang } from '@hooks/useLang'
import ContainerLoader from '@components/loader/container'
import { useClinic } from '@hooks/useClinic'
import { useRouter } from 'next/router'
import AirTable from '@components/table'
import { toast } from 'react-toastify'
import { showErrorMessage } from '@utils/helpers'
import { visitService } from '@services/index'
import Button from '@components/button'
import Head from 'next/head'

function PatientAppointments() {
  const router = useRouter()

  //fetching patient ID from query string parameter
  const { id } = router.query

  const [loading, setLoading] = useState(false)

  const { token } = useAuth()
  const { clinicId } = useClinic()
  const { translations, lang } = useLang()
  const T = translations

  const {
    data,
    revalidate,
    error
  } = useRequest(token && clinicId && `/prod/visitapi/GetPatientVisits?clinic_id=${clinicId}&patient_id=${id}`, { token })

  const { visits, patient_header } = data || {}

  const createVisit = async () => {
    setLoading(true)
    const values = {
      token,
      clinic_id: clinicId,
      patient_id: id,
    }

    try {
      const { visit_id } = await visitService.createVisit(values)
      router.push(`/visit-details?id=${visit_id}`)
    } catch (e) {
      return toast.error(T[showErrorMessage(e.message)])
    } finally {
      setLoading(false)
    }
  }

  const columns = useMemo(() => {
    return [
      {
        Header: 'Title',
        accessor: 'visit_title',
      },
      {
        Header: 'Type',
        accessor: 'visit_type.trans_key',
        Cell({ value }) {
          return T[value]
        }
      },
      {
        Header: 'Date',
        accessor: 'friendly.date_value',
      },
      {
        Header: 'Time',
        accessor: 'friendly.time_value',
      },
      {
        Header: 'Visit Date',
        accessor: 'friendly',
        Cell({ value }) {
          return `${T[value.before_value_trans_key]} ${value.specifical_value} ${T[value.after_value_trans_key]}`
        }
      },
      {
        Header: 'With Member',
        accessor: 'with_member.display_name'
      },
      {
        Header: T['Page.ClinicMembers.ActionsHeader.Caption'],
        accessor: (row) => row,
        Cell({ row }) {
          const { original: { visit_id } } = row
          return (
            <div className="flex items-center">
              <Link href={`/visit-details?id=${visit_id}`}>
                <i
                  className={`material-icons text-blue-500 cursor-pointer ${lang === 'Heb' ? 'ml-4' : 'mr-4'}`}
                >
                  mode_edit
                </i>
              </Link>
            </div>
          )
        }
      }
    ]
  }, [data])

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
        <title>{T['Page.PatientPages.VisitsLink.Caption']} | {patient_header.display_name}</title>
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
          <AirTable
            columns={columns}
            data={visits || []}
            loading={!data}
          >
            <div className="card-head pb-0">
              <div className="flex justify-between">
                <h4>{T['Page.PatientVisits.Title.Caption']}</h4>
                <Button
                  classList="btn btn-circle btn-info"
                  onClick={createVisit}
                  text={T['Page.PatientVisits.CreateAction.Caption']}
                  loading={loading}
                  buttonSpinnerColor="#fff"
                />
              </div>
            </div>
          </AirTable>
        </div>
      </div>
    </>
  )
}

export default withAuth(PatientAppointments)