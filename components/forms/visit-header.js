import React, { useEffect, useState } from 'react'
import { Field, Form } from 'react-final-form'
import { getMaxDate, showErrorMessage, validateTimeOnBlur, validationOnBlur } from '@utils/helpers'
import TimePicker from 'rc-time-picker'
import { toast } from 'react-toastify'
import moment from 'moment'
import { visitService } from '@services/index'

function VisitHeader(
  {
    translations,
    visitOptions,
    visitType,
    visitStatus,
    visitTitle,
    visitDate,
    visitTime,
    editedBy,
    token,
    clinicId,
    visitId,
    revalidate,
    loading,
    setLoading,
    formatType,
    is12Hour
  }
) {
  const T = translations

  const [time, setTime] = useState()

  const onSubmit = async (values) => {
    setLoading(true)
    values.token = token
    values.clinic_id = clinicId
    values.visit_id = visitId
    values.visit_time = time ? moment(time).format(formatType) : null

    if(!values.visit_title) {
      values.visit_title = ""
    }

    try {
      await visitService.editVisitDetails(values)
      await revalidate()
    } catch (e) {
      return toast.error(T[showErrorMessage(e.message)])
    }

    setLoading(false)
  }

  useEffect(() => {
    if (visitTime !== null) {
      setTime(moment(visitTime, formatType))
    }
  }, [])

  const handleValueChange = value => {
    setTime(value)
  }

  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, values }) => (
        <form className="border-bottom border-bottom-gray" onSubmit={handleSubmit}>
          <div className="login-form mt-5">
            <div className="row items-center">
              <div className="col-md-5 col-12 mb-5">
                <div className="row">
                  <div className="col-md-12">
                    <label className="text-grey">{T['Page.VisitDetails.VisitTypeField.Label']}</label>
                  </div>
                  <div className="col-md-12">
                    <Field
                      type="text"
                      name="visit_type_key"
                      defaultValue={visitType.visit_type_key}
                    >
                      {({ input, meta }) => (
                        <select
                          {...input}
                          disabled={loading}
                          onBlur={(e) => validationOnBlur(e, visitType.visit_type_key, input, handleSubmit)}
                          className="form-control input-height"
                        >
                          {visitOptions.map((t, idx) => (
                            <option value={t.key} key={idx}>{T[t.trans_key]}</option>
                          ))}
                        </select>
                      )}
                    </Field>
                  </div>
                </div>
              </div>
              <div className="col-md-7 col-12 mb-5">
                <div className="row">
                  <div className="col-md-12">
                    <label className="text-grey">{T['Page.VisitDetails.TitleField.Label']}</label>
                  </div>
                  <div className="col-md-12">
                    <Field
                      type="text"
                      name="visit_title"
                      defaultValue={visitTitle}
                    >
                      {({ input, meta }) => (
                        <input
                          {...input}
                          disabled={loading}
                          onBlur={(e) => validationOnBlur(e, visitTitle, input, handleSubmit)}
                          className="form-control input-height"
                        />
                      )}
                    </Field>
                  </div>
                </div>
              </div>
            </div>
            <div className="row items-center">
              <div className="col-md-4 col-12 mb-5">
                <div className="row">
                  <div className="col-md-12">
                    <label className="text-grey">{T['Page.VisitDetails.DateField.Label']}</label>
                  </div>
                  <div className="col-md-12">
                    <Field
                      type="date"
                      name="visit_date"
                      defaultValue={visitDate}
                    >
                      {({ input, meta }) => (
                        <input
                          {...input}
                          disabled={loading}
                          max={getMaxDate()}
                          type="date"
                          onBlur={(e) => validationOnBlur(e, visitDate, input, handleSubmit)}
                          className="form-control input-height"
                        />
                      )}
                    </Field>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-12 mb-5">
                <div className="row">
                  <div className="col-md-12">
                    <label className="text-grey">{T['Page.VisitDetails.TimeField.Label']}</label>
                  </div>
                  <div className="col-md-12">
                    <Field
                      type="text"
                      name="visit_time"
                    >
                      {({ input, meta }) => (
                        <>
                          <TimePicker
                            showSecond={false}
                            minuteStep={5}
                            className="form-control input-height"
                            value={time}
                            allowEmpty
                            onChange={(e) => {
                              handleValueChange(e)
                              if(e === null) {
                                setTimeout(() => {
                                  handleSubmit()
                                }, 100)
                              }
                            }}
                            use12Hours={is12Hour}
                            onClose={() => {
                              validateTimeOnBlur(time, visitTime, formatType, handleSubmit)
                            }}
                          />
                        </>
                      )}
                    </Field>
                  </div>
                </div>
              </div>
              <div className="col-md-2 col-12 mb-5">
                <div className="row">
                  <div className="col-md-12">
                    <label className="text-grey">Visit Status</label>
                    <div className="w-full form-control disabled flex input-height items-center">
                      {T[visitStatus.trans_key]}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-12 mb-5">
                <div className="row">
                  <div className="col-md-12">
                    <label className="text-grey">{T['Page.VisitDetails.EditByField.Label']}</label>
                    <div className="w-full form-control disabled flex input-height items-center">
                      {editedBy.display_name}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    />
  )
}

export default VisitHeader