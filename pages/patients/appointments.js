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
import Button from '@components/button'
import AppointmentModal from '@components/modals/appointment'
import { toast } from 'react-toastify'
import { showErrorMessage } from '@utils/helpers'
import appointmentService from '@services/appointmentService'
import Head from 'next/head'

function PatientAppointments() {
  const router = useRouter()
  //fetching patient ID from query string parameter
  const { id } = router.query

  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [appointmentId, setAppointmentId] = useState()

  const { token } = useAuth()
  const { clinicId, selectedClinic } = useClinic()
  const { translations, lang } = useLang()
  const T = translations

  const {
    data,
    revalidate,
    error
  } = useRequest(token && clinicId && `/prod/clinicapi/GetPatientAppointments?clinic_id=${clinicId}&patient_id=${id}`, { token })

  const { appointments = [], patient_header } = data || {}

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

  const columns = useMemo(() => {
    return [
      {
        Header: T['Page.PatientAppointments.DateHeader.Caption'],
        accessor: 'friendly.date_value'
      },
      {
        Header: T['Page.PatientAppointments.DateHeader.Caption'],
        accessor: 'friendly.time_value'
      },
      {
        Header: T['Page.PatientAppointments.DurationHeader.Caption'],
        accessor: 'duration_minutes',
        Cell({ value }) {
          return value && `${value} ${T['Page.PatientAppointments.Minutes.Caption']}`
        }
      },
      {
        Header: T['Page.PatientAppointments.WithHeader.Caption'],
        accessor: 'with_member.display_name',
      },
      {
        Header: 'Next visit',
        accessor: 'friendly',
        Cell({ row }) {
          const { original: { friendly, appointment_id } } = row
          return (
            <div>
              <div
                className="cursor-pointer text-primary hover:underline"
                onClick={() => {
                  setShowAppointmentModal(true)
                  setAppointmentId(appointment_id)
                }}
              >
                {friendly.scope_name_trans_key && T[friendly.scope_name_trans_key]} {' '}
                {friendly.specifical_value && friendly.specifical_value} {' '}
              </div>
            </div>
          )
        }
      },
      {
        Header: T['Page.ClinicMembers.ActionsHeader.Caption'],
        accessor: (row) => row,
        Cell({ row }) {
          const { original: { appointment_id } } = row
          return (
            <div className="flex items-center">
              <i
                className={`material-icons text-blue-500 cursor-pointer ${lang === 'Heb' ? 'ml-4' : 'mr-4'}`}
                onClick={() => {
                  setShowAppointmentModal(true)
                  setAppointmentId(appointment_id)
                }}
              >
                mode_edit
              </i>
              <i
                className="material-icons text-red-500 cursor-pointer"
                onClick={() => deleteAppointment(appointment_id)}
              >
                delete
              </i>
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
        <title>{T['Page.PatientPages.Appointments.Caption']} | {patient_header.display_name}</title>
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
            data={appointments || []}
            loading={!data}
          >
            <div className="card-head pb-0">
              <div className="flex justify-between lg:flex-row flex-col">
                <h4 className="flex">{T['Page.PatientPages.Appointments.Caption']}</h4>
                <Button
                  classList="btn btn-circle btn-info"
                  onClick={() => {
                    setShowAppointmentModal(true)
                    setAppointmentId(null)
                  }}
                  text={T['Page.PatientAppointments.AddNewItem.Description']}
                  // loading={loading}
                  buttonSpinnerColor="#fff"
                />
              </div>
            </div>
          </AirTable>
        </div>
      </div>
      <AppointmentModal
        modalIsOpen={showAppointmentModal}
        onCloseModal={() => setShowAppointmentModal(false)}
        appointmentsRevalidation={revalidate}
        patientId={id}
        appointmentId={appointmentId}
        token={token}
        clinicId={clinicId}
        formatType={selectedClinic.page_settings.time_format.is_24_hour_format ? "HH:mm" : "hh:mm a"}
      />
    </>
  )
}

export default withAuth(PatientAppointments)