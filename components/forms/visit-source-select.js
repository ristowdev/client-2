import React, { useEffect, useState } from 'react'
import { Field, Form } from 'react-final-form'
import { showErrorMessage } from '@utils/helpers'
import { visitService } from '@services/index'
import { toast } from 'react-toastify'
import Select from 'react-select'
import { useLang } from '@hooks/useLang'

function VisitSourceSelect(
  {
    sourceSelect,
    setShowSourceSelect,
    showSourceSelect,
    setLoading,
    clinicId,
    token,
    visitId,
    revalidate,
    translations,
    field,
    sources
  }
) {
  const { lang } = useLang()
  const [options, setOptions] = useState([])

  const T = translations

  const onSubmit = async (values) => {
    setLoading(true)
    values.token = token
    values.visit_id = visitId
    values.clinic_id = clinicId

    try {
      await visitService.editFigureSource(values)
      await revalidate()
    } catch (e) {
      return toast.error(T[showErrorMessage(e.message)])
    }

    setShowSourceSelect(false)
    setLoading(false)
  }

  useEffect(() => {
    const clinicsOptions = []
    if (field.is_editable) {
      clinicsOptions.push({ name: "", value: "" })
    }

    sources.map(source => {
      clinicsOptions.push({
        value: source.source_key,
        label:
          <div>
            {source.converted_value || source.converted_value === 0 ? `${source.converted_value} - ` : '____ - '}
            {T[source.source_trans_key]}
          </div>,
      })
    })

    setOptions(clinicsOptions)
  }, [sources])

  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, values }) => (
        <form onSubmit={handleSubmit} className="w-full">
          <div className="login-form flex">
            <Field
              name="figure_field_key"
              defaultValue={field.figure_key}
            >
              {({ input, meta }) => (
                <input type="hidden" {...input}/>
              )}
            </Field>
            <Field
              name="source_key"
              defaultValue={field.source_key}
            >
              {({ input, meta }) => (
                // <select
                //   style={{ maxWidth: '356px', height: '27px' }}
                //   {...input}
                //   className="text-sm w-full h-8 border border-select rounded px-2"
                //   ref={sourceSelect}
                //   onChange={(e) => validationOnBlur(e, field.source_key, input, handleSubmit)}
                // >
                //   {field.is_editable && <option value=""></option>}
                //   {sources.map((source, idx) => (
                //     <option
                //       key={idx}
                //       value={source.source_key}
                //     >
                //       {source.converted_value || source.converted_value === 0 ? `${source.converted_value} - ` : '____ - '}
                //       {T[source.source_trans_key]}
                //     </option>
                //   ))}
                // </select>
                <div
                  ref={sourceSelect}
                  className="text-sm"
                  style={{ minWidth: '356px' }}
                >
                  <Select
                    {...input}
                    onChange={(e) => {
                      input.onChange(e.value)
                      if (e.value !== field.source_key) {
                        handleSubmit()
                      }
                    }}
                    defaultMenuIsOpen
                    menuPosition={'fixed'}
                    options={options}
                    styles={{
                      container: (base, state) => ({ ...base, zIndex: state.isFocused ? "9999" : "1", border: 0 }),
                      indicatorsContainer: () => ({ display: 'none' }),
                      menuPortal: provided => ({
                        ...provided,
                        zIndex: 9999,
                        fontSize: '11px',
                        backgroundColor: '#E9E9ED',
                      }),
                      menu: provided => ({ ...provided, zIndex: 9999 }),
                      menuList: (base) => ({ ...base, padding: 0 }),
                      control: () => ({ border: 0, display: 'flex' }),
                      option: (base, { isSelected }) => ({
                        ...base,
                        fontSize: '11px',
                        textAlign: lang === 'Heb' ? 'right' : 'left',
                        backgroundColor: isSelected ? '#52525E' : '#E9E9ED',
                        color: isSelected ? '#fff' : '#000',
                        cursor: 'pointer',
                        height: '33px'
                      }),
                      valueContainer: () => ({ display: 'none' })
                    }}
                    value={options.filter(o => o.value === field.source_key)[0]}
                  />
                </div>
              )}
            </Field>
          </div>
        </form>
      )}
    />
  )
}

export default VisitSourceSelect
