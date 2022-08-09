import React from 'react'
import { Field, Form } from 'react-final-form'
import { showErrorMessage, validationOnBlur } from '@utils/helpers'
import { visitService } from '@services/index'
import { toast } from 'react-toastify'

function VisitTextField({ data, translations, loading, setLoading, clinicId, token, visitId, revalidate }) {
  const T = translations

  const onSubmit = async (values) => {
    setLoading(true)
    values.clinic_id = clinicId
    values.token = token
    values.visit_id = visitId

    if(!values.text_field_value) {
      values.text_field_value = ""
    }

    try {
      await visitService.editTextField(values)
      await revalidate()
    } catch (e) {
      return toast.error(T[showErrorMessage(e.message)])
    }

    setLoading(false)
  }

  return (
    <div className="pl-5 mt-2">
      <p className="flex font-semibold text-black text-lg">{T[data.box_trans_key]}</p>
      {data.text_fields.map((textField, idx) => (
        <Form
          key={idx}
          onSubmit={onSubmit}
          render={({ handleSubmit, values }) => (
            <form className="border-bottom border-bottom-gray" onSubmit={handleSubmit}>
              <div className="login-form">
                <div className="row items-center">
                  <div className="col-md-12">
                    <Field
                      name="text_field_key"
                      defaultValue={textField.text_field_key}
                    >
                      {({ input, meta }) => (
                        <textarea
                          {...input}
                          className="form-control d-none"
                          value={textField.text_field_key}
                        />
                      )}
                    </Field>
                    <Field
                      type="text"
                      name="text_field_value"
                      defaultValue={textField.field_value}
                    >
                      {({ input, meta }) => (
                        <textarea
                          {...input}
                          disabled={loading}
                          onBlur={(e) => validationOnBlur(e, textField.field_value, input, handleSubmit)}
                          className="form-control"
                          rows={5}
                        >
                          {textField.field_value}
                        </textarea>
                      )}
                    </Field>
                  </div>
                </div>
              </div>
            </form>
          )}
        />
      ))}
    </div>
  )
}

export default VisitTextField