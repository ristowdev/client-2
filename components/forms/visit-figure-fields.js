import React from 'react'
import { Field, Form } from 'react-final-form'
import { showErrorMessage, validationOnBlur } from '@utils/helpers'
import { composeValidators, maxValue, minValue } from '@utils/form-validators'
import { visitService } from '@services/index'
import { toast } from 'react-toastify'
import { useLang } from '@hooks/useLang'

function VisitFigureFields({ field, idx, loading, setLoading, clinicId, token, visitId, revalidate, translations }) {
  const { lang } = useLang()
  const T = translations

  const onSubmit = async (values) => {
    setLoading(true)
    values.clinic_id = clinicId
    values.token = token
    values.visit_id = visitId

    try {
      await visitService.editFigureValue(values)
      await revalidate()
    } catch (e) {
      return toast.error(T[showErrorMessage(e.message)])
    }

    setLoading(false)
  }

  return (
    <>
      <Form
        key={idx}
        onSubmit={onSubmit}
        render={({ handleSubmit, values }) => (
          <form onSubmit={handleSubmit}>
            <div className="login-form">
              <div className="row items-center">
                <div className="col-md-12 flex items-center">
                  <Field
                    name="figure_field_key"
                    defaultValue={field.figure_key}
                  >
                    {({ input, meta }) => (
                      <label
                        {...input}
                        className="lg:w-52 w-40 text-base cursor-pointer"
                        data-tip={T[field.figure_description_trans_key]}
                      >
                        {T[field.figure_trans_key]}
                      </label>
                    )}
                  </Field>
                  <Field
                    type="text"
                    name="figure_field_value"
                    defaultValue={field.field_value !== null ? field.field_value?.toFixed(field.field_settings.decimal_digits) : ""}
                    validate={composeValidators(minValue(field.field_settings.min_value), maxValue(field.field_settings.max_value))}
                  >
                    {({ input, meta }) => (
                      <div className="flex items-center">
                        <input
                          {...input}
                          disabled={!field.is_editable || loading}
                          className={`form-control text-sm w-28 ${!field.source_key && 'font-bold'} ${meta.error && meta.touched && `border border-red-500`}`}
                          style={lang === 'Heb' ? { direction: 'ltr', textAlign: 'right' } : {}}
                          onBlur={(e) => {
                            validationOnBlur(e, field.field_value?.toFixed(field.field_settings.decimal_digits), input, handleSubmit)
                          }}
                        />
                      </div>
                    )}
                  </Field>
                </div>
              </div>
            </div>
          </form>
        )}
      />
    </>
  )
}

export default VisitFigureFields