import React, { useEffect, useRef, useState } from 'react'
import { onClickOutsideRef, renderSelectedSource } from '@utils/helpers'
import SelectVisitFieldsModal from '@components/modals/select-visit-fields'
import ReactTooltip from 'react-tooltip'
import useWindowSize from '@hooks/useWindowSize'
import VisitUnits from '@components/forms/visit-units'
import VisitSourceSelect from '@components/forms/visit-source-select'
import VisitFigureFields from '@components/forms/visit-figure-fields'
import SourceFormulaModal from '@components/modals/source-formula'
import VisitAttachedSources from '@components/visit-attached-sources'
import AttachedSourcesModal from '@components/modals/attached-sources'
import SourceEditableFormulaModal from '@components/modals/source-editable-formula'
import SourceRankerModal from '@components/modals/source-ranker'
import ActivityFactorsBarsModal from '@components/modals/activity-factors-bars'
import ActivityFactors24hModal from '@components/modals/activity-factors-24h'
import { useLang } from '@hooks/useLang'
import ExerciseSheetModal from '@components/modals/exercise-sheet'
import { visitService } from '@services/index'
import EatingPlanModal from '@components/modals/eating-plan'
import EditFoodSheetModal from '@components/modals/edit-food-sheet'
import { useRouter } from 'next/router'

function VisitRow({ data, translations, loading, setLoading, clinicId, token, visitId, revalidate }) {
  const router = useRouter()
  const T = translations
  const size = useWindowSize()
  const { lang } = useLang()

  const [showSourceLabel, setShowSourceLabel] = useState(null)
  const [showAttachedSourceLabel, setShowAttachedSourceLabel] = useState(false)
  const [selectedSourceKey, setSelectedSourceKey] = useState('')

  const [showSelect, setShowSelect] = useState(false)
  const [showSourceSelect, setShowSourceSelect] = useState()
  const [showSelectFields, setShowSelectFields] = useState(false)

  const [modalType, setModalType] = useState('')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (modalType !== '') {
      setShowModal(true)
    }
  }, [modalType])

  useEffect(() => {
    const modalTypeQuery = router.query?.modalType
    console.log(modalTypeQuery, modalType, showModal)
    if(modalTypeQuery && data.box_key === 'Intakes' && !modalType && !showModal) {
      setTimeout(() => {
        setShowModal(true)
        setModalType(modalTypeQuery)
      }, 300)
    }
  }, [router.pathname])

  useEffect(() => {
    if (size.width <= 991) {
      setShowSelectFields(true)
      setShowAttachedSourceLabel(true)
      setShowSourceSelect(true)
    }
  }, [size, modalType, showModal])

  const select = useRef()
  const sourceSelect = useRef()

  useEffect(() => {
    onClickOutsideRef(select, showSelect, setShowSelect)
    onClickOutsideRef(sourceSelect, showSourceSelect, setShowSourceSelect)
  }, [showSelect, showSourceSelect])

  return (
    <>
      <div
        className="pl-5 mt-2 lg:overflow-hidden overflow-x-scroll w-full"
        onMouseEnter={() => setShowSelectFields(true)}
        onMouseLeave={() => setShowSelectFields(false)}
      >
        <ReactTooltip/>
        <div className="flex items-center mb-5">
          <p className="flex font-semibold text-black text-lg">{T[data.box_trans_key]}</p>
          {showSelectFields &&
          <a
            className="text-primary lg:mx-10 mx-5 font-normal"
            onClick={() => setModalType('SelectFields')}
          >
            {T['Page.VisitDetails.SelectFields.Caption']}
          </a>
          }
        </div>
        <div className="mb-10">
          {(data.figure_fields || []).map((field, idx) => (
            <div key={idx}>
              {field.is_displayed &&
              <div
                className="flex items-center mb-3"
                onMouseEnter={() => !field.source_key && field.sources && !showSourceSelect && setShowSourceLabel(field.figure_key)}
                onMouseLeave={() => !field.source_key && field.sources && !showSourceSelect && setShowSourceLabel(null)}
              >
                {/* Figure fields  */}
                <VisitFigureFields
                  field={field}
                  idx={idx}
                  loading={loading}
                  setLoading={setLoading}
                  clinicId={clinicId}
                  token={token}
                  visitId={visitId}
                  revalidate={revalidate}
                  translations={translations}
                />

                {/* Units select */}
                <div className="mx-4 w-24" style={{ minWidth: '70px' }}>
                  <VisitUnits
                    field={field}
                    showSelect={showSelect}
                    setShowSelect={setShowSelect}
                    loading={loading}
                    setLoading={setLoading}
                    clinicId={clinicId}
                    token={token}
                    visitId={visitId}
                    revalidate={revalidate}
                    translations={translations}
                    select={select}
                  />
                </div>

                {/* On hover: Use calculated value (from sources) */}

                {!field.source_key && field.sources && showSourceLabel === field.figure_key && (
                  <div className="w-96">
                    {showSourceSelect === field.figure_key ?
                      <VisitSourceSelect
                        showSourceSelect={showSourceSelect}
                        setShowSourceSelect={setShowSourceSelect}
                        sourceSelect={sourceSelect}
                        loading={loading}
                        setLoading={setLoading}
                        clinicId={clinicId}
                        token={token}
                        visitId={visitId}
                        revalidate={revalidate}
                        translations={translations}
                        sources={field.sources}
                        field={field}
                      /> :
                      <p
                        className={`text-sm cursor-pointer text-gray w-96 -mt-1 lg:block hidden ${lang === 'Heb' && 'text-right'}`}
                        onClick={() => setShowSourceSelect(field.figure_key)}
                      >
                        {T['Page.VisitDetails.SelectSource.Caption']}
                      </p>
                    }
                  </div>
                )}

                {!field.source_key && field.sources && size.width <= 991 && (
                  <div className="w-96">
                    {showSourceSelect !== field.figure_key && (
                      <p
                        className={`text-sm cursor-pointer text-gray w-96 -mt-1 lg:hidden block ${lang === 'Heb' && 'text-right'}`}
                        onClick={() => {
                          setShowSourceLabel(field.figure_key)
                          setShowSourceSelect(field.figure_key)
                        }}
                      >
                        {T['Page.VisitDetails.SelectSource.Caption']}
                      </p>
                    )}
                  </div>
                )}

                {/* Select Source: selected source(placeholder text) */}
                {field.source_key && field.sources?.length > 0 && (
                  <>
                    {showSourceSelect === field.figure_key ?
                      <div>
                        {renderSelectedSource(setShowSourceSelect, T, field.sources, field.source_key, field.figure_key, setModalType, setSelectedSourceKey, lang)}
                        <VisitSourceSelect
                          showSourceSelect={showSourceSelect}
                          setShowSourceSelect={setShowSourceSelect}
                          sourceSelect={sourceSelect}
                          loading={loading}
                          setLoading={setLoading}
                          clinicId={clinicId}
                          token={token}
                          visitId={visitId}
                          revalidate={revalidate}
                          translations={translations}
                          sources={field.sources}
                          field={field}
                        />
                      </div> :
                      renderSelectedSource(setShowSourceSelect, T, field.sources, field.source_key, field.figure_key, setModalType, setSelectedSourceKey, lang)
                    }
                  </>
                )}
              </div>
              }
            </div>
          ))}
        </div>
      </div>

      {/* Attached Sources: */}
      {data.available_sources?.length > 0 && (
        <div
          onMouseEnter={() => setShowAttachedSourceLabel(true)}
          onMouseLeave={() => setShowAttachedSourceLabel(false)}
          className="lg:ml-7 ml-2 mb-20"
        >
          <div className="flex text-base">
            <p>{T['Page.VisitDetails.AttachedSources.Caption']}</p>
            {showAttachedSourceLabel && (
              <a
                className="text-primary lg:mx-10 mx-5 font-normal"
                onClick={() => setModalType('AttachedSources')}
              >
                {T['Page.VisitDetails.SelectSources.Caption']}
              </a>
            )}
          </div>
          <div className="mt-4">
            <VisitAttachedSources
              setSelectedSourceKey={setSelectedSourceKey}
              data={data.available_sources}
              translations={T}
              showModal={showModal}
              setShowModal={setShowModal}
              setModalType={setModalType}
            />
          </div>
        </div>
      )}

      {/* Visit Details Modals */}
      {modalType === 'SelectFields' && (
        <SelectVisitFieldsModal
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
      {modalType === 'Formula' && (
        <SourceFormulaModal
          showModal={showModal}
          setShowModal={setShowModal}
          setModalType={setModalType}
          selectedSourceKey={selectedSourceKey}
          setSelectedSourceKey={setSelectedSourceKey}
          token={token}
          clinicId={clinicId}
          translations={translations}
          visitId={visitId}
        />
      )}
      {modalType === 'EditableFormula' && (
        <SourceEditableFormulaModal
          showModal={showModal}
          setShowModal={setShowModal}
          setModalType={setModalType}
          selectedSourceKey={selectedSourceKey}
          setSelectedSourceKey={setSelectedSourceKey}
          token={token}
          clinicId={clinicId}
          translations={translations}
          visitId={visitId}
          loading={loading}
          setLoading={setLoading}
          revalidateData={revalidate}
        />
      )}
      {modalType === 'EatingPlan' && (
        <EatingPlanModal
          showModal={showModal}
          setShowModal={setShowModal}
          setModalType={setModalType}
          selectedSourceKey={selectedSourceKey}
          setSelectedSourceKey={setSelectedSourceKey}
          token={token}
          clinicId={clinicId}
          translations={translations}
          visitId={visitId}
          loading={loading}
          setLoading={setLoading}
          revalidateData={revalidate}
          isPlan={true}
          modalTitle={T['Db.Source.EatingPlan.Short']}
        />
      )}
      {modalType === 'EatingLog' && (
        <EatingPlanModal
          showModal={showModal}
          setShowModal={setShowModal}
          setModalType={setModalType}
          selectedSourceKey={selectedSourceKey}
          setSelectedSourceKey={setSelectedSourceKey}
          token={token}
          clinicId={clinicId}
          translations={translations}
          visitId={visitId}
          loading={loading}
          setLoading={setLoading}
          revalidateData={revalidate}
          isPlan={false}
          modalTitle={T['Db.Source.EatingLog.Short']}
        />
      )}
      {modalType === 'EditFoodSheet' && (
        <EditFoodSheetModal
          showModal={showModal}
          setShowModal={setShowModal}
          setModalType={setModalType}
          selectedSourceKey={selectedSourceKey}
          setSelectedSourceKey={setSelectedSourceKey}
          token={token}
          clinicId={clinicId}
          translations={translations}
          visitId={visitId}
          loading={loading}
          setLoading={setLoading}
          revalidateData={revalidate}
        />
      )}
      {(modalType === 'ExerciseSheet' || modalType === 'ExercisePlan') && (
        <ExerciseSheetModal
          showModal={showModal}
          setShowModal={setShowModal}
          setModalType={setModalType}
          selectedSourceKey={selectedSourceKey}
          setSelectedSourceKey={setSelectedSourceKey}
          token={token}
          clinicId={clinicId}
          translations={translations}
          visitId={visitId}
          loading={loading}
          setLoading={setLoading}
          revalidateData={revalidate}
          modalType={modalType}
        />
      )}
      {modalType === 'Ranker' && (
        <SourceRankerModal
          showModal={showModal}
          setShowModal={setShowModal}
          setModalType={setModalType}
          selectedSourceKey={selectedSourceKey}
          setSelectedSourceKey={setSelectedSourceKey}
          token={token}
          clinicId={clinicId}
          translations={translations}
          visitId={visitId}
        />
      )}
      {modalType === 'AttachedSources' && (
        <AttachedSourcesModal
          attachedSources={data.available_sources}
          showModal={showModal}
          setShowModal={setShowModal}
          setModalType={setModalType}
          setSelectedSourceKey={setSelectedSourceKey}
          revalidate={revalidate}
          token={token}
          clinicId={clinicId}
          translations={translations}
          visitId={visitId}
          loading={loading}
          setLoading={setLoading}
        />
      )}
      {modalType === 'ActivityFactorsBars' && (
        <ActivityFactorsBarsModal
          showModal={showModal}
          setShowModal={setShowModal}
          setModalType={setModalType}
          selectedSourceKey={selectedSourceKey}
          setSelectedSourceKey={setSelectedSourceKey}
          token={token}
          clinicId={clinicId}
          translations={translations}
          visitId={visitId}
          figureFields={data.figure_fields}
          revalidate={revalidate}
          setLoading={setLoading}
        />
      )}
      {modalType === 'ActivityFactors24H' && (
        <ActivityFactors24hModal
          showModal={showModal}
          setShowModal={setShowModal}
          setModalType={setModalType}
          selectedSourceKey={selectedSourceKey}
          setSelectedSourceKey={setSelectedSourceKey}
          token={token}
          clinicId={clinicId}
          translations={translations}
          visitId={visitId}
          figureFields={data.figure_fields}
          revalidate={revalidate}
          setLoading={setLoading}
        />
      )}
    </>
  )
}

export default VisitRow
