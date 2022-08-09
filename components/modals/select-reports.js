import React from 'react'
import { Field, Form } from 'react-final-form'
import { showErrorMessage, validationCheckBoxOnBlur } from '@utils/helpers'
import Modal from '@components/modals/index'
import { visitService } from '@services/index'
import { toast } from 'react-toastify'
import { useLang } from '@hooks/useLang'

function SelectReportsModal(
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
      await visitService.editReportIsDisplayed(values)
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
      header={T['Page.VisitDetails.SelectReports.Caption']}
    >
      <div className="row mb-8">
        <div className="col-2">
          <p className="flex">{T['PageComponent.BoxDetails.DisplayHeader.Caption']}</p>
        </div>
        <div className="col-10">
          <p className="flex">{T['PageComponent.BoxDetails.FigureHeader.Caption']}</p>
        </div>
      </div>
      {data.reports.map((report, idx) => (
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
                    defaultValue={report.is_displayed}
                  >
                    {({ input, meta }) => (
                      <div className="form-group mb-3">
                        <input
                          {...input}
                          disabled={loading}
                          checked={report.is_displayed}
                          type="checkbox"
                          id={`modal-${report.report_key}`}
                          onChange={(e) => validationCheckBoxOnBlur(e, report.is_displayed, input, handleSubmit)}
                          className="cursor-pointer flex"
                        />
                      </div>
                    )}
                  </Field>
                </div>
                <div className="col-10">
                  <Field
                    type="text"
                    name="report_key"
                    defaultValue={report.report_key}
                  >
                    {({ input, meta }) => (
                      <div className="form-group mb-3">
                        <label
                          {...input}
                          htmlFor={`modal-${report.report_key}`}
                          className="cursor-pointer flex"
                        >
                          {T[report.report_trans_key]}
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

export default React.memo(SelectReportsModal)