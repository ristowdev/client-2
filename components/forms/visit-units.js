import React from 'react'
import { Field, Form } from 'react-final-form'
import { showErrorMessage, validationOnBlur } from '@utils/helpers'
import { visitService } from '@services/index'
import { toast } from 'react-toastify'

function VisitUnits({ field, showSelect, setShowSelect, loading, setLoading, clinicId, token, visitId, revalidate, translations, select  }) {
  const T = translations

  const onSubmitUnits = async (values) => {
    setLoading(true)
    values.clinic_id = clinicId
    values.token = token
    values.visit_id = visitId

    try {
      await visitService.editFigureUnit(values)
      await revalidate()
    } catch (e) {
      return toast.error(T[showErrorMessage(e.message)])
    }

    setLoading(false)
  }

  return field.units.map((unit, idx) => {
    if (unit.unit_key === field.unit_key && field.units.length === 1) {
      return (
        <label
          key={idx}
          className="text-grey opacity-60 text-xs"
        >
          {T[unit.unit_trans_key]}
        </label>
      )
    } else if (unit.unit_key === field.unit_key) {
      return (
        <Form
          key={idx}
          onSubmit={onSubmitUnits}
          render={({ handleSubmit, values }) => (
            <form onSubmit={handleSubmit}>
              <div className="login-form flex">
                {showSelect !== field.figure_key && (
                  <Field
                    name="figure_field_key"
                    defaultValue={field.figure_key}
                  >
                    {({ input, meta }) => (
                      <label
                        {...input}
                        className={`text-xs cursor-pointer h-10 flex items-center -mt-1 ${showSelect && 'd-none'}`}
                        onClick={() => setShowSelect(field.figure_key)}
                        style={{ minWidth: '70px' }}
                      >
                        {T[unit.unit_trans_key]}
                      </label>
                    )}
                  </Field>
                )}
                {showSelect === field.figure_key && (
                  <Field
                    name="unit_key"
                    defaultValue={unit.unit_key}
                  >
                    {({ input, meta }) => (
                      <select
                        disabled={loading}
                        {...input}
                        className={`text-xs h-9 border border-select rounded px-2 py-1 ${!showSelect && 'd-none'}`}
                        onChange={(e) => {
                          validationOnBlur(e, unit.unit_key, input, handleSubmit)
                          setShowSelect(null)
                        }}
                        ref={select}
                      >
                        {field.units.map((u, idx) => (
                          <option key={idx} value={u.unit_key}>{T[u.unit_trans_key]}</option>
                        ))}
                      </select>
                    )}
                  </Field>
                )}
              </div>
            </form>
          )}
        />
      )
    }
  })
}

export default VisitUnits