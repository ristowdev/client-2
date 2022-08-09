import React from 'react'
import Modal from '@components/modals/index'
import { useLang } from '@hooks/useLang'
import { useRequest } from '@services/api'
import ContainerLoader from '@components/loader/container'
import ReactTooltip from 'react-tooltip'
import Chart from '@components/chart'
import qs from 'querystring'

function SourceRankerModal(
  {
    token,
    clinicId,
    visitId,
    showModal,
    setShowModal,
    setModalType,
    selectedSourceKey,
    setSelectedSourceKey
  }
) {
  const { translations } = useLang()
  const T = translations

  const {
    data
  } = useRequest(selectedSourceKey !== "" && `/prod/visitapi/GetRankerDetails?clinic_id=${clinicId}&visit_id=${visitId}&source_key=${selectedSourceKey}`, { token })

  const { ranks = [], input_fields, output_fields, reference, segment, source, chart } = data || {}

  const generateChartImage = () => {
    const query = qs.stringify({
      rank_colors: chart.colors_preview,
      rank_levels: chart.levels_preview,
      measured: data?.input_fields[0].converted_value,
      target: data?.output_fields[0].converted_value,
      height: '100',
      width: '600',
      show_axis: true,
    })

    return `https://clinicchartapi.azurewebsites.net/rankingchart/singlecategory?${query}`
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
        <div className="mt-10">
          <ReactTooltip place="right" />
          <div className="border-bottom border-bottom-gray">
            <div className="mb-3 flex">
              <h5 className="text-bold w-52 flex">{T['Modal.FormulaDetails.SegmentName.Caption']}</h5>
              <h5 className="w-28">{T[segment.segment_trans_key]}</h5>
            </div>
          </div>
          <div className="mt-5">
            {segment.gender_trans_key && (
              <div className="mb-3 flex items-center">
                <h5 className="w-52 flex">{T['Modal.FormulaDetails.Gender.Caption']}</h5>
                <input
                  className="form-control text-base w-28"
                  disabled={true}
                  value={T[segment.gender_trans_key]}
                />
              </div>
            )}
            {segment.max_age && segment.min_age && (
              <div className="mb-3 flex items-center">
                <h5 className="w-52 flex">{T['Modal.FormulaDetails.Age.Caption']}</h5>
                <input
                  className="form-control text-base w-28"
                  disabled={true}
                  value={`${segment.min_age} - ${segment.max_age}`}
                />
              </div>
            )}
            {!segment.max_age && segment.min_age && (
              <div className="mb-3 flex items-center">
                <h5 className="w-52 flex">{T['Modal.FormulaDetails.Age.Caption']}</h5>
                <input
                  className="form-control text-base w-28"
                  disabled={true}
                  value={`${segment.min_age}+`}
                />
              </div>
            )}
            {segment.max_age && !segment.min_age && (
              <div className="mb-3 flex items-center">
                <h5 className="w-52 flex">{T['Modal.FormulaDetails.Age.Caption']}</h5>
                <input
                  className="form-control text-base w-28"
                  disabled={true}
                  value={`-${segment.max_age}`}
                />
              </div>
            )}
            <div className="border-bottom border-bottom-gray mt-10">
              <div className="mb-3 flex">
                <h5 className="text-bold">{T['Modal.FormulaDetails.InputFields.Caption']}</h5>
              </div>
            </div>
            <div className="mt-5">
              {input_fields?.map((input, idx) => (
                <div className="flex items-center mb-3" key={idx}>
                  <h5
                    className="w-52 flex cursor-pointer"
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
            <div className="mt-5">
              <img className="w-full" src={generateChartImage()}/>
            </div>
            <div className="my-4">
              {ranks.map(rank => (
                <div className="flex items-center">
                  <div
                    className="h-4 w-4 border border-black rounder-md"
                    style={{ backgroundColor: rank.color_hex }}
                  />
                  <p className="mx-1.5">{T[rank.rank_trans_key]}</p>
                </div>
              ))}
            </div>
            <div className="d-flex items-center mt-4">
              <p className="text-grey">{T['Modal.FormulaDetails.SourceReference.Caption']}</p>
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
            <div className="border-bottom border-bottom-gray mt-12">
              <div className="mb-3 flex">
                <h5 className="text-bold">{T['Modal.FormulaDetails.OutputField.Caption']}</h5>
              </div>
            </div>
            <div className="mt-5">
              {output_fields?.map((input, idx) => (
                <div className="flex items-center mb-3" key={idx}>
                  <h5
                    className="w-52 flex cursor-pointer"
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

export default React.memo(SourceRankerModal)
