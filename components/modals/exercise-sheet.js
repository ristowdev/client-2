import React, { useEffect, useState } from 'react'
import Modal from '@components/modals/index'
import { useLang } from '@hooks/useLang'
import { useRequest } from '@services/api'
import { BASE_URL_VISIT } from '@common/constants'
import ContainerLoader from '@components/loader/container'
import { visitService } from '@services/index'
import _ from 'lodash'
import Popover from '@components/popover'
import { toast } from 'react-toastify'
import { insert, showErrorMessage } from '@utils/helpers'
import InputRange from 'react-input-range-rtl'
import ReactTooltip from 'react-tooltip'

const initialData = {
  group_row_number: '',
  item_row_number: '',
  override_list_key: null,
  activity_key: null,
  category_key: null,
  style_key: null,
  is_available: true,
  intensity_percentage: 50,
  duration_in_minutes: 30,
  times_per_week: 1,
  comment: '',
  styles: []
}

function ExerciseSheetModal(
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
    modalType
  }
) {
  const [exerciseActivities, setExerciseActivities] = useState([])
  const [exerciseItems, setExerciseItems] = useState([])
  const [requesting, setRequesting] = useState(true)
  const [patientWeight, setPatientWeight] = useState(null)
  const [revalidate, setRevalidate] = useState(false)
  const [exerciseSheet, setExerciseSheet] = useState({})
  const [dailyMets, setDailyMets] = useState(0)
  const [teaValue, setTeaValue] = useState(0)
  const [listKey, setListKey] = useState()
  const [resetList, setResetList] = useState(false)

  const { translations: T, lang } = useLang()

  const { data: exerciseList = [] } = useRequest(`${BASE_URL_VISIT}/GetExerciseLists?clinic_id=${clinicId}&visit_id=${visitId}`)

  //adding styles array in exercise item object
  useEffect(() => {
    if (!_.isEmpty(exerciseActivities) && _.isEmpty(exerciseItems)) {
      (exerciseSheet.rows || []).map((item, idx) => {
        item.id = idx
        let hasOverrideListKey = false
        exerciseActivities.map(activity => {
          if (item.override_list_key) {
            hasOverrideListKey = true
            if (activity.list_key === item.override_list_key) {
              activity.categories.map((category) => {
                if (item.category_key === category.category_key) {
                  category.activities.map(catActivity => {
                    if (catActivity.activity_key === item.activity_key) {
                      item.is_available = catActivity.is_available
                      item.styles = catActivity.styles
                      item.override_list_key_trans = activity.list_trans_key
                    }
                  })
                }
              })
            }
          }
          if (activity.list_key === listKey && !hasOverrideListKey) {
            activity.categories.map((category) => {
              if (item.category_key === category.category_key) {
                category.activities.map(catActivity => {
                  if (catActivity.activity_key === item.activity_key) {
                    item.is_available = catActivity.is_available
                    item.styles = catActivity.styles
                  }
                })
              }
            })
          }
        })
        setExerciseItems((prevState) => [...prevState, item])
      })
      setRequesting(false)
    }
  }, [exerciseSheet, exerciseActivities, exerciseItems])

  useEffect(() => {
    if (resetList) {
      exerciseItems.map(item => {
        exerciseActivities.map(activity => {
          if (activity.list_key === listKey) {
            activity.categories.map((category) => {
              if (item.category_key === category.category_key) {
                category.activities.map(catActivity => {
                  if (catActivity.activity_key === item.activity_key && !item.override_list_key) {
                    item.styles = catActivity.styles
                  }
                })
              }
            })
          }
        })
      })

      setResetList(false)
    }
  }, [resetList])

  //fetching data
  useEffect(() => {
    async function getData() {
      const data = await visitService.getExerciseActivities()
      const exerciseSheetData = await visitService.getExerciseSheet(clinicId, visitId, token, modalType)
      setExerciseActivities(data)
      setListKey(exerciseSheetData.list.list_key)
      setPatientWeight(exerciseSheetData.weight_in_kg)
      setExerciseSheet(exerciseSheetData)
      setRevalidate(false)
    }

    getData()
  }, [revalidate])

  const handleRowChange = (id, payload) => {
    let items = [...exerciseItems]
    const selectedVersions = [payload]

    items = items.map(el => {
      const found = selectedVersions.find(s => s.id === el.id)
      if (found) {
        el = Object.assign(el, found)
      }
      return el
    })
    setExerciseItems(items)
  }

  const submitOnModalClose = async () => {
    //removing items from array to check equal with whats coming from api
    exerciseItems.map(item => {
      item.duration_in_minutes = Number(item.duration_in_minutes)
      item.times_per_week = Number(item.times_per_week)
      delete item.styles
      delete item.category_key
      delete item.id
      delete item.is_available
      delete item.override_list_key_trans
    })

    const values = {
      clinic_id: clinicId,
      token,
      visit_id: visitId,
      list_key: listKey,
      exercise_items: exerciseItems.length > 0 ? JSON.stringify(exerciseItems) : null
    }


    //fetching api for reason to check the data equality with exercise items
    const exerciseSheetData = await visitService.getExerciseSheet(clinicId, visitId, token, modalType)
    if (exerciseSheet.rows) {
      exerciseSheetData.rows.map(item => {
        delete item.category_key
        delete item.styles
      })
    }

    if (!_.isEqual(exerciseItems, exerciseSheetData.rows) || exerciseSheetData.list.list_key !== listKey) {
      setLoading(true)
      try {
        await visitService.editExerciseSheet(values, modalType)
        await revalidateData()
      } catch (e) {
        return toast.error(T[showErrorMessage(e.message)])
      } finally {
        setLoading(false)
      }
    }
  }

  const assignActivity = () => {
    const id = exerciseItems.length
    const item = Object.assign({ id }, initialData)
    item.group_row_number = id + 1
    item.item_row_number = 1
    setExerciseItems((prevState) => [...prevState, item])
  }

  const assignAlternativeActivity = (id, rowNumber, groupNumber) => {
    const data = exerciseItems
    const itemId = exerciseItems.length + 1
    const item = Object.assign({ id: itemId }, initialData)
    item.group_row_number = groupNumber
    item.item_row_number = rowNumber + 1
    const result = insert(data, id + 1, item)
    setExerciseItems(result)
  }

  const removeExerciseItem = async (id) => {
    const array = exerciseItems
    array.splice(id, 1)
    setExerciseItems(array)
    if (array.length === 0) {
      setShowModal(false)
      setSelectedSourceKey('')
      setModalType('')
      await submitOnModalClose()
    } else {
      setRevalidate(true)
    }
  }

  const renderExerciseItemIcon = (item) => {
    if (!item.is_available) {
      return (
        <div className="cursor-pointer" data-tip={T['Modal.ExerciseSheet.UnavailableItem.Tooltip']}>
          <i className="fas fa-exclamation-triangle"/>
        </div>
      )
    }
    if (item.override_list_key) {
      let criticalItem = true
      exerciseList.map(activity => {
        if (activity.list_key === item.override_list_key) {
          criticalItem = false
        }
      })
      if (criticalItem) {
        return (
          <div className="cursor-pointer" data-tip={`${T['Modal.ExerciseSheet.UnavailableList.Tooltip']}`}>
            <i className="fas fa-info-circle text-red-500"/>
          </div>
        )
      } else {
        return (
          <Popover
            trigger="click"
            tooltip={
              <p
                className="cursor-pointer"
                onClick={() => {
                  const payload = {
                    ...item,
                    override_list_key: null,
                  }
                  handleRowChange(0, payload)
                }}
              >
                {T['Modal.ExerciseSheet.ResetSourceAction.Caption']}
              </p>
            }
          >
            <div
              className="cursor-pointer"
              data-tip={`${T['Modal.ExerciseSheet.SourceChanged.Tooltip']} ${T[item.override_list_key_trans]}`}
            >
              <i className="fas fa-info-circle"/>
            </div>
          </Popover>
        )
      }
    }

    ReactTooltip.rebuild()
  }

  useEffect(() => {
    let rowMets = 0
    exerciseItems.map(item => {
      const intensityPercentage = item.intensity_percentage || 0
      const duration = item.duration_in_minutes || 0
      const timesPerWeek = item.times_per_week
      const minMets = item.styles?.filter(style => style.style_key === item.style_key)[0]?.min_mets || 0
      const maxMets = item.styles?.filter(style => style.style_key === item.style_key)[0]?.max_mets || 0
      rowMets += (minMets + (maxMets - minMets) * intensityPercentage / 100) * duration * timesPerWeek
    })
    const result = rowMets / 7
    setDailyMets(result.toFixed(1))

    if (patientWeight) {
      setTeaValue(Math.round(dailyMets * 3.5 * patientWeight / 200))
    }

  }, [exerciseItems, exerciseItems.length, patientWeight, dailyMets, resetList])

  return (
    <Modal
      modalIsOpen={showModal}
      onCloseModal={async () => {
        setShowModal(false)
        setSelectedSourceKey('')
        setModalType('')
        await submitOnModalClose()
      }}
      classNames={{ modal: 'modal-3xl' }}
      header={T[modalType === 'ExerciseSheet' ? 'Db.Source.ExerciseSheet.Short' : 'Db.Source.ExercisePlan.Short']}
    >
      {requesting ? <ContainerLoader/> : (
        <>
          <div className="flex items-center mt-5 xl:w-7/12 w-full">
            <p className="xl:text-base text-sm w-44">
              {T['Modal.ExerciseSheet.ExerciseList.Caption']}
            </p>
            <select
              className="form-control mx-5"
              defaultValue={listKey}
              onChange={(e) => {
                setListKey(e.target.value)
                setResetList(true)
                ReactTooltip.rebuild()
              }}
            >
              {exerciseList.map((item, idx) => (
                <option
                  key={idx}
                  value={item.list_key}
                >
                  {T[item.list_trans_key]}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-3xl-overflow px-3">
            {!_.isEmpty(exerciseItems) && (
              <div className="flex items-center space-x-5 mt-10" style={{ minWidth: '720px' }}>
                <div className="xl:w-72 xl:min-w-auto min-w-44">
                  <p className="text-center text-sm">
                    {T['Modal.ExerciseSheet.ActivityHeader.Caption']}
                  </p>
                </div>
                <div className="xl:w-36 xl:min-w-auto min-w-44">
                  <p className="text-center text-sm">{T['Modal.ExerciseSheet.StyleHeader.Caption']}</p>
                </div>
                <div className="xl:w-56 xl:min-w-auto min-w-44">
                  <p className="text-center text-sm">{T['Modal.ExerciseSheet.IntensityHeader.Caption']}</p>
                </div>
                <div className="xl:w-20 xl:min-w-auto min-w-44">
                  <p
                    className="text-center text-sm cursor-pointer"
                    data-tip={T['Modal.ExerciseSheet.DurationHeader.Tooltip']}
                  >
                    {T['Modal.ExerciseSheet.DurationHeader.Caption']}
                  </p>
                </div>
                <div className="xl:w-20 xl:min-w-auto min-w-44">
                  <p
                    className="text-center text-sm cursor-pointer"
                    data-tip={T['Modal.ExerciseSheet.CaloriesHeader.Tooltip']}
                  >
                    {T['Modal.ExerciseSheet.CaloriesHeader.Caption']}
                  </p>
                </div>
                <div className="xl:w-24 xl:min-w-auto min-w-44">
                  <p className="text-center text-sm">{T['Modal.ExerciseSheet.Times/WeekHeader.Caption']}</p>
                </div>
                <div className="xl:w-56 xl:min-w-auto min-w-44">
                  <p className="text-center text-sm">{T['Modal.ExerciseSheet.CommentHeader.Caption']}</p>
                </div>
              </div>
            )}
            {exerciseItems.map((item, idx) => {
              const intensityPercentage = item.intensity_percentage || 0
              const duration = item.duration_in_minutes || 0
              const minMets = item.styles?.filter(style => style.style_key === item.style_key)[0]?.min_mets
              const maxMets = item.styles?.filter(style => style.style_key === item.style_key)[0]?.max_mets
              const rowMets = (minMets + (maxMets - minMets) * intensityPercentage / 100) * duration
              const labelMetsValue = (minMets + (maxMets + minMets) * intensityPercentage / 100)
              let calories = ""

              if (rowMets !== 0 && patientWeight && minMets && maxMets) {
                calories = Math.round(rowMets * 3.5 * patientWeight / 200)
              }

              let selectedActivity = {}
              let selectedStyle = (item.styles || []).filter(item => item.style_key === exerciseItems[idx].style_key)[0]

              const groupOptions = []

              if (!_.isEmpty(exerciseActivities)) {
                exerciseActivities.map(exerciseActivity => {
                  if (exerciseActivity.list_key === (item.override_list_key || listKey)) {
                    return exerciseActivity.categories.map(category => {
                      const activities = category.activities

                      return groupOptions.push({
                        label: T[category.category_trans_key],
                        category_key: category.category_key,
                        options: activities
                      })
                    })
                  }
                })
              }

              groupOptions.map(group => {
                return group.options.map(option => {
                  if (option.activity_key === exerciseItems[idx].activity_key) {
                    selectedActivity = option
                  }
                })
              })
              return (
                <div
                  className="flex items-center space-x-5 mb-3"
                  key={idx}
                  style={{ minWidth: '720px' }}
                >
                  {item.item_row_number !== 1 && (
                    <p
                      className={`${lang === 'Heb' ? 'ml-5' : 'mr-5'} text-uppercase`}
                    >
                      {T['Modal.ExerciseSheet.Or.Label']}
                    </p>
                  )}
                  <div className={`xl:w-72 xl:min-w-auto min-w-44 ${lang === 'Heb' && 'ml-4'}`}>
                    <select
                      value={selectedActivity.activity_key || ""}
                      className="form-control h-10"
                      id={`activity-select-${idx}`}
                      onChange={(e) => {
                        const activitySelectId = document.getElementById(`activity-select-${idx}`)
                        const optionStringifyData = activitySelectId.selectedOptions[0].getAttribute('data-activity')
                        const itemStringifyData = activitySelectId.selectedOptions[0].getAttribute('data-type')
                        const optionData = JSON.parse(optionStringifyData)
                        const optionType = JSON.parse(itemStringifyData)
                        const payload = {
                          ...item,
                          styles: optionData.styles,
                          activity_key: e.target.value,
                          category_key: optionType.category_key,
                          style_key: optionData.styles[0].style_key,
                          is_available: optionData.is_available,
                        }
                        handleRowChange(0, payload)
                        ReactTooltip.rebuild()
                      }}
                    >
                      <option disabled/>
                      {groupOptions.map((item, idx) => (
                        <optgroup label={item.label} key={idx}>
                          {item.options.map(option => (
                            <option
                              key={option.activity_key}
                              value={option.activity_key}
                              data-activity={JSON.stringify(option)}
                              data-type={JSON.stringify(item)}
                              style={{ color: `${option.is_available ? '#666666' : 'red'}` }}
                            >
                              {T[option.activity_trans_key]} {!option.is_available && '*'}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <div className="xl:w-36 xl:min-w-auto min-w-44">
                    <select
                      className="form-control h-10"
                      defaultValue={selectedStyle?.style_key}
                      onChange={(e) => {
                        const payload = {
                          ...item,
                          style_key: e.target.value
                        }
                        handleRowChange(0, payload)
                      }}
                    >
                      {exerciseItems[idx].styles.map((option, idx) => (
                        <option
                          key={idx}
                          value={option.style_key}
                        >
                          {T[option.style_trans_key]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="xl:w-56 flex items-center space-x-3 xl:min-w-auto min-w-44">
                    <InputRange
                      minValue={0}
                      maxValue={100}
                      step={5}
                      value={item.intensity_percentage}
                      formatLabel={value => `${value} % ${labelMetsValue ? ` - ${labelMetsValue.toFixed(1)} METs` : ''}`}
                      direction={lang === "Heb" ? 'rtl' : 'ltr'}
                      onChange={(e) => {
                        const payload = {
                          ...item,
                          intensity_percentage: e
                        }
                        handleRowChange(0, payload)
                      }}
                    />
                    <Popover
                      trigger={!_.isEmpty(item.styles.filter(style => style.style_key === item.style_key)[0]?.samples) ? 'click' : ''}
                      tooltip={
                        <div className="p-2 font-medium">
                          {(item.styles.filter(style => style.style_key === item.style_key)[0]?.samples || []).map(sample => (
                            <p
                              className="cursor-pointer flex"
                              onClick={() => {
                                const payload = {
                                  ...item,
                                  intensity_percentage: sample.intensity_percentage,
                                  comment: T[sample.item_trans_key]
                                }
                                handleRowChange(0, payload)
                                ReactTooltip.rebuild()
                              }}
                            >
                              {sample?.mets.toFixed(1)} - {T[sample.item_trans_key]}
                            </p>
                          ))}
                        </div>
                      }
                    >
                      <button
                        className={`bg-light-gray h-8 rounded w-10 flex items-center justify-center ${!_.isEmpty(selectedStyle?.samples) ? '' : 'opacity-50 cursor-not-allowed'} ${lang === 'Heb' ? 'ml-0 mr-3' : ''}`}
                        data-tip={T['Modal.ExerciseSheet.UseSampleAction.Tooltip']}
                      >
                        <i className="fas fa-chevron-down text-xs"/>
                      </button>
                    </Popover>
                  </div>
                  <div className="xl:w-20 xl:min-w-auto min-w-44 flex items-center">
                    <input
                      className="form-control h-10"
                      type="number"
                      value={exerciseItems[idx].duration_in_minutes}
                      min={0}
                      onBlur={(e) => {
                        if (Number(e.target.value) < 0) {
                          const payload = {
                            ...item,
                            duration_in_minutes: 0
                          }
                          setTimeout(() => {
                            handleRowChange(0, payload)
                          }, 50)
                        }
                      }}
                      onChange={(e) => {
                        const payload = {
                          ...item,
                          duration_in_minutes: e.target.value
                        }
                        handleRowChange(0, payload)
                      }}
                    />
                    <ReactTooltip place="top"/>
                  </div>
                  <div
                    className="xl:w-20  xl:min-w-auto min-w-44 flex items-center space-x-3"
                    data-tip={rowMets ? `${rowMets.toFixed(1)} METs` : ''}
                  >

                    <input
                      className="form-control h-10"
                      type="text"
                      value={calories}
                      disabled={true}
                    />
                  </div>
                  <div className="xl:w-24 xl:min-w-auto min-w-44 flex items-center">
                    <select
                      className="form-control h-10"
                      value={exerciseItems[idx].times_per_week}
                      onChange={(e) => {
                        const payload = {
                          ...item,
                          times_per_week: e.target.value
                        }
                        handleRowChange(0, payload)
                      }}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                    </select>
                  </div>
                  <div className="xl:w-56 xl:min-w-auto min-w-44 flex items-center space-x-3">
                    <input
                      className="form-control h-10"
                      value={exerciseItems[idx].comment}
                      onChange={(e) => {
                        const payload = {
                          ...item,
                          comment: e.target.value
                        }
                        handleRowChange(0, payload)
                      }}
                    />
                  </div>
                  <Popover
                    trigger="click"
                    tooltip={
                      <div className="p-2 font-medium">
                        <p
                          className="cursor-pointer flex"
                          onClick={() => removeExerciseItem(idx)}
                        >
                          {T['Modal.ExerciseSheet.RemoveAction.Caption']}
                        </p>
                        <p
                          className="cursor-pointer flex"
                          onClick={() => assignAlternativeActivity(idx, item.item_row_number, item.group_row_number)}
                        >
                          {T['Modal.ExerciseSheet.AlternativeAction.Caption']}
                        </p>
                        <select
                          className="source-select relative -left-1 w-64 border-0 p-0"
                          defaultValue={exerciseItems[idx].override_list_key || ""}
                          onChange={(e) => {
                            const payload = {
                              ...item,
                              override_list_key: e.target.value
                            }
                            exerciseActivities.map(activity => {
                              if (activity.list_key === e.target.value) {
                                activity.categories.map((category) => {
                                  if (item.category_key === category.category_key) {
                                    category.activities.map(catActivity => {
                                      if (catActivity.activity_key === item.activity_key) {
                                        payload.is_available = catActivity.is_available
                                        payload.styles = catActivity.styles
                                        payload.override_list_key_trans = activity.list_trans_key
                                      }
                                    })
                                  }
                                })
                              }
                            })
                            handleRowChange(0, payload)
                            ReactTooltip.rebuild()
                          }}
                        >
                          <option value="" disabled>
                            {T['Modal.ExerciseSheet.ChangeSourceAction.Caption']}
                          </option>
                          {exerciseList.map((item, idx) => (
                            <option
                              key={idx}
                              value={item.list_key}
                            >
                              {T[item.list_trans_key]}
                            </option>
                          ))}
                        </select>
                      </div>
                    }
                  >
                    <button className="bg-light-gray h-10 rounded w-10 flex items-center justify-center">
                      <i className="fas fa-ellipsis-h text-xs"/>
                    </button>
                  </Popover>
                  <div className="w-5">
                    {renderExerciseItemIcon(item)}
                  </div>
                </div>
              )
            })}
          </div>
          <button
            className="mt-10 rounded bg-primary w-12 h-8 flex items-center justify-center mx-3"
            onClick={assignActivity}
            data-tip={T['Modal.ExerciseSheet.AddAction.Tooltip']}
          >
            <i className="fas fa-plus"/>
          </button>
          <div className="border-top pt-5 border-top-gray mt-5">
            <div className="mb-1 flex">
              <h5 className="text-bold">
                {T['Modal.InVisitDetails.OutputField.Caption']}
              </h5>
            </div>
          </div>
          <p className="mt-5">
            <div className="flex items-center mb-3 mt-5">
              <h5 className="w-64 cursor-pointer flex">
                {T[modalType === 'ExerciseSheet' ? 'Db.FigureField.TotalMets.Name' : 'Db.FigureField.PlannedTotalMets.Name']}
              </h5>
              <input
                className="form-control text-base w-28"
                disabled="true"
                value={dailyMets !== 'NaN' ? dailyMets : 0}
              />
            </div>
          </p>
          <div className="border-top pt-5 border-top-gray mt-5">
            <div className="mb-1 flex">
              <h5 className="text-bold">
                {T['Modal.InVisitDetails.QuickCalculations.Caption']}
              </h5>
            </div>
          </div>
          <p className="mt-5">
            <div className="flex items-center mb-1 mt-5">
              <h5 className="w-64 cursor-pointer flex">
                {T[modalType === 'ExerciseSheet' ? 'Db.FigureField.Tea.Name' : 'Db.FigureField.TargetTea.Name']}
              </h5>
              <div className="flex items-center">
                <input
                  className="form-control text-base w-28"
                  disabled="true"
                  value={exerciseSheet.target_tea_in_kcal || 0}
                />
                <label className="mx-3 text-xs w-5" style={{ minWidth: '3rem' }}>
                  {T['Db.Unit.Kcal']}
                </label>
              </div>
            </div>
          </p>
          {modalType === 'ExercisePlan' && (
            <p>
              <div className="flex items-center">
                <h5 className="w-64 cursor-pointer flex">
                  {T['Db.FigureField.PlannedTea.Name']}
                </h5>
                <div className="flex items-center">
                  <input
                    className="form-control text-base w-28"
                    disabled="true"
                    value={teaValue || 0}
                  />
                  <label className="mx-3 text-xs w-5" style={{ minWidth: '3rem' }}>
                    {T['Db.Unit.Kcal']}
                  </label>
                </div>
              </div>
            </p>
          )}
        </>
      )}
    </Modal>
  )
}

export default React.memo(ExerciseSheetModal)
