import React from 'react'
import { Field, Form } from 'react-final-form'
import { showErrorMessage, validationOnBlur } from '@utils/helpers'
import { visitService } from '@services/index'
import { toast } from 'react-toastify'

function VisitCheckbox({ data, translations, loading, setLoading, clinicId, token, visitId, revalidate }) {
  const T = translations

  const onSubmit = async (values) => {
    setLoading(true)
    values.clinic_id = clinicId
    values.token = token
    values.visit_id = visitId

    try {
      await visitService.editLabelCheck(values)
      await revalidate()
    } catch (e) {
      return toast.error(T[showErrorMessage(e.message)])
    }

    setLoading(false)
  }

  return (
    <div className="pl-5 mt-2">
      <p className="flex font-semibold text-black text-lg">{T[data.box_trans_key]}</p>
      {(data.labels || []).map((label, idx) => (
        <Form
          key={idx}
          onSubmit={onSubmit}
          render={({ handleSubmit, values }) => (
            <form onSubmit={handleSubmit}>
              <div className="login-form">
                <div className="row items-center">
                  <div className="col-md-12">
                    <Field
                      name="label_key"
                      defaultValue={label.label_key}
                    >
                      {({ input, meta }) => (
                        <input
                          {...input}
                          className="d-none"
                          value={label.label_key}
                        />
                      )}
                    </Field>
                    <Field
                      type="text"
                      name="is_checked"
                      defaultValue={label.is_checked}
                    >
                      {({ input, meta }) => (
                        <div className="flex items-center">
                          <input
                            {...input}
                            disabled={loading}
                            checked={label.is_checked}
                            type="checkbox"
                            onChange={(e) => validationOnBlur(e, label.is_checked, input, handleSubmit)}
                            id={label.label_key}
                            className="cursor-pointer"
                          />
                          <label
                            className="mx-3 cursor-pointer"
                            htmlFor={label.label_key}
                          >
                            {T[label.label_trans_key]}
                          </label>
                        </div>
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

export default VisitCheckbox