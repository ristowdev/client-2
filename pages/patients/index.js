import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import withAuth from '@hocs/withAuth'
import { useAuth } from '@hooks/useAuth'
import { useClinic } from '@hooks/useClinic'
import { useLang } from '@hooks/useLang'
import AirTable from '@components/table'
import { useRequest } from '@services/api'
import { patientService } from '@services/index'
import CreatePatientModal from '@components/modals/create-patient'
import AppointmentModal from '@components/modals/appointment'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import ContainerLoader from '@components/loader/container'

function Patients({ options }) {
  const [showPatientModal, setShowPatientModal] = useState(false)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)

  const [patientId, setPatientId] = useState()
  const [appointmentId, setAppointmentId] = useState()

  const [selectedOption, setSelectedOption] = useState('LastVisitDesc')
  const [search, setSearch] = useState()
  const [submitSearch, setSubmitSearch] = useState('')

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [pageCount, setPageCount] = useState(0)
  const fetchIdRef = useRef(0)

  const { token } = useAuth()
  const { clinicId, selectedClinic } = useClinic()
  const { translations, lang } = useLang()
  const T = translations
  const router = useRouter()

  const {
    data,
    revalidate,
    error
  } = useRequest(clinicId && `prod/clinicapi/GetPatients?clinic_id=${clinicId}&search_text=${submitSearch}&sorting_key=${selectedOption}`, { token })

  useEffect(() => {
    //when search input is empty(after deleting some value) it automatically calling get patients with empty submit search.
    if (search === "") {
      setSubmitSearch("")
    }
  }, [search])

  const fetchData = useCallback(({ pageSize, pageIndex }) => {
    const fetchId = ++fetchIdRef.current
    setLoading(true)

    if (data) {
      if (fetchId === fetchIdRef.current) {
        const startRow = pageSize * pageIndex
        const endRow = startRow + pageSize

        setItems(data.slice(startRow, endRow))
        setPageCount(Math.ceil(data.length / pageSize))
        setLoading(false)
      }
    }
  }, [data])

  const columns = useMemo(() => {
    return [
      {
        Header: 'Image',
        accessor: 'patient.small_image_url',
        Cell({ value, row }) {
          return value ? (
            <Link passHref href={`/patients/visits?id=${row.original.patient.id}`}>
              <img src={value} className="cursor-pointer"/>
            </Link>
          ) : (
            <Link passHref href={`/patients/visits?id=${row.original.patient.id}`}>
              <div style={{ width: '64px', height: '64px', backgroundColor: '#d9d9d9' }} className="cursor-pointer"/>
            </Link>
          )
        }
      },
      {
        Header: 'Name',
        accessor: 'patient',
        Cell({ value }) {
          return <Link href={`/patients/visits?id=${value.id}`}><a
            className="text-primary">{value.display_name}</a></Link>
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
        Header: 'Last Visit',
        accessor: 'last_visit.friendly',
        Cell({ value }) {
          return `${value?.before_value_trans_key ? T[value?.before_value_trans_key] : ""} ${value.specifical_value || ""} ${value?.after_value_trans_key ? T[value?.after_value_trans_key] : ""}`
        }
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
        <title>{T['Page.Master.PatientsLink.Caption']} | {selectedClinic.display_name}</title>
      </Head>
      <div className="row">
        <div className="col-md-6 col-12 md:mb-9 mb-3">
          <p className="flex">{T['Page.Patients.SearchTextbox.Watermark']}</p>
          <div className="input-group relative">
            <form className="w-full" onSubmit={(e) => e.preventDefault()}>
              <input
                className="form-control rounded"
                placeholder={T['Page.Patients.SearchTextbox.Watermark']}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className={`fa fa-search absolute ${lang == 'Heb' ? 'left-3' : 'right-3'} top-1 text-xl text-deep-blue cursor-pointer`}
                type="submit"
                onClick={() => setSubmitSearch(search || "")}
              />
            </form>
          </div>
        </div>
        <div className="col-md-6 col-12 mb-12 mb-3">
          <p className="flex">{T['Page.Patients.SortByDropdown.Label']}</p>
          <select
            className="form-control rounded"
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            {options.map((option, idx) => (
              <option value={option.key} key={idx}>{T[option.trans_key]}</option>
            ))}
          </select>
        </div>
        <div className="col-md-12">
          <AirTable
            columns={columns}
            data={items}
            fetchData={fetchData}
            loading={loading}
            pageCount={pageCount}
            pagging={true}
            // linkedItems={true}
          >
            <div className="card-head pb-0">
              <div className="flex justify-between lg:flex-row flex-col">
                <h4 className="flex">{T['Page.Master.PatientsLink.Caption']}</h4>
                <button
                  className="btn btn-circle btn-info"
                  onClick={() => setShowPatientModal(true)}
                >
                  {T['Page.Patients.NewPatientItem.Caption']}
                </button>
              </div>
            </div>
          </AirTable>
        </div>
      </div>
      <CreatePatientModal
        modalIsOpen={showPatientModal}
        onCloseModal={() => setShowPatientModal(false)}
        revalidate={revalidate}
        token={token}
        clinicId={clinicId}
      />
      <AppointmentModal
        modalIsOpen={showAppointmentModal}
        onCloseModal={() => setShowAppointmentModal(false)}
        appointmentsRevalidation={revalidate}
        patientId={patientId}
        appointmentId={appointmentId}
        token={token}
        clinicId={clinicId}
        formatType={selectedClinic.page_settings.time_format.is_24_hour_format ? "HH:mm" : "hh:mm a"}
      />
    </>
  )
}

export async function getStaticProps() {
  const options = await patientService.getSortingOptions()
  return { props: { options } }
}

export default withAuth(Patients)
