import React, { useEffect, useState } from 'react'
import withAuth from '@hocs/withAuth'
import { useRouter } from 'next/router'
import { useAuth } from '@hooks/useAuth'
import { useClinic } from '@hooks/useClinic'
import { useLang } from '@hooks/useLang'
import { useRequest } from '@services/api'
import SubNavigation from '@components/sub-navigation'
import ContainerLoader from '@components/loader/container'
import Button from '@components/button'
import { visitService } from '@services/index'
import VisitHeader from '@components/forms/visit-header'
import { toast } from 'react-toastify'
import { renderBoxFieldType, showErrorMessage } from '@utils/helpers'
import FormLoader from '@components/loader/form'
import Head from 'next/head'
import VisitNextAppointment from '@components/visit-next-appointment'
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from 'react-accessible-accordion'

function VisitDetails({ visitOptions }) {
  const router = useRouter()

  const { id } = router.query

  const [loading, setLoading] = useState(false)

  const { token } = useAuth()
  const { clinicId, selectedClinic } = useClinic()
  const { translations } = useLang()
  const T = translations
  const [selectedTab, setSelectedTab] = useState()

  console.log(selectedTab)

  useEffect(() => {
    if (router.query?.categoryKey) {
      setSelectedTab(router.query.categoryKey)
    } else {
      setSelectedTab('Openings')
    }
  }, [router.query])

  const deleteVisit = async () => {
    setLoading(true)
    const data = {
      visit_id: id,
      token,
      clinic_id: clinicId
    }

    try {
      await visitService.deleteVisit(data)
      router.back()
    } catch (e) {
      return toast.error(T[showErrorMessage(e.message)])
    }

    setLoading(false)
  }

  const submitVisit = async () => {
    setLoading(true)
    const data = {
      visit_id: id,
      token,
      clinic_id: clinicId
    }

    try {
      await visitService.submitVisit(data)
      router.push('/')
    } catch (e) {
      return toast.error(T[showErrorMessage(e.message)])
    } finally {
      setLoading(false)
    }
  }

  const {
    data,
    revalidate,
    error
  } = useRequest(token && clinicId && `/prod/visitapi/GetVisitDetails?clinic_id=${clinicId}&visit_id=${id}`, { token })

  if (error) {
    router.back()
    return toast.error(T[showErrorMessage(error?.response?.data?.ErrorCode)] || 'Unknown error')
  }

  const {
    categories,
    edit_by,
    next_appointment,
    patient_header,
    visit_date,
    visit_status,
    visit_time,
    visit_title,
    visit_type
  } = data || {}

  if (!data || error) {
    return <ContainerLoader/>
  }

  return (
    <>
      <Head>
        <title>{T['Db.VisitType.Visit']} | {patient_header.display_name}</title>
      </Head>
      <SubNavigation
        image={patient_header.mini_image_url}
        header={patient_header.display_name}
        patientDetails={true}
      >
        <div>
          <span>{T[patient_header.gender_trans_key]} {patient_header.age}</span>
        </div>
      </SubNavigation>
      <div className="row md:mt-10 mt-6">
        <div className="col-md-12">
          <div className="card card-box relative visit-details-width">
            {loading && <FormLoader/>}
            <div className="card-head pb-0">
              <div className="flex justify-between">
                <h4>{visit_title}</h4>
                <Button
                  classList="btn btn-circle btn-danger"
                  text={T['Page.VisitDetails.DeleteVisitAction.Caption']}
                  buttonSpinnerColor="#fff"
                  onClick={() => deleteVisit()}
                />
              </div>
            </div>
            <div className="card-body">
              <VisitHeader
                visitOptions={visitOptions}
                translations={translations}
                visitType={visit_type}
                visitTitle={visit_title}
                visitDate={visit_date}
                visitTime={visit_time}
                visitStatus={visit_status}
                editedBy={edit_by}
                revalidate={revalidate}
                loading={loading}
                setLoading={setLoading}
                clinicId={clinicId}
                token={token}
                visitId={id}
                formatType={selectedClinic.page_settings.time_format.is_24_hour_format ? "HH:mm" : "h:mm a"}
                is12Hour={!selectedClinic.page_settings.time_format.is_24_hour_format}
              />
              {/*{categories.map((category, idx) => (*/}
              {/*  <div key={idx}>*/}
              {/*    <div*/}
              {/*      className="flex justify-between w-full bg-cyan-blue p-1.5 mt-10 mb-4 items-center cursor-pointer"*/}
              {/*      data-toggle="collapse"*/}
              {/*      href={`#collapseExample-${idx}`}*/}
              {/*      aria-expanded="false"*/}
              {/*    >*/}
              {/*      <h4 className="flex text-2xl underline font-normal">*/}
              {/*        {T[category.category_trans_key]}*/}
              {/*      </h4>*/}
              {/*      <i className="fas fa-caret-down"/>*/}
              {/*    </div>*/}
              {/*    <div className="collapse show" id={`collapseExample-${idx}`}>*/}
              {/*      {renderBoxFieldType(category.boxes, translations, loading, setLoading, clinicId, token, id, revalidate)}*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*))}*/}
              {selectedTab && (
                <Accordion allowZeroExpanded preExpanded={[selectedTab]}>
                  {categories.map((category) => (
                    <AccordionItem key={category.category_key} uuid={category.category_key}>
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          <h4 className="flex text-2xl underline font-normal" id={category.category_key}>
                            {T[category.category_trans_key]}
                          </h4>
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <div>
                          {renderBoxFieldType(category.boxes, translations, loading, setLoading, clinicId, token, id, revalidate)}
                        </div>
                      </AccordionItemPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
              <div className="mt-20">
                <h4 className="flex text-2xl underline font-normal mb-8">
                  {T['Page.VisitDetails.NextAppointment.Caption']}
                </h4>
                <VisitNextAppointment
                  key={data.next_appointment?.appointment_id}
                  nextAppointment={data.next_appointment}
                  revalidate={revalidate}
                  clinicId={clinicId}
                  patientId={data.patient_header.id}
                />
              </div>
            </div>
          </div>
          <div className="mt-5 flex justify-end mb-3 visit-details-width">
            <button
              onClick={submitVisit}
              className="btn btn-primary rounded px-10 py-3"
            >
              {T['Page.VisitDetails.SubmitAction.Caption']}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getStaticProps() {
  const visitOptions = await visitService.getVisitTypes()
  return { props: { visitOptions } }
}

export default withAuth(VisitDetails)
