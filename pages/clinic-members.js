import React, { useMemo, useState } from 'react'
import withAuth from '@hocs/withAuth'
import SubNavigation from '@components/sub-navigation'
import { useRequest } from '@services/api'
import { useAuth } from '@hooks/useAuth'
import Link from '@components/link'
import { useLang } from '@hooks/useLang'
import { useClinic } from '@hooks/useClinic'
import ContainerLoader from '@components/loader/container'
import AirTable from '@components/table'
import AddClinicMemberModal from '@components/modals/add-clinic-member'
import RoleSelect from '@components/role-select'
import ClinicAction from '@components/clinic-action'
import { clinicService } from '@services/index'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'

function ClinicMembersPage({ roles }) {
  const { clinicId } = useClinic()
  const { token } = useAuth()
  const { translations } = useLang()
  const T = translations
  const router = useRouter()

  const [showModal, setShowModal] = useState(false)

  const {
    data,
    revalidate,
    error
  } = useRequest(clinicId && `prod/clinicapi/GetClinicMemberships?clinic_id=${clinicId}`, { token })
  const { clinic_header, memberships } = data || {}

  const columns = useMemo(() => {
    return [
      {
        Header: 'Image',
        accessor: 'member.mini_image_url',
        Cell({ value }) {
          return <img src={value}/>
        }
      },
      {
        Header: 'Display Name',
        accessor: 'member.display_name',
      },
      {
        Header: 'Role',
        accessor: 'role_key',
        Cell({ data, row }) {
          return <RoleSelect
            roles={roles}
            selectedRole={data[row.id].role_key}
            memberId={data[row.id].member.id}
            canEditRole={data[row.id].available_actions.edit_member_role}
            revalidate={revalidate}
            clinicId={clinicId}
            token={token}
          />
        }
      },
      {
        Header: 'Actions',
        accessor: 'available_actions',
        Cell({ data, row }) {
          return <ClinicAction
            action={data[row.id].available_actions}
            revalidate={revalidate}
            token={token}
            clinicId={clinicId}
            memberId={data[row.id].member.id}
          />
        }
      }
    ]
  }, [memberships])

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
        <title>{T['Page.ClinicPages.ClinicMembersLink.Caption']} | {clinic_header.display_name}</title>
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
      <div className="row mt-12">
        <div className="col-md-12">
          <AirTable
            columns={columns}
            data={memberships}
            loading={!data}
            hideTableHeader
          >
            <div className="card-head pb-0">
              <div className="flex justify-between lg:flex-row flex-col">
                <h4 className="flex">{T['Page.ClinicMembers.Title.Caption']}</h4>
                <button
                  className="btn btn-circle btn-info"
                  onClick={() => setShowModal(true)}
                >
                  {T['Page.ClinicMembers.AddMemberAction.Caption']}
                </button>
              </div>
            </div>
          </AirTable>
        </div>
      </div>
      <AddClinicMemberModal
        modalIsOpen={showModal}
        onCloseModal={() => setShowModal(false)}
        revalidate={revalidate}
        token={token}
        clinicId={clinicId}
      />
    </>
  )
}

export async function getStaticProps() {
  const roles = await clinicService.getRoles()
  return { props: { roles } }
}

export default withAuth(ClinicMembersPage)
