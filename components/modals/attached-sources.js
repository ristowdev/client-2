import React from 'react'
import { Field, Form } from 'react-final-form'
import {
  renderAttachedSourceIcon,
  renderModalTypeBySource,
  showErrorMessage,
  validationCheckBoxOnBlur,
  validationOnBlur
} from '@utils/helpers'
import Modal from '@components/modals/index'
import { visitService } from '@services/index'
import { toast } from 'react-toastify'
import ReactTooltip from 'react-tooltip'
import { useLang } from '@hooks/useLang'

function AttachedSourcesModal(
  {
    token,
    clinicId,
    visitId,
    showModal,
    setShowModal,
    setModalType,
    revalidate,
    translations,
    attachedSources,
    loading,
    setLoading,
    setSelectedSourceKey
  }
) {
  const T = translations
  const { lang } = useLang()

  const onSubmit = async (values) => {
    setLoading(true)
    values.token = token
    values.clinic_id = clinicId
    values.visit_id = visitId

    try {
      await visitService.editSourceIsDisplayed(values)
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
        setSelectedSourceKey('')
        setModalType('')
      }}
      header={T['PageComponent.BoxDetails.AvailableSources.Caption']}
    >
      <ReactTooltip/>
      <div className="row mb-8">
        <div className="col-2">
          <p className="flex">{T['PageComponent.BoxDetails.DisplayHeader.Caption']}</p>
        </div>
        <div className="col-10">
          <p className="flex">{T['PageComponent.BoxDetails.SourceHeader.Caption']}</p>
        </div>
      </div>
      {attachedSources.map((source, idx) => (
        <Form
          key={idx}
          onSubmit={onSubmit}
          render={({ handleSubmit, submitting, pristine }) => (
            <form onSubmit={handleSubmit} className="form-body pt-0 pb-0">
              <div className="login-form row items-center mb-3">
                <div className="col-2 flex">
                  <Field
                    type="checkbox"
                    name="is_displayed"
                    defaultValue={source.is_displayed}
                  >
                    {({ input, meta }) => (
                      <div className="form-group mb-3 mt-1">
                        <input
                          {...input}
                          disabled={loading}
                          checked={source.is_displayed}
                          type="checkbox"
                          id={`asModal-${source.source_key}`}
                          onChange={(e) => validationCheckBoxOnBlur(e, source.is_displayed, input, handleSubmit)}
                          className="cursor-pointer"
                        />
                      </div>
                    )}
                  </Field>
                </div>
                <div className="col-10">
                  <Field
                    type="text"
                    name="source_key"
                    defaultValue={source.source_key}
                  >
                    {({ input, meta }) => (
                      <div className="form-group mb-3">
                        <label
                          {...input}
                          htmlFor={`asModal-${source.figure_key}`}
                          data-tip={T[source.figure_description_trans_key]}
                          className="cursor-pointer"
                        >
                          {T[source.figure_trans_key]}
                        </label>
                        <p
                          key={idx}
                          className={`text-primary hover:underline text-base mb-2 cursor-pointer ${lang === 'Heb' && 'text-right'}`}
                          onClick={() => {
                            renderModalTypeBySource(source, setModalType)
                            setSelectedSourceKey(source.source_key)
                          }}
                        >
                          <i className={renderAttachedSourceIcon(source.source_type_key)}/> {' '}
                          {T[source.source_trans_key]}
                        </p>
                      </div>
                    )}
                  </Field>
                </div>
                {/*{(source.source_values || []).map((sourceValue, idx) => (*/}
                {/*  <div*/}
                {/*    className="flex col-10 items-center lg:overflow-hidden overflow-x-scroll"*/}
                {/*    key={idx}*/}
                {/*    style={lang === 'Heb' ? { marginRight: '16.666667%' } : { marginLeft: '16.666667%' }}*/}
                {/*  >*/}
                {/*    {sourceValue.is_selected ?*/}
                {/*      <p*/}
                {/*        style={{ minWidth: '10rem' }}*/}
                {/*        className="w-56 bg-green-200 border-top border-left px-2 py-1 rounded flex"*/}
                {/*      >*/}
                {/*        {T[sourceValue.figure_trans_key]}*/}
                {/*      </p> :*/}
                {/*      <p style={{ minWidth: '10rem' }} className="w-56 flex">{T[sourceValue.figure_trans_key]}</p>*/}
                {/*    }*/}
                {/*    <input*/}
                {/*      className="form-control text-sm w-28 mx-5"*/}
                {/*      value={sourceValue.field_value || ""}*/}
                {/*      disabled={true}*/}
                {/*    />*/}
                {/*    <label className="text-xs cursor-pointer h-10 flex items-center">*/}
                {/*      {T[sourceValue.unit_trans_key]}*/}
                {/*    </label>*/}
                {/*  </div>*/}
                {/*))}*/}
              </div>
            </form>
          )}
        />
      ))}
    </Modal>
  )
}

export default React.memo(AttachedSourcesModal)