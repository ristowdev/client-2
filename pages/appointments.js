import React, { useMemo, useState } from 'react'
import withAuth from '@hocs/withAuth'
import { useAuth } from '@hooks/useAuth'
import { useClinic } from '@hooks/useClinic'
import { useLang } from '@hooks/useLang'
import AirTable from '@components/table'
import { useRequest } from '@services/api'
import AppointmentModal from '@components/modals/appointment'
import ContainerLoader from '@components/loader/container'
import Link from 'next/link'
import Head from 'next/head'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash'

function Appointments() {
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)

  const [patientId, setPatientId] = useState()
  const [appointmentId, setAppointmentId] = useState()

  const router = useRouter()
  const { token } = useAuth()
  const { clinicId, selectedClinic } = useClinic()
  const { translations } = useLang()
  const T = translations

  const {
    data,
    revalidate,
    error
  } = useRequest(clinicId && `prod/clinicapi/GetAppointments2?clinic_id=${clinicId}`, { token })

  const columns = useMemo(() => {
    return [
      {
        Header: 'Image',
        accessor: 'patient.small_image_url',
        Cell({ value }) {
          return value ?
            <img src={value}/> :
            <div style={{ width: '64px', height: '64px', backgroundColor: '#d9d9d9' }}></div>
        }
      },
      {
        Header: 'Name',
        accessor: 'patient',
        Cell({ value }) {
          return <Link href={`/patients/details?id=${value.id}`}><a className="text-primary">{value.display_name}</a></Link>
        }
      },
      {
        Header: 'Gender',
        accessor: 'patient.gender_trans_key',
        Cell({ value }) {
          return value && T[value]
        }
      },
      {
        Header: 'Age',
        accessor: 'patient.age',
      },
      {
        Header: 'Next visit',
        accessor: '',
        Cell({ row }) {
          const { original: { appointment, patient } } = row
          return (
            <div>
              {appointment.friendly.scope_name_trans_key || appointment.friendly.specifical_value ?
                <div
                  className="cursor-pointer text-primary hover:underline"
                  onClick={() => {
                    setShowAppointmentModal(true)
                    setPatientId(patient.id)
                    setAppointmentId(appointment.appointment_id)
                  }}
                >
                  {appointment.friendly.scope_name_trans_key && T[appointment.friendly.scope_name_trans_key]} {' '}
                  {appointment.friendly.specifical_value && appointment.friendly.specifical_value} {' '}
                </div> :
                <div
                  className="cursor-pointer text-primary hover:underline"
                  onClick={() => {
                    setShowAppointmentModal(true)
                    setPatientId(patient.id)
                    setAppointmentId(null)
                  }}
                >
                  {T['Page.Patients.ScheduleAction.Caption']}
                </div>
              }
            </div>
          )
        }
      },
      {
        Header: 'With Member',
        accessor: 'appointment.with_member.display_name',
      },
    ]
  }, [data])

  if(error) {
    router.back()
    return toast.error('Unknown error')
  }

  if (!data) {
    return <ContainerLoader/>
  }

  return (
    <>
      <Head>
        <title>{T['Page.Master.AppointmentsLink.Caption']} | {selectedClinic.display_name}</title>
      </Head>
      <div className="row">
        <div className="col-md-12 mt-5">
          {isEmpty(data) && (
            <h3 className="text-center">{T['Page.Appointments.NoAppointments.Label']}</h3>
          )}
        </div>
        {data.map((a, idx) => (
          <div className="col-md-12" key={idx}>
            <AirTable
              columns={columns}
              data={a.appointments}
              loading={!data}
            >
              <div className="card-head pb-0">
                <h4 className="flex">{T[a.group_name]}</h4>
              </div>
            </AirTable>
          </div>
        ))}
      </div>
      <AppointmentModal
        modalIsOpen={showAppointmentModal}
        onCloseModal={() => setShowAppointmentModal(false)}
        appointmentsRevalidation={revalidate}
        patientId={patientId}
        appointmentId={appointmentId}
        token={token}
        clinicId={clinicId}
        formatType={selectedClinic.page_settings.time_format.is_24_hour_format ? "HH:mm" : "h:mm a"}
        is12Hour={!selectedClinic.page_settings.time_format.is_24_hour_format}
      />
    </>
  )
}

// export async function getStaticProps() {
//   const options = await clinicService.getClinicMembers()
//   return { props: { options } }
// }

export default withAuth(Appointments)