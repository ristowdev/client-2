import React from 'react'
import { Field, Form } from 'react-final-form'
import { showErrorMessage, validationCheckBoxOnBlur } from '@utils/helpers'
import Modal from '@components/modals/index'
import { visitService } from '@services/index'
import { toast } from 'react-toastify'
import ReactTooltip from 'react-tooltip'

function SelectVisitFieldsModal(
  {
    token,
    clinicId,
    visitId,
    showModal,
    setShowModal,
    setModalType,
    revalidate,
    translations,
    data,
    loading,
    setLoading
  }
) {
  const T = translations

  const onSubmit = async (values) => {
    setLoading(true)
    values.token = token
    values.clinic_id = clinicId
    values.visit_id = visitId

    try {
      await visitService.editFigureIsDisplayed(values)
      await revalidate()
    } catch (e) {
      return toast.error(T[showErrorMessage(e.message)])
    }

    setLoading(false)
  }

  return (
    <Modal
      modalIsOpen={showModal}
      onCloseModal={() => {
        setShowModal(false)
        setModalType('')
      }}
      header={T['Page.VisitDetails.SelectFields.Caption']}
    >
      <ReactTooltip/>
      <div className="row mb-8">
        <div className="col-2">
          <p className="flex">{T['PageComponent.BoxDetails.DisplayHeader.Caption']}</p>
        </div>
        <div className="col-10">
          <p className="flex">{T['PageComponent.BoxDetails.FigureHeader.Caption']}</p>
        </div>
      </div>
      {data.figure_fields.map((field, idx) => (
        <Form
          key={idx}
          onSubmit={onSubmit}
          render={({ handleSubmit, submitting, pristine }) => (
            <form onSubmit={handleSubmit} className="form-body pt-0 pb-0 mb-4">
              <div className="login-form row items-center">
                <div className="col-2">
                  <Field
                    type="checkbox"
                    name="is_displayed"
                    defaultValue={field.is_displayed}
                  >
                    {({ input, meta }) => (
                      <div className="form-group mb-3">
                        <input
                          {...input}
                          disabled={loading}
                          checked={field.is_displayed}
                          type="checkbox"
                          id={`modal-${field.figure_key}`}
                          onChange={(e) => validationCheckBoxOnBlur(e, field.is_displayed, input, handleSubmit)}
                          className="cursor-pointer flex"
                        />
                      </div>
                    )}
                  </Field>
                </div>
                <div className="col-10">
                  <Field
                    type="text"
                    name="figure_field_key"
                    defaultValue={field.figure_key}
                  >
                    {({ input, meta }) => (
                      <div className="form-group mb-3">
                        <label
                          {...input}
                          htmlFor={`modal-${field.figure_key}`}
                          data-tip={T[field.figure_description_trans_key]}
                          className="cursor-pointer flex"
                        >
                          {T[field.figure_trans_key]}
                        </label>
                      </div>
                    )}
                  </Field>
                </div>
              </div>
            </form>
          )}
        />
      ))}
    </Modal>
  )
}

export default React.memo(SelectVisitFieldsModal)