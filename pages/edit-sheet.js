import React, { useState } from 'react'
import { useLang } from '@hooks/useLang'
import { useRouter } from 'next/router'
import { useRequest } from '@services/api'
import { BASE_URL_VISIT } from '@common/constants'
import { visitService } from '@services/index'
import ReactTooltip from 'react-tooltip'
import Popover from '@components/popover'
import { useClinic } from '@hooks/useClinic'
import { useAuth } from '@hooks/useAuth'
import withAuth from '@hocs/withAuth'
import FormLoader from '@components/loader/form'
import SearchFoodModal from '@components/modals/search-food-modal'
import { toast } from 'react-toastify'
import { showErrorMessage } from '@utils/helpers'

function EditSheetPage() {
  const { token } = useAuth()
  const router = useRouter()
  const { clinicId } = useClinic()
  const { foodSheetId } = router.query
  const { translations: T, lang } = useLang()

  const [loading, setLoading] = useState(false)
  const [mealKey, setMealKey] = useState('')
  const [showModal, setShowModal] = useState(false)

  const { visitId } = router.query

  const deleteRow = async (id) => {
    setLoading(true)
    const data = {
      clinic_id: clinicId,
      visit_id: visitId,
      food_sheet_id: foodSheetId,
      food_sheet_row_id: id,
      token: token
    }

    try {
      await visitService.removeFoodSheetRow(data, token)
      await revalidate()
    } catch (e) {
      return toast.error(T[showErrorMessage(e.message)])
    } finally {
      setLoading(false)
    }
  }

  const {
    data,
    revalidate
  } = useRequest(foodSheetId && `${BASE_URL_VISIT}/GetFoodSheetDetails?clinic_id=${clinicId}&visit_id=${visitId}&food_sheet_id=${foodSheetId}`, {
    revalidateOnFocus: false,
    refreshInterval: 0
  })

  const { food_sheet = [], totals = [] } = data || {}

  const renderBorderBasedOnLanguage = () => {
    return lang === 'Heb' ? 'border-l' : 'border-r'
  }

  return (
    <div>
      <div className="flex items-center">
        <i
          className={`fas ${lang === 'Eng' ? 'fa-arrow-left' : 'fa-arrow-right'} cursor-pointer`}
          onClick={() => {
            router.back()
            setTimeout(() => {
              const element = document.getElementById(router.query?.categoryKey)
              window.scroll({
                top: element.offsetTop + 150,
                left: 0,
                behavior: 'smooth'
              })
            }, 1000)
          }}
        />
        <h3 className="mx-3">{T['Modal.FoodSheet.EditSheet.Title']}</h3>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 text-xs">
        {loading && <FormLoader/>}
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
              <th className={`font-normal border-b px-1 ${renderBorderBasedOnLanguage()} border-black ${lang === 'Eng' ? 'text-left' : 'text-right'}`}>
                {T[item.nutrient_trans_key]}
              </th>
              <th className={`font-medium border-b border-black px-1 ${lang === 'Eng' ? 'text-left' : 'text-right'}`}>
                {item.nutrient_amount} {T[item.unit_trans_key]}
              </th>
            </tr>
          ))}
          </tbody>
        </table>
        <table className="border border-black col-span-3 h-fit">
          <thead>
          <tr>
            <th
              className={`p-1 bg-cyan-light-blue text-black ${renderBorderBasedOnLanguage()} border-b border-black font-medium ${lang === 'Eng' ? 'text-left' : 'text-right'}`}>
              {T['Modal.FoodSheet.MealHeader.Caption']}
            </th>
            <th className={`p-1 bg-cyan-light-blue text-black border-b border-black font-medium ${lang === 'Eng' ? 'text-left' : 'text-right'}`}>
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
                <div className={(item.sheet_rows || []).length > 0 ? 'mb-3' : ''}>
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
                <div
                  className="text-xs flex items-center cursor-pointer"
                  onClick={() => {
                    setShowModal(true)
                    setMealKey(item.meal_key)
                  }}
                >
                  <button className="rounded-md bg-blue-200 w-7 h-7">
                    <i className="fas fa-plus text-blue-500"/>
                  </button>
                  <span className="mx-1 text-blue-500">{T['Modal.FoodSheet.AddNewItemAction.Caption']}</span>
                </div>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <SearchFoodModal
          showModal={showModal}
          setShowModal={setShowModal}
          loading={loading}
          setLoading={setLoading}
          mealKey={mealKey}
          setMealKey={setMealKey}
          revalidate={revalidate}
        />
      )}
    </div>
  )
}

export default withAuth(EditSheetPage)
