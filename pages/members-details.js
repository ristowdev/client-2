import React, { useCallback, useMemo, useRef, useState } from 'react'
import withAuth from '@hocs/withAuth'
import { useRequest } from '@services/api'
import { useAuth } from '@hooks/useAuth'
import { useLang } from '@hooks/useLang'
import { useClinic } from '@hooks/useClinic'
import ContainerLoader from '@components/loader/container'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import UserManagementTable from '@components/table/user-management'
import moment from 'moment'

function MembersDetailsPage() {
  const router = useRouter()
  const { clinicId } = useClinic()
  const { token } = useAuth()
  const { translations, lang } = useLang()
  const T = translations

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [pageCount, setPageCount] = useState(0)
  const fetchIdRef = useRef(0)

  const {
    data,
    error
  } = useRequest(clinicId && `/prod/clinicapi/GetMembersAndClinics?clinic_id=${clinicId}`, { token })

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
        Header: '',
        accessor: 'mini_image_url',
        Cell({ value }) {
          return value ? <img src={value}/> :
            <div style={{ width: '64px', height: '64px', backgroundColor: '#d9d9d9' }}/>
        }
      },
      {
        Header: T['Page.MembersManagement.IdField.Label'],
        accessor: 'id',
      },
      {
        Header: T['Page.MembersManagement.FirstNameField.Label'],
        accessor: 'first_name',
      },
      {
        Header: T['Page.MembersManagement.LastNameField.Label'],
        accessor: 'last_name',
      },
      {
        Header: T['Page.MembersManagement.EmailAddressField.Label'],
        accessor: 'email_address',
      },
      {
        Header: T['Page.MembersManagement.PhoneNumberField.Label'],
        accessor: 'phone_number',
      },
      {
        Header: T['Page.MembersManagement.CreateDateField.Label'],
        accessor: 'create_date_utc',
        Cell({ value }) {
          return (
            <div className="flex flex-col">
              <span>{moment(value).format('DD/MM/YYYY')}</span>
              <span>{moment(value).format('HH:mm')}</span>
            </div>
          )
        }
      },
      {
        Header: '-',
        accessor: 'clinics',
        row: true,
        Cell({ value }) {
          return <></>
        }
      },
    ]
  }, [data])


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
        <title>{T['Page.Master.PatientsLink.Caption']}</title>
      </Head>
      <div className="row">
        <div className="col-md-12">
          <UserManagementTable
            columns={columns}
            data={items}
            fetchData={fetchData}
            loading={loading}
            pageCount={pageCount}
            pagging={true}
            showSecondTable
            // linkedItems={true}
          />
        </div>
      </div>
    </>
  )
}

export default withAuth(MembersDetailsPage)
