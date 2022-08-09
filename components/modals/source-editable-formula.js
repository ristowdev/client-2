import React from 'react'
import Modal from '@components/modals/index'
import { useLang } from '@hooks/useLang'
import { useRequest } from '@services/api'
import ContainerLoader from '@components/loader/container'
import ReactTooltip from 'react-tooltip'
import { Field, Form } from 'react-final-form'
import { showErrorMessage, validationOnBlur } from '@utils/helpers'
import { visitService } from '@services/index'
import { toast } from 'react-toastify'

function SourceEditableFormulaModal(
  {
    token,
    clinicId,
    visitId,
    showModal,
    setShowModal,
    setModalType,
    selectedSourceKey,
    setSelectedSourceKey,
    loading,
    setLoading,
    revalidateData
  }
) {
  const { translations, lang } = useLang()
  const T = translations

  const {
    data,
    revalidate
  } = useRequest(selectedSourceKey !== "" && `/prod/visitapi/GetFormulaDetails?clinic_id=${clinicId}&visit_id=${visitId}&source_key=${selectedSourceKey}`, { token })

  const { formula, input_fields, output_fields, reference, segment, source, preview_fields } = data || {}


  const onSubmit = async (values) => {
    if (values.figure_field_value === undefined) {
      delete values.figure_field_value
    }
    setLoading(true)

    values.token = token
    values.clinic_id = clinicId
    values.visit_id = visitId
    values.source_key = selectedSourceKey

    try {
      await visitService.editFormulaFigureValue(values)
      await revalidateData()
      revalidate()
    } catch (e) {
      return toast.error(T[showErrorMessage(e.message)])
    }

    setLoading(false)
  }

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
          <div className="mt-5 w-full lg:overflow-hidden overflow-x-scroll">
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
            <div className="mt-5 w-full lg:overflow-hidden overflow-x-scroll">
              {input_fields.map((inputField, idx) => (
                <Form
                  key={idx}
                  onSubmit={onSubmit}
                  render={({ handleSubmit, submitting, pristine }) => (
                    <form onSubmit={handleSubmit} className="form-body pt-0 pb-0">
                      <div className="flex items-center mb-1">
                        <Field
                          name="figure_field_key"
                          defaultValue={inputField.figure_key}
                        >
                          {({ input, meta }) => (
                            <div className="form-group mb-3">
                              <label
                                {...input}
                                className="w-52 cursor-pointer"
                                data-tip={T[inputField.figure_description_trans_key]}
                              >
                                {T[inputField.figure_field_trans_key]}
                              </label>
                            </div>
                          )}
                        </Field>
                        <Field
                          name="figure_field_value"
                          defaultValue={inputField.converted_value}
                        >
                          {({ input, meta }) => (
                            <div className="form-group mb-1 flex items-center">
                              <input
                                {...input}
                                disabled={!inputField.is_editable || loading}
                                onBlur={(e) => validationOnBlur(e, inputField.converted_value, input, handleSubmit, true)}
                                className="form-control text-sm w-28"
                              />
                              <label
                                className="text-grey opacity-60 text-xs mx-4 w-24">{T[inputField.unit_trans_key]}</label>
                            </div>
                          )}
                        </Field>
                      </div>
                    </form>
                  )}
                />
              ))}
            </div>
            {formula.calculation && (
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
                  <p className="text-grey">{T['Modal.FormulaDetails.SourceReference.Caption']}</p>
                  <h5 className="text-grey mx-2">
                    {!reference?.name && !reference?.full_name ? '-' :
                      reference?.url ?
                        <a
                          className="text-primary leading-none"
                          href={reference?.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-tip={reference?.full_name}
                        >
                          {reference?.name}
                        </a>
                        :
                        <span
                          className="cursor-pointer"
                          data-tip={reference?.full_name}
                        >
                          {reference?.name}
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
            <div className="mt-5 w-full lg:overflow-hidden overflow-x-scroll">
              {output_fields?.map((input, idx) => (
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
            {preview_fields && (
              <>
                <div className="border-top border-bottom-gray mt-8 lg:overflow-hidden overflow-x-scroll">
                  <div className="mb-3 flex pt-5">
                    <h5 className="text-bold">{T['Modal.ActivitySliders.QuickCalculations.Caption']}</h5>
                  </div>
                </div>
                <div className="mt-5 lg:overflow-hidden overflow-x-scroll">
                  {preview_fields.map(field => (
                    <div className="flex items-center mb-3">
                      <h5
                        className="w-52 flex cursor-pointer"
                        style={{minWidth: '13rem'}}
                        data-tip={T[field.figure_description_trans_key]}
                      >
                        {T[field.figure_field_trans_key]}
                      </h5>
                      <div className="flex items-center">
                        <input
                          className="form-control text-base w-28"
                          disabled={true}
                          value={field.figure_value}
                        />
                        <label className="mx-3 text-xs">{T[field.unit_trans_key]}</label>
                      </div>
                      <div className="w-5 mx-3" style={{minWidth: '3rem'}}/>
                      <label className="mx-5 text-sm text-grey flex" style={{minWidth: '24rem'}}>
                        {T[field.source_short_trans_key]}
                      </label>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      }
    </Modal>
  )
}

export default React.memo(SourceEditableFormulaModal)
