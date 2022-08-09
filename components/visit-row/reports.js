import React, { useEffect, useState } from 'react'
import ReactTooltip from 'react-tooltip'
import useWindowSize from '@hooks/useWindowSize'
import SelectReportsModal from '@components/modals/select-reports'
import { useLang } from '@hooks/useLang'

const VisitReports = (
  {
    data,
    translations,
    loading,
    setLoading,
    clinicId,
    token,
    visitId,
    revalidate
  }
) => {
  const { T = translations, lang } = useLang()
  const { width } = useWindowSize()

  const [showSelectFields, setShowSelectFields] = useState(false)
  const [modalType, setModalType] = useState('')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (width <= 991) {
      setShowSelectFields(true)
    }
  }, [width, modalType, showModal])

  const generateReport = (reportKey) => {
    window.open(`http://clinicreportapi.azurewebsites.net/report/systemreport?report_key=${reportKey}&clinic_id=${clinicId}&visit_id=${visitId}&lang_key=${lang}&token=${token}`, '_blank')
  }

  return (
    <div
      className="pl-5 mt-2 lg:overflow-hidden overflow-x-scroll w-full"
      onMouseEnter={() => setShowSelectFields(true)}
      onMouseLeave={() => setShowSelectFields(false)}
    >
      <ReactTooltip/>
      <div className="flex items-center mb-5">
        <p className="flex font-semibold text-black text-lg">{T[data.box_trans_key]}</p>
        {showSelectFields && (
          <a
            className="text-primary lg:mx-10 mx-5 font-normal"
            onClick={() => {
              setModalType('SelectFields')
              setShowModal(true)
            }}
          >
            {T['Page.VisitDetails.SelectReports.Caption']}
          </a>
        )}
      </div>
      {data.reports.filter(report => report.is_displayed).map(report => (
        <div
          key={report.report_key}
          className="flex items-center border border-medium-gray rounded-full mb-3 p-1.5 px-3 w-full lg:w-72 cursor-pointer hover:bg-gray-100"
          onClick={() => generateReport(report.report_key)}
        >
          <div
            className="w-6 h-6 rounded-md bg-red-500 text-white flex items-center justify-center"
            style={{ fontSize: '9px', fontWeight: '600' }}
          >
            PDF
          </div>
          <p className="text-black mx-2">{T[report.report_trans_key]}</p>
        </div>
      ))}
      {modalType === 'SelectFields' && (
        <SelectReportsModal
          showModal={showModal}
          setShowModal={setShowModal}
          setModalType={setModalType}
          token={token}
          clinicId={clinicId}
          revalidate={revalidate}
          translations={translations}
          data={data}
          visitId={visitId}
          loading={loading}
          setLoading={setLoading}
        />
      )}
    </div>
  )
}

export default VisitReports