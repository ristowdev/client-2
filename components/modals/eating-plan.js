import React, { useEffect, useState } from 'react'
import { useLang } from '@hooks/useLang'
import Modal from '@components/modals/index'
import { useRequest } from '@services/api'
import { BASE_URL_VISIT } from '@common/constants'
import { visitService } from '@services/index'
import { toast } from 'react-toastify'
import { showErrorMessage } from '@utils/helpers'
import ReactTooltip from 'react-tooltip'
import Popover from '@components/popover'
import Loader from 'react-loader-spinner'
import _ from 'lodash'
import { useRouter } from 'next/router'

function EatingPlanModal(
  {
    showModal,
    setShowModal,
    setSelectedSourceKey,
    setModalType,
    clinicId,
    visitId,
    setLoading,
    token,
    revalidateData,
    modalType,
    isPlan,
    modalTitle
  }
) {
  const router = useRouter()
  const { translations: T, lang } = useLang()

  const [rows, setRows] = useState([])
  const [selectedSheetId, setSelectedSheetId] = useState('')

  const {
    data,
    revalidate
  } = useRequest(`${BASE_URL_VISIT}/GetFoodSheets?clinic_id=${clinicId}&visit_id=${visitId}&is_plan=${isPlan}`, {
    revalidateOnFocus: false,
    refreshInterval: 0
  })

  useEffect(() => {
    if(!router.query?.modalType) {
      router.replace(`${router.asPath}&modalType=${isPlan ? 'EatingPlan' : 'EatingLog'}&categoryKey=${isPlan ? 'PlansAndGuidelines' : 'EnergyIndices'}`, `${router.asPath}&modalType=${isPlan ? 'EatingPlan' : 'EatingLog'}&categoryKey=${isPlan ? 'PlansAndGuidelines' : 'EnergyIndices'}`, { shallow: false })
    }
  }, [])

  const { sheets = [], output_fields = [], preview_fields = [] } = data || {}

  const onAddNewRow = async () => {
    try {
      await visitService.createFoodSheet({ clinic_id: clinicId, visit_id: visitId, is_plan: isPlan }, token)
      await revalidate()
    } catch (e) {
      return toast.error(T[showErrorMessage(e.message)])
    }
  }

  const deleteRow = async (id) => {
    try {
      await visitService.deleteFoodSheetRow({ clinic_id: clinicId, visit_id: visitId, food_sheet_id: id }, token)
      await revalidate()
    } catch (e) {
      return toast.error(T[showErrorMessage(e.message)])
    }
  }

  const handleRowChange = async (row) => {
    try {
      await visitService.editFoodSheetRow({
        clinic_id: clinicId,
        visit_id: visitId,
        food_sheet_id: row.id,
        sheet_title: row.title,
        days_per_week: row.days_per_week
      }, token)
      await revalidate()
    } catch (e) {
      return toast.error(T[showErrorMessage(e.message)])
    }
  }

  const handleModalOpen = (id) => {
    setSelectedSheetId(id)
    if (!router.query.foodSheetId) {
      router.push(`/edit-sheet?foodSheetId=${id}&isPlan=${isPlan}&modalType=${isPlan ? 'EatingPlan' : 'EatingLog'}&visitId=${visitId}&categoryKey=${isPlan ? 'PlansAndGuidelines' : 'EnergyIndices'}`)
    }
    // setModalType('EditFoodSheet')
  }

  useEffect(() => {
    if (!_.isEmpty(sheets)) {
      setRows([...sheets])
    }
  }, [sheets])

  return (
    <>
      <Modal
        modalIsOpen={showModal}
        onCloseModal={async () => {
          setShowModal(false)
          setSelectedSourceKey('')
          setModalType('')
          router.replace(`/visit-details?id=${visitId}`, `/visit-details?id=${visitId}`, { shallow: true })
        }}
        classNames={{ modal: 'modal-2xl' }}
        header={modalTitle}
      >
        {_.isEmpty(sheets) && sheets !== null ? (
          <div className="h-64 flex items-center justify-center">
            <Loader type="Oval" color="#B4D5E8" height={100} width={100}/>
          </div>
        ) : (
          <div className="overflow-x-scroll lg:overflow-hidden">
            <div className="flex space-x-5 mt-3">
              <div className="min-w-28 w-28">
                <p className="text-center">
                  {T['Modal.FoodSheet.EditHeader.Caption']}
                </p>
              </div>
              <div className="min-w-80 w-72">
                <p className="text-center">
                  {T['Modal.FoodSheet.TitleHeader.Caption']}
                </p>
              </div>
              <div className="min-w-40 w-40">
                <p className="text-center">
                  {T['Modal.FoodSheet.CaloriesHeader.Caption']}
                </p>
              </div>
              <div className="min-w-40 w-40">
                <p className="text-center">
                  {T['Modal.FoodSheet.DaysPerWeekHeader.Caption']}
                </p>
              </div>
            </div>
            {rows.map((row, idx) => (
              <div className="flex space-x-5 space-y-3" key={row.id}>
                <div className="min-w-28 w-28 flex items-center justify-center">
                  <i
                    className="fas fa-table text-primary cursor-pointer"
                    onClick={() => handleModalOpen(row.id)}
                  />
                </div>
                <div className="min-w-80 w-72">
                  <input
                    className="form-control text-base w-full"
                    value={row.title}
                    placeholder={T['Modal.FoodSheet.TitleField.Watermark']}
                    onChange={(e) => {
                      //deep clone of sheets array
                      const arr = JSON.parse(JSON.stringify(sheets))
                      arr[idx].title = e.target.value

                      setRows(arr)
                    }}
                    onBlur={async (e) => {
                      if (e.target.value !== sheets[idx].title) {
                        row.title = e.target.value
                        await handleRowChange(row)
                      }
                    }}
                  />
                </div>
                <div className="min-w-40 w-40">
                  <input
                    disabled="true"
                    className="form-control text-base w-full"
                    value={row.total_calories}
                  />
                </div>
                <div className="min-w-40 w-40">
                  <select
                    className="form-control text-base w-full"
                    value={row.days_per_week}
                    onChange={(e) => {
                      //deep clone of sheets array
                      const arr = JSON.parse(JSON.stringify(sheets))
                      arr[idx].days_per_week = e.target.value

                      setRows(arr)
                    }}
                    onBlur={async (e) => {
                      if (e.target.value !== sheets[idx].days_per_week) {
                        row.days_per_week = e.target.value
                        await handleRowChange(row)
                      }
                    }}
                  >
                    <option value="0">{T['Modal.FoodSheet.DaysPerWeekEmpty.Caption']}</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                  </select>
                </div>
                <div className="w-10">
                  <Popover
                    trigger="click"
                    tooltip={
                      <div className="p-2 font-medium">
                        <p className="cursor-pointer flex" onClick={() => deleteRow(row.id)}>
                          {T['Modal.FoodSheet.DeleteSheetAction']}
                        </p>
                      </div>
                    }
                  >
                    <button
                      className="bg-light-gray h-10 rounded w-10 flex items-center justify-center"
                    >
                      <i className="fas fa-ellipsis-h text-xs"/>
                    </button>
                    <ReactTooltip place="top"/>
                  </Popover>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="my-10 mx-5">
          <button
            className="mt-10 rounded bg-primary w-12 h-8 flex items-center justify-center mx-3"
            onClick={onAddNewRow}
            data-tip={T['Modal.ExerciseSheet.AddAction.Tooltip']}
          >
            <i className="fas fa-plus"/>
          </button>
        </div>
        {(output_fields || []).length > 0 && (
          <div className="border-top pt-5 border-top-gray mt-5">
            <div className="mb-1 flex">
              <h5 className="text-bold">
                {T['Modal.InVisitDetails.OutputField.Caption']}
              </h5>
            </div>
          </div>
        )}
        <p className="mt-5">
          {(output_fields || []).map(item => (
            <div className="flex items-center mb-3 mt-5" key={item.figure_key}>
              <h5 className="w-64 cursor-pointer flex" data-tip={T[item.figure_description_trans_key]}>
                {T[item.figure_field_trans_key]}
              </h5>
              <input
                className="form-control text-base w-28"
                disabled="true"
                value={item.figure_value}
              />
              <label className="mx-3 text-xs w-5" style={{ minWidth: '3rem' }}>
                {T[item.unit_trans_key]}
              </label>
            </div>
          ))}
        </p>
        {(preview_fields || []).length > 0 && (
          <div className="border-top pt-5 border-top-gray mt-5">
            <div className="mb-1 flex">
              <h5 className="text-bold">
                {T['Modal.InVisitDetails.QuickCalculations.Caption']}
              </h5>
            </div>
          </div>
        )}
        <p className="mt-5">
          {(preview_fields || []).map(item => (
            <div className="flex items-center mb-3 mt-5" key={item.figure_key}>
              <h5 className="w-64 cursor-pointer flex" data-tip={T[item.figure_description_trans_key]}>
                {T[item.figure_field_trans_key]}
              </h5>
              <input
                className="form-control text-base w-28"
                disabled="true"
                value={item.figure_value}
              />
              <label className="mx-3 text-xs w-5" style={{ minWidth: '3rem' }}>
                {T[item.unit_trans_key]}
              </label>
            </div>
          ))}
        </p>
      </Modal>
    </>
  )
}

export default React.memo(EatingPlanModal)
