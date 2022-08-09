import React, { useMemo, useState } from 'react'
import Modal from '@components/modals/index'
import { useLang } from '@hooks/useLang'
import debounce from 'debounce-async'
import qs from 'querystring'
import { visitService } from '@services/index'
import { useClinic } from '@hooks/useClinic'
import { useAuth } from '@hooks/useAuth'
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel
} from 'react-accessible-accordion'
import { showErrorMessage } from '@utils/helpers'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

const SearchFoodModal = ({ showModal, setShowModal, mealKey, setMealKey, loading, setLoading, revalidate }) => {
  const router = useRouter()
  const { clinicId } = useClinic()
  const { token } = useAuth()
  const { translations: T, lang } = useLang()

  const { foodSheetId, visitId } = router.query

  const [search, setSearch] = useState('')
  const [lastOptions, setLastOptions] = useState([])


  const onChange = async (food_item_id, food_unit_id) => {
    setLoading(true)
    const data = {
      clinic_id: clinicId,
      visit_id: visitId,
      food_sheet_id: foodSheetId,
      food_item_id,
      food_unit_id,
      meal_key: mealKey
    }

    try {
      await visitService.addFoodSheetRow(data, token)
      await revalidate()
    } catch (e) {
      return toast.error(T[showErrorMessage(e.message)])
    } finally {
      setMealKey('')
      setLoading(false)
      setShowModal(false)
    }
  }

  const loadOptions = useMemo(() => {
    return debounce(async (inputValue) => {
      const query = qs.stringify({
        clinic_id: clinicId,
        search_text: inputValue,
        token: token
      })
      const data = await visitService.searchFoodItems(query, token)
      const options = []

      data.map(item => {
        options.push({
          id: item.id,
          calories: item.calories,
          name: item.name,
          options: item.units
        })
      })
      setLastOptions(options)

      return options
    }, 100)
  }, [lastOptions])

  return (
    <Modal
      modalIsOpen={showModal}
      onCloseModal={async () => {
        setShowModal(false)
      }}
      header={T['Modal.FoodSheet.Search.Title']}
    >
     <div className="relative">
       <input
         placeholder={T['Modal.FoodSheet.Search.Title']}
         className="h-10 w-full rounded-md border p-3 focus:border border-gray input-form-control"
         onChange={(event) => {
           setSearch(event.target.value)
           // loadOptions(event.target.value)
         }}
       />
       <i
         className={`fas fa-search absolute ${lang === 'Eng' ? 'right-3' : 'left-3'} top-1.5 text-xl text-deep-blue cursor-pointer`}
         onClick={() => loadOptions(search)}
       />
     </div>
      <div className={`mt-5 ${lang === 'Eng' ? 'pr-2' : 'pl-2'} overflow-y-auto`} style={{ maxHeight: '480px', minHeight: '480px' }}>
        {lastOptions.length > 0 && (
          <Accordion allowZeroExpanded>
            {lastOptions.map(item => (
              <AccordionItem key={item.id} uuid={item.id}>
                <AccordionItemHeading>
                  <AccordionItemButton>
                    <div className="d-flex justify-content-between w-100">
                      <div>{item.name} </div>
                      <div className="mx-5">{item.calories}</div>
                    </div>
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                  {item?.options?.map((option, idx) => (
                    <div
                      className={`cursor-pointer p-1 hover:bg-gray-200 ${lang === 'Eng' ? 'text-left' : 'text-right'}`}
                      key={option?.id || idx}
                      onClick={() => onChange(option.food_item_id, option.id)}
                    >
                      <span className='text-blue-500'>{option?.name}</span> ({option?.weight} {T['Db.Unit.Gram']})
                    </div>
                  ))}
                </AccordionItemPanel>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </Modal>
  )
}

export default SearchFoodModal
