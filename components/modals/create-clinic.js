import React from 'react'
import { Field, Form } from 'react-final-form'
import Modal from '@components/modals/index'
import { clinicService, registerService } from '@services/index'
import { toast } from 'react-toastify'
import { useLang } from '@hooks/useLang'
import Button from '@components/button'
import { showErrorMessage } from '@utils/helpers'
import { useRouter } from 'next/router'
import { useClinic } from '@hooks/useClinic'
import cookie from 'js-cookie'

function CreateClinicModal({ token, modalIsOpen, onCloseModal, revalidate }) {
  const router = useRouter()
  const { translations } = useLang()
  const { setSelectedClinic } = useClinic()
  const T = translations

  const onSubmit = async (values, form) => {
    const timeZone = await registerService.getTimeZone({iana: Intl.DateTimeFormat().resolvedOptions().timeZone})
    values.token = token
    values.time_zone_key =  timeZone.win_time_zone

    try {
      const clinic = await clinicService.createClinic(values)
      setSelectedClinic(clinic.id)
      cookie.set('clinic_id', clinic.id, { expires: 365 })
      await revalidate()
      onCloseModal()
      router.push("/clinic-details")
    } catch (e) {
      return toast.error(T[showErrorMessage(e.message)])
    }
  }

  return (
    <Modal
      modalIsOpen={modalIsOpen}
      onCloseModal={onCloseModal}
      header={T['Page.Master.NewClinicItem.Caption']}
    >
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, form, submitting, pristine}) => (
          <form onSubmit={handleSubmit} className="mt-8 form-body">
            <div className="login-form">
              <Field
                type="text"
                name="name"
              >
                {({ input, meta }) => (
                  <div className="form-group mb-3">
                    <input
                      {...input}
                      className="form-control input-height"
                      placeholder={T['Page.Master.NewClinicItem.Caption']}
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
                  text={T['Page.Master.CreateClinicAction.Caption']}
                />
              </div>
            </div>
          </form>
        )}
      />
    </Modal>
  )
}

export default React.memo(CreateClinicModal)