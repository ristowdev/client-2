import React from 'react'
import withAuth from '@hocs/withAuth'
import Link from '@components/link'
import { useAuth } from '@hooks/useAuth'
import SubNavigation from '@components/sub-navigation'
import { useRequest } from '@services/api'
import { useLang } from '@hooks/useLang'
import ContainerLoader from '@components/loader/container'
import { renderClinicPlan, showErrorMessage } from '@utils/helpers'
import { toast } from 'react-toastify'
import { clinicService } from '@services/index'
import { useClinic } from '@hooks/useClinic'
import Head from 'next/head'
import { useRouter } from 'next/router'

function ClinicPlan() {
  const { token } = useAuth()
  const { clinicId, revalidateClinics } = useClinic()
  const { translations } = useLang()
  const T = translations
  const router = useRouter()

  const {
    data,
    revalidate,
    error
  } = useRequest(token && clinicId && `/prod/clinicapi/GetClinicPlanDetails?clinic_id=${clinicId}`, { token })
  const { clinic_header, clinic_plan_details, plans } = data || {}

  const onChangePlan = async (type) => {
    const data = {
      token,
      clinic_id: clinicId,
      plan_key_name: type
    }
    try {
      await clinicService.editClinicPlan(data)
      await revalidateClinics()
      await revalidate()
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
        <title>{T['Page.AdminPages.ClinicPlanLink.Caption']} | {clinic_header.display_name}</title>
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
                  {T['Page.ClinicPlan.Title.Caption']}
                </header>
              </div>
            </div>
            <div className="card-body">
              <div className="row items-center md:mb-10 mb-6">
                <div className="col-md-2">
                  <label>{T['Page.ClinicPlan.BalanceField.Label']}</label>
                </div>
                <div className="col-md-8">
                  <div
                    className="w-full form-control disabled flex input-height items-center"
                  >
                    {clinic_plan_details.balance} {T['Page.ClinicPlan.Eur.Caption']}
                  </div>
                </div>
                <div className="col-md-2">
                  <button className="btn rounded input-height btn-info w-full lg:mt-0 mt-3">
                    {T['Page.ClinicPlan.AddAction.Caption']}
                  </button>
                </div>
              </div>
              <div className="row mb-10 items-center">
                <div className="col-md-2">
                  <label>{T['Page.ClinicPlan.ActivePlan.Label']}</label>
                </div>
                <div className="col-md-10">
                  <div className="w-full form-control disabled flex input-height items-center">
                    <div className="w-16">
                      {renderClinicPlan(clinic_plan_details.active_plan.key_name, clinic_plan_details.active_plan.display_name)}
                    </div>
                    {clinic_plan_details.selected_plan.is_balance_insufficient &&
                    <span
                      className="mx-2"
                      style={{ color: '#dc3545' }}
                    >
                      {T['Page.ClinicPlan.InsufficientComment.Caption']}
                    </span>
                    }
                  </div>
                </div>
              </div>
              <div className="row mb-10 items-center">
                <div className="col-md-2">
                  <label>{T['Page.ClinicPlan.RemainingDays.Label']}</label>
                </div>
                <div className="col-md-10">
                  <div className="w-full form-control disabled flex input-height items-center">
                    {clinic_plan_details.selected_plan.remaining_days ?
                      `${clinic_plan_details.selected_plan.remaining_days} ${T['Page.ClinicPlan.Days.Caption']}` :
                      "-"
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row md:mt-10 mt-6">
        <div className="col-lg-4 col-md-12">
          <div className="card card-box p-4 text-center">
            <div className="h-20">
              <div className="w-24 m-auto">{renderClinicPlan("Free", "FREE")}</div>
            </div>
            <div className="h-20 flex justify-center">
              <p className="font-weight-bold text-black">{T['Page.ClinicPlan.MaxPatients.Label']}: </p>
              <span className="mx-1">{plans[0].max_patients}</span>
            </div>
            <div className="h-20 flex justify-center">
              <p className="font-weight-bold text-black">{T['Page.ClinicPlan.RecoverPatients.Label']}: </p>
              <i className="fa fa-times text-2xl text-red-500 -mt-1 mx-1"></i>
            </div>
            <div className="h-20 flex justify-center">
              <p className="font-weight-bold text-black">{T['Page.ClinicPlan.BasicReports.Label']}: </p>
              <i className="fa fa-check text-2xl text-green-500 -mt-1 mx-1"></i>
            </div>
            <div className="h-20 flex justify-center">
              <p className="font-weight-bold text-black">{T['Page.ClinicPlan.CustomizeReportLogo.Label']}: </p>
              <i className="fa fa-times text-2xl text-red-500 -mt-1 mx-1"></i>
            </div>
            <div className="h-20 flex justify-center">
              <p className="font-weight-bold text-black">{T['Page.ClinicPlan.PremiumReports.Label']}: </p>
              <i className="fa fa-times text-2xl text-red-500 -mt-1 mx-1"></i>
            </div>
            <div className="flex justify-center">
              <p className="font-weight-bold text-black">{T['Page.ClinicPlan.Price30Days.Label']}: </p>
              <span className="mx-1">{T['Page.ClinicPlan.Free.Caption']}</span>
            </div>
          </div>
          <button
            className="btn btn-info btn-block w-full text-lg flex items-center justify-center rounded-lg mb-10"
            onClick={() => onChangePlan(plans[0].key_name)}
            disabled={plans[0].is_selected}
          >
            {plans[0].is_selected === 1 ?
              <><i className="far fa-check-circle mx-2 text-xl"></i>{T['Page.ClinicPlan.Selected.Caption']}</>
              :
              <><i className="far fa-circle mx-2 text-xl"></i>{T['Page.ClinicPlan.Select.Label']}</>
            }
          </button>
        </div>
        <div className="col-lg-4 col-md-12">
          <div className="card card-box p-4 text-center">
            <div className="h-20">
              <div className="w-24 m-auto">{renderClinicPlan("Home", "HOME")}</div>
            </div>
            <div className="h-20 flex justify-center">
              <p className="font-weight-bold text-black">{T['Page.ClinicPlan.MaxPatients.Label']}: </p>
              <span className="mx-1">{plans[1].max_patients}</span>
            </div>
            <div className="h-20 flex justify-center">
              <p className="font-weight-bold text-black">{T['Page.ClinicPlan.RecoverPatients.Label']}: </p>
              <i className="fa fa-times text-2xl text-red-500 -mt-1 mx-1"></i>
            </div>
            <div className="h-20 flex justify-center">
              <p className="font-weight-bold text-black">{T['Page.ClinicPlan.BasicReports.Label']}: </p>
              <i className="fa fa-check text-2xl text-green-500 -mt-1 mx-1"></i>
            </div>
            <div className="h-20 flex justify-center">
              <p className="font-weight-bold text-black">{T['Page.ClinicPlan.CustomizeReportLogo.Label']}: </p>
              <i className="fa fa-check text-2xl text-green-500 -mt-1 mx-1"></i>
            </div>
            <div className="h-20 flex justify-center">
              <p className="font-weight-bold text-black">{T['Page.ClinicPlan.PremiumReports.Label']}: </p>
              <i className="fa fa-times text-2xl text-red-500 -mt-1 mx-1"></i>
            </div>
            <div className="flex justify-center">
              <p className="font-weight-bold text-black">{T['Page.ClinicPlan.Price30Days.Label']}: </p>
              <span className="mx-1">{plans[1].price_30_days} {T['Page.ClinicPlan.Eur.Caption']}</span>
            </div>
          </div>
          <button
            className="btn btn-info btn-block w-full text-lg flex items-center justify-center rounded-lg mb-10"
            onClick={() => onChangePlan(plans[1].key_name)}
            disabled={plans[1].is_selected}
          >
            {plans[1].is_selected === 1 ?
              <><i className="far fa-check-circle mx-2 text-xl"></i>{T['Page.ClinicPlan.Selected.Caption']}</>
              :
              <><i className="far fa-circle mx-2 text-xl"></i>{T['Page.ClinicPlan.Select.Label']}</>
            }
          </button>
        </div>
        <div className="col-lg-4 col-md-12">
          <div className="card card-box p-4 text-center">
            <div className="h-20">
              <div className="w-24 m-auto">{renderClinicPlan("Pro", "PRO")}</div>
            </div>
            <div className="h-20 flex justify-center">
              <p className="font-weight-bold text-black">{T['Page.ClinicPlan.MaxPatients.Label']}: </p>
              <span className="mx-1 text-green-500">{T['Page.ClinicPlan.Unlimited.Caption']}</span>
            </div>
            <div className="h-20 flex justify-center">
              <p className="font-weight-bold text-black">{T['Page.ClinicPlan.RecoverPatients.Label']}: </p>
              <i className="fa fa-check text-2xl text-green-500 -mt-1 mx-1"></i>
            </div>
            <div className="h-20 flex justify-center">
              <p className="font-weight-bold text-black">{T['Page.ClinicPlan.BasicReports.Label']}: </p>
              <i className="fa fa-check text-2xl text-green-500 -mt-1 mx-1"></i>
            </div>
            <div className="h-20 flex justify-center">
              <p className="font-weight-bold text-black">{T['Page.ClinicPlan.CustomizeReportLogo.Label']}: </p>
              <i className="fa fa-check text-2xl text-green-500 -mt-1 mx-1"></i>
            </div>
            <div className="h-20 flex justify-center">
              <p className="font-weight-bold text-black">{T['Page.ClinicPlan.PremiumReports.Label']}: </p>
              <i className="fa fa-check text-2xl text-green-500 -mt-1 mx-1"></i>
            </div>
            <div className="flex justify-center">
              <p className="font-weight-bold text-black">{T['Page.ClinicPlan.Price30Days.Label']}: </p>
              <span className="mx-1">{plans[2].price_30_days} {T['Page.ClinicPlan.Eur.Caption']}</span>
            </div>
          </div>
          <button
            className="btn btn-info btn-block w-full text-lg flex items-center justify-center rounded-lg mb-10"
            onClick={() => onChangePlan(plans[2].key_name)}
            disabled={plans[2].is_selected}
          >
            {plans[2].is_selected === 1 ?
              <><i className="far fa-check-circle mx-2 text-xl"></i>{T['Page.ClinicPlan.Selected.Caption']}</>
              :
              <><i className="far fa-circle mx-2 text-xl"></i>{T['Page.ClinicPlan.Select.Label']}</>
            }
          </button>
        </div>
      </div>
    </>
  )
}

export default withAuth(ClinicPlan)