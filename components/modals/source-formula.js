import React from 'react'
import Modal from '@components/modals/index'
import { useLang } from '@hooks/useLang'
import { useRequest } from '@services/api'
import ContainerLoader from '@components/loader/container'
import ReactTooltip from 'react-tooltip'

function SourceFormulaModal(
  {
    token,
    clinicId,
    visitId,
    showModal,
    setShowModal,
    selectedSourceKey,
    setSelectedSourceKey,
    setModalType
  }
) {
  const { translations, lang } = useLang()
  const T = translations

  const {
    data
  } = useRequest(selectedSourceKey !== "" && `/prod/visitapi/GetFormulaDetails?clinic_id=${clinicId}&visit_id=${visitId}&source_key=${selectedSourceKey}`, { token })

  const { formula, input_fields, output_fields, reference, segment, source } = data || {}

  return (
    <Modal
      modalIsOpen={showModal}
      onCloseModal={() => {
        setShowModal(false)
        setSelectedSourceKey('')
        setModalType('')
      }}
      header={T[source?.source_trans_key]}
    >
      {!data ? <ContainerLoader/> :
        <div className="mt-5">
          <ReactTooltip place="right"/>
          <div className="border-top pt-5 border-top-gray">
            <div className="mb-1 flex">
              <h5 className="text-bold w-52 flex">{T['Modal.FormulaDetails.SegmentName.Caption']}</h5>
              <h5 className="w-92">{T[segment.segment_trans_key]}</h5>
            </div>
          </div>
          <div className="mt-5">
            {segment.gender_trans_key && (
              <div className="mb-1 flex items-center">
                <h5 className="w-52 flex">{T['Modal.FormulaDetails.Gender.Caption']}</h5>
                <input
                  className="form-control text-base w-28"
                  disabled={true}
                  value={T[segment.gender_trans_key]}
                />
              </div>
            )}
            {segment.max_age && segment.min_age && (
              <div className="mb-1 flex items-center">
                <h5 className="w-52 flex">{T['Modal.FormulaDetails.Age.Caption']}</h5>
                <input
                  className="form-control text-base w-28"
                  disabled={true}
                  value={`${segment.min_age} - ${segment.max_age}`}
                />
              </div>
            )}
            {!segment.max_age && segment.min_age && (
              <div className="mb-1 flex items-center">
                <h5 className="w-52 flex">{T['Modal.FormulaDetails.Age.Caption']}</h5>
                <input
                  className="form-control text-base w-28"
                  disabled={true}
                  value={`${segment.min_age}+`}
                />
              </div>
            )}
            {segment.max_age && !segment.min_age && (
              <div className="mb-1 flex items-center">
                <h5 className="w-52 flex">{T['Modal.FormulaDetails.Age.Caption']}</h5>
                <input
                  className="form-control text-base w-28"
                  disabled={true}
                  value={`-${segment.max_age}`}
                />
              </div>
            )}
            <div className="border-top pt-5 border-top-gray mt-10">
              <div className="mb-1 flex">
                <h5 className="text-bold">{T['Modal.FormulaDetails.InputFields.Caption']}</h5>
              </div>
            </div>
            <div className="mt-5">
              {input_fields?.map((input, idx) => (
                <div className="flex items-center mb-1" key={idx}>
                  <h5
                    className="w-52 cursor-pointer flex"
                    data-tip={T[input.figure_description_trans_key]}
                  >
                    {T[input.figure_field_trans_key]}
                  </h5>
                  <input
                    className="form-control text-base w-28"
                    disabled={true}
                    value={input.converted_value === null ? '' : input.converted_value}
                  />
                  <label className="mx-3 text-xs">
                    {T[input.unit_trans_key]}
                  </label>
                </div>
              ))}
            </div>
            {formula && (
              <div className="mt-10 border-top border-top-gray pt-5">
                <h5 className="text-bold mb-1 flex">{T['Modal.FormulaDetails.Calculation.Caption']}</h5>
                <div className="mb-1 flex">
                  <div
                    style={{ backgroundColor: '#e9ecef', padding: '4px 12px 30px 12px' }}
                    className="form-control w-100 mt-3"
                  >
                    <p
                      className="whitespace-pre-line text-left"
                      style={lang === 'Heb' ? { direction: 'initial' } : {}}
                    >
                      {formula.calculation}
                    </p>
                  </div>
                </div>
                <div className="d-flex items-center mt-3">
                  <p className="text-grey flex">{T['Modal.FormulaDetails.SourceReference.Caption']}</p>
                  <h5 className="text-grey mx-2">
                    {!reference.name && !reference.full_name ? '-' :
                      reference.url ?
                        <a
                          className="text-primary leading-none"
                          href={reference.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-tip={reference.full_name}
                        >
                          {reference.name}
                        </a>
                        :
                        <span
                          className="cursor-pointer"
                          data-tip={reference.full_name}
                        >
                          {reference.name}
                        </span>
                    }
                  </h5>
                </div>
              </div>
            )}
            <div className="border-top pt-5 border-top-gray mt-14">
              <div className="mb-1 flex">
                <h5 className="text-bold">{T['Modal.FormulaDetails.OutputField.Caption']}</h5>
              </div>
            </div>
            <div className="mt-5 lg:overflow-hidden overflow-x-scroll">
              {output_fields?.map((input, idx) => (
                <div className="flex items-center mb-1" key={idx}>
                  <h5
                    className="w-52 cursor-pointer flex"
                    style={{minWidth: '13rem'}}
                    data-tip={T[input.figure_description_trans_key]}
                  >
                    {T[input.figure_field_trans_key]}
                  </h5>
                  <input
                    className="form-control text-base w-28"
                    disabled={true}
                    value={input.converted_value === null ? '' : input.converted_value}
                  />
                  <label className="mx-3 text-xs">
                    {T[input.unit_trans_key]}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    </Modal>
  )
}

export default React.memo(SourceFormulaModal)