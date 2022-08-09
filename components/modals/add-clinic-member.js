import React from 'react'
import { Field, Form } from 'react-final-form'
import Modal from '@components/modals/index'
import { clinicService } from '@services/index'
import { toast } from 'react-toastify'
import { useLang } from '@hooks/useLang'
import Button from '@components/button'
import { showErrorMessage } from '@utils/helpers'

function AddClinicMemberModal({ token, clinicId, modalIsOpen, onCloseModal, revalidate }) {
  const { translations } = useLang()
  const T = translations

  const onSubmit = async (values, form) => {
    values.token = token
    values.clinic_id = clinicId

    try {
      await clinicService.addMemberByEmail(values)
      await revalidate()
      onCloseModal()
    } catch (e) {
      return toast.error(T[showErrorMessage(e.message)])
    }
  }

  return (
    <Modal
      modalIsOpen={modalIsOpen}
      onCloseModal={onCloseModal}
      header={T['Page.ClinicMembers.AddMemberAction.Caption']}
    >
      <Form
        onSubmit={onSubmit}
        validate={(values) => {
        }}
        render={({ handleSubmit, form, submitting, pristine, values, submitErrors, errors }) => (
          <form onSubmit={handleSubmit} className="mt-8 form-body">
            <div className="login-form">
              <Field
                type="email"
                name="email"
              >
                {({ input, meta }) => (
                  <div className="form-group mb-3">
                    <input
                      {...input}
                      className="form-control input-height"
                      placeholder={T['Page.ClinicMembers.EmailField.Caption']}
                    />
                    {meta.error && meta.touched && <span className="text-red-500 text-xs mt-1">{meta.error}</span>}
                  </div>
                )}
              </Field>
              <div className="btn-block mt-4">
                <Button
                  classList="btn btn-info btn-block w-full text-lg flex items-center justify-center"
                  buttonSpinnerColor="#fff"
                  disabled={submitting || pristine}
                  loading={submitting}
                  text={T['Page.ClinicMembers.SubmitAction.Caption']}
                />
              </div>
            </div>
          </form>
        )}
      />
    </Modal>
  )
}

export default React.memo(AddClinicMemberModal)