import React, { useMemo, useState } from 'react'
import { useLang } from '@hooks/useLang'
import Modal from '@components/modals/index'
import { useRouter } from 'next/router'
import { useRequest } from '@services/api'
import { BASE_URL_VISIT } from '@common/constants'
import { components } from 'react-select'
import AsyncSelect from 'react-select/async'
import debounce from 'debounce-async'
import { visitService } from '@services/index'
import qs from 'querystring'
import ReactTooltip from 'react-tooltip'
import Popover from '@components/popover'
import parse from 'html-react-parser'

function EditFoodSheetModal(
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
  const router = useRouter()
  const { foodSheetId, isPlan } = router.query
  const { translations: T, lang } = useLang()

  const [value, setValue] = useState()
  const [search, setSearch] = useState('')
  const [lastOptions, setLastOptions] = useState([])

  const onChange = async (e, meal_key) => {
    setValue(e)
    const data = {
      clinic_id: clinicId,
      visit_id: visitId,
      food_sheet_id: foodSheetId,
      food_item_id: e.food_item_id,
      food_unit_id: e.id,
      meal_key
    }

    await visitService.addFoodSheetRow(data, token)
    await revalidate()
    setValue(null)
  }

  const deleteRow = async (id) => {
    const data = {
      clinic_id: clinicId,
      visit_id: visitId,
      food_sheet_id: foodSheetId,
      food_sheet_row_id: id,
      token
    }

    await visitService.removeFoodSheetRow(data, token)
    await revalidate()
  }

  const loadOptions = useMemo(() => {
    return debounce(async (inputValue) => {
      const query = qs.stringify({
        clinic_id: clinicId,
        search_text: inputValue,
      })
      const data = await visitService.searchFoodItems(query, token)
      const options = []

      data.map(item => {
        options.push({
          label: parse(`<div class="d-flex justify-content-between w-100"><div>${item.name} </div><div >${item.calories}</div></div>`),
          options: item.units
        })
      })
      setLastOptions(options)

      return options
    }, 100)
  }, [lastOptions])

  const {
    data,
    revalidate
  } = useRequest(foodSheetId && `${BASE_URL_VISIT}/GetFoodSheetDetails?clinic_id=${clinicId}&visit_id=${visitId}&food_sheet_id=${foodSheetId}`, {
    revalidateOnFocus: false,
    refreshInterval: 0
  })

  const { food_sheet = [], totals = [] } = data || {}

  const handleHeaderClick = className => {
    //the 5th element in array is ID of the clicked select - example: react-select-autocomplete-select-group-0-heading

    const id = className.split('-')[5]
    const testing = document.getElementsByClassName("group-heading-wrapper")[id];
    const items = testing.nextSibling

    const array = Array.prototype.slice.call(items.children)
    array.map(item => {
      if (window.getComputedStyle(item).display === 'none') {
        item.style.display = 'block'
      } else {
        item.style.display = 'none'
      }
    })
  }

  const CustomGroupHeading = props => {
    return (
      <div
        className="group-heading-wrapper"
        onClick={() => handleHeaderClick(props.id)}
      >
        <components.GroupHeading {...props} />
      </div>
    )
  }

  const renderBorderBasedOnLanguage = () => {
    return lang === 'Heb' ? 'border-l' : 'border-r'
  }

  return (
    <Modal
      modalIsOpen={showModal}
      onCloseModal={async () => {
        router.replace(`${router.pathname}?id=${router.query.id}&categoryKey=${router.query.categoryKey}`, undefined, { shallow: true })
        setShowModal(false)
        setSelectedSourceKey('')
      }}
      classNames={{ modal: 'modal-2xl' }}
      header={T['Modal.FoodSheet.EditSheet.Title']}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 text-xs">
        <table className="border border-black">
          <thead>
          <tr>
            <th
              className={`p-1 bg-cyan-light-blue text-black ${renderBorderBasedOnLanguage()} border-b border-black font-medium text-center`}>
              {T['Modal.FoodSheet.NutrientHeader.Caption']}
            </th>
            <th className="p-1 bg-cyan-light-blue text-black border-b border-black font-medium text-center">
              {T['Modal.FoodSheet.AmountHeader.Caption']}
            </th>
          </tr>
          </thead>
          <tbody>
          {totals.map(item => (
            <tr key={item.nutrient_key} className="border-black">
              <th className={`font-medium border-b ${renderBorderBasedOnLanguage()} border-black`}>
                {T[item.nutrient_trans_key]}
              </th>
              <th className="font-medium border-b border-black">
                {item.nutrient_amount} {T[item.unit_trans_key]}
              </th>
            </tr>
          ))}
          </tbody>
        </table>
        <table className="border border-black col-span-3">
          <thead>
          <tr>
            <th
              className={`p-1 bg-cyan-light-blue text-black ${renderBorderBasedOnLanguage()} border-b border-black font-medium`}>
              {T['Modal.FoodSheet.MealHeader.Caption']}
            </th>
            <th className="p-1 bg-cyan-light-blue text-black border-b border-black font-medium">
              {T['Modal.FoodSheet.FoodItemsHeader.Caption']}
            </th>
          </tr>
          </thead>
          <tbody>
          {food_sheet.map(item => (
            <tr key={item.meal_key} className="border-black">
              <td
                className={`font-medium px-1.5 py-2 border-b text-center ${renderBorderBasedOnLanguage()} border-black font-bold align-top	`}
                style={{ width: '20%' }}
              >
                {T[item.meal_trans_key]} <br/>
                {item.total_calories && (
                  <span className="font-normal">
                    {item.total_calories} {T['Db.Unit.Kcal']}
                  </span>
                )}
              </td>
              <td
                className="font-medium px-1.5 py-2 border-b border-black align-top"
                style={{ width: '80%' }}
              >
                <div className={(item.sheet_rows || []).length > 0 ? 'mb-5' : ''}>
                  {(item.sheet_rows || []).map(row => (
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-black text-xs">
                        {row.amount} {row.food_unit_name} - {' '}
                        <span className="font-bold">{row.food_item_name}</span>{' '}
                        <span className="opacity-60">({row.calories} {T['Db.Unit.Kcal']})</span>
                      </p>
                      <Popover
                        trigger="click"
                        tooltip={
                          <div className="p-2 font-medium">
                            <p className="cursor-pointer flex" onClick={() => deleteRow(row.id)}>
                              {T['Modal.FoodSheet.DeleteAction.Caption']}
                            </p>
                          </div>
                        }
                      >
                        <i className="fas fa-ellipsis-h cursor-pointer"/>
                        <ReactTooltip place="top"/>
                      </Popover>
                    </div>
                  ))}
                </div>
                <div className="async-select">
                  <AsyncSelect
                    menuPortalTarget={document.body}
                    instanceId="autocomplete-select"
                    loadOptions={loadOptions}
                    onChange={(e) => onChange(e, item.meal_key)}
                    cacheOptions
                    onInputChange={(e) => setSearch(e)}
                    getOptionLabel={(e) => {
                      return parse(`<span class='text-blue-500'>${e.name}</span> (${e.weight} ${T['Db.Unit.Gram']})`)
                    }}
                    getOptionValue={(e) => e.id}
                    value={value || ''}
                    styles={{
                      indicatorContainer: (provided) => ({
                        ...provided,
                        padding: 0,
                      }),
                      control: (provided) => ({
                        ...provided,
                        minHeight: '20px'
                      }),
                      menuPortal: base => ({ ...base, zIndex: 9999 }),
                      option: (provided) => ({
                        ...provided,
                        fontSize: '12px',
                        display: 'none'
                      }),
                      groupHeading: (provided) => ({
                        ...provided,
                        color: 'black'
                      })
                    }}
                    components={{ GroupHeading: CustomGroupHeading }}
                  />
                </div>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </Modal>
  )
}

export default React.memo(EditFoodSheetModal)
