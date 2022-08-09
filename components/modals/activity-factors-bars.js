import React, { useEffect, useState } from 'react'
import Modal from '@components/modals/index'
import Slider from 'rc-slider'
import ReactTooltip from 'react-tooltip'
import { Field, Form } from 'react-final-form'
import { composeValidators, maxValue, minValue, mustBeNumber } from '@utils/form-validators'
import { showErrorMessage, validationOnBlur } from '@utils/helpers'
import { visitService } from '@services/index'
import { toast } from 'react-toastify'
import { useLang } from '@hooks/useLang'

function ActivityFactorsBarsModal(
  {
    token,
    clinicId,
    visitId,
    showModal,
    setShowModal,
    selectedSourceKey,
    setSelectedSourceKey,
    setModalType,
    figureFields,
    revalidate,
    setLoading,
    translations
  }
) {
  const T = translations

  const { lang } = useLang()

  const [defaultNeatFactorValue, setDefaultNeatFactorValue] = useState(0)
  const [defaultTeaFactorValue, setDefaultTeaFactorValue] = useState(0)

  const [neatFactorValue, setNeatFactorValue] = useState(0)
  const [teaFactorValue, setTeaFactorValue] = useState(0)
  const [tefFactorValue, setTefFactorValue] = useState(0)
  const [tefValue, setTefValue] = useState(0)
  const [bmrValue, setBmrValue] = useState(0)
  const [palValue, setPalValue] = useState(0)
  const [neatValue, setNeatValue] = useState(0)
  const [teaValue, setTeaValue] = useState(0)
  const [tdeeValue, setTdeeValue] = useState(0)

  useEffect(() => {
    figureFields.map(item => {
      if (item.figure_key === 'NeatFactor') {
        const value = item.sources.filter(source => source.source_key === "ActivityFactorsBars")[0]
        setNeatFactorValue(value.converted_value)
        setDefaultNeatFactorValue(value.converted_value)
      } else if (item.figure_key === 'TeaFactor') {
        const value = item.sources.filter(source => source.source_key === "ActivityFactorsBars")[0]
        setTeaFactorValue(value.converted_value)
        setDefaultTeaFactorValue(value.converted_value)
      } else if (item.figure_key === 'TefFactor') {
        const value = item.sources[0]
        setTefFactorValue(value.converted_value)
      } else if (item.figure_key === 'Tef') {
        const value = item.sources[0]
        setTefValue(value.converted_value)
      } else if (item.figure_key === 'Bmr') {
        const value = item.sources[0]
        setBmrValue(value.converted_value)
      }
    })
  }, [])

  useEffect(() => {
    //calculation based on given formula
    if (+neatFactorValue !== 0) {
      setPalValue((1 + (+tefFactorValue) + (+neatFactorValue) + (+teaFactorValue))?.toFixed(2))
      setNeatValue(Math.round((+bmrValue) * (+neatFactorValue)))
      setTeaValue(Math.round((+bmrValue) * (+teaFactorValue)))
      setTdeeValue(Math.round((+bmrValue) + (+tefValue) + (+neatValue) + (+teaValue)))
    }
  }, [neatFactorValue, teaValue])

  const SliderNumItem = ({ value }) => (
    <div className="text-base text-black w-10 relative top-1 flex items-center">
      <div className={`bg-black w-3 absolute ${lang === 'Heb' ? 'right-9' : 'left-2'}`} style={{ height: '1px' }}/>
      <span className={`mx-8 ${lang === 'Heb' ? 'inline mr-20' : ''}`}>{value}</span>
    </div>
  )

  const SliderTextItem = ({ value, text }) => (
    <div className="text-base text-black w-10 relative top-1 flex items-center">
      <div className={`bg-black w-3 absolute ${lang === 'Heb' ? 'right-9' : 'left-2'}`} style={{ height: '1px' }}/>
      <div className={`mx-8 flex items-center ${lang === 'Heb' ? 'relative right-9' : 'left-2'}`}>
        <span className={`w-8 ${lang === 'Heb' ? 'inline ml-5 mr-2' : ''}`}>{value}</span>
        <span className={`w-64 text-sm relative ${lang === 'Heb' ? 'left-1 text-right' : 'left-10 text-left'}`}>{text}</span>
      </div>
    </div>
  )

  const SliderNeatRightItem = ({ value }) => (
    <div className={`text-sm text-black w-64 relative top-1 ${lang === 'Heb' ? 'right-32 text-right' : 'left-24 text-left'}`}>{value}</div>
  )

  const neatMarks = {
    0.10: <SliderNumItem value={`0.10`}/>,
    0.15: <SliderNeatRightItem value={T['Modal.ActivitySilders.NeatFactor015.Caption']}/>,
    0.20: <SliderNumItem value={`0.20`}/>,
    0.25: <SliderNeatRightItem value={''}/>,
    0.30: <SliderNumItem value={`0.30`}/>,
    0.35: <SliderNeatRightItem value={T['Modal.ActivitySilders.NeatFactor035.Caption']}/>,
    0.40: <SliderNumItem value={`0.40`}/>,
    0.45: <SliderNeatRightItem value={T['Modal.ActivitySilders.NeatFactor045.Caption']}/>,
    0.50: <SliderNumItem value={`0.50`}/>,
    0.55: <SliderNeatRightItem value={T['Modal.ActivitySilders.NeatFactor055.Caption']}/>,
    0.60: <SliderNumItem value={`0.60`}/>,
    0.65: <SliderNeatRightItem value={T['Modal.ActivitySilders.NeatFactor065.Caption']}/>,
    0.70: <SliderNumItem value={`0.70`}/>,
    0.75: <SliderNeatRightItem value={''}/>,
    0.80: <SliderNumItem value={`0.80`}/>,
    0.85: <SliderNeatRightItem value={''}/>,
    0.90: <SliderNumItem value={`0.90`}/>,
    0.95: <SliderNeatRightItem value={''}/>,
    1.00: <SliderNumItem value={`1.00`}/>,
    1.05: <SliderNeatRightItem value={T['Modal.ActivitySilders.NeatFactor105.Caption']}/>,
    1.10: <SliderNumItem value={`1.10`}/>,
  }

  const teaMarks = {
    0.00: <SliderTextItem value={`0.00`} text={T['Modal.ActivitySilders.TeaFactor000.Caption']}/>,
    0.20: <SliderTextItem value={`0.20`} text={T['Modal.ActivitySilders.TeaFactor020.Caption']}/>,
    0.40: <SliderTextItem value={`0.40`} text={T['Modal.ActivitySilders.TeaFactor040.Caption']}/>,
    0.60: <SliderTextItem value={`0.60`} text={T['Modal.ActivitySilders.TeaFactor060.Caption']}/>,
    0.80: <SliderTextItem value={`0.80`} text={T['Modal.ActivitySilders.TeaFactor080.Caption']}/>,
    1.00: <SliderTextItem value={`1.00`} text={T['Modal.ActivitySilders.TeaFactor100.Caption']}/>,
    1.20: <SliderNumItem value={`1.20`}/>,
    1.40: <SliderNumItem value={`1.40`}/>,
    1.60: <SliderNumItem value={`1.60`}/>,
    1.80: <SliderNumItem value={`1.80`}/>,
    2.00: <SliderTextItem value={`2.00`} text={T['Modal.ActivitySilders.TeaFactor200.Caption']}/>,
  }

  const onSubmit = async (values) => {
    console.log(values)
  }

  const submitOnCloseModal = async (values) => {
    if ((defaultNeatFactorValue !== neatFactorValue) || (defaultTeaFactorValue !== teaFactorValue)) {
      setLoading(true)

      try {
        values.token = token
        values.clinic_id = clinicId
        values.visit_id = visitId

        await visitService.editActivitySliders(values)
        await revalidate()
      } catch (e) {
        return toast.error(T[showErrorMessage(e.message)])
      }

      setLoading(false)
    }
  }

  return (
    <Modal
      modalIsOpen={showModal}
      onCloseModal={() => {
        setShowModal(false)
        setSelectedSourceKey('')
        setModalType('')
        submitOnCloseModal(({ neat_factor_value: neatFactorValue, tea_factor_value: teaFactorValue }))
      }}
      header={T['Db.Source.ActivityFactorsBars.Name']}
    >
      <ReactTooltip place="right"/>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 lg:overflow-hidden overflow-x-scroll p-2">
        <div style={{height: '350px'}}>
          <h5 className="underline mb-5 text-lg flex">{T['Db.FigureField.NeatFactor.Name']}</h5>
          <div style={{ float: lang === 'Heb' ? 'right' : 'left', height: '290px' }}>
            <Slider
              vertical
              min={0.10}
              max={1.10}
              marks={neatMarks}
              value={neatFactorValue}
              step={0.05}
              onChange={(res) => setNeatFactorValue(res)}
            />
          </div>
        </div>
        <div className="lg:mb-0 mb-5" style={{height: '350px'}}>
          <h5 className="underline mb-5 lg:mt-0 mt-5 text-lg flex">{T['Db.FigureField.TeaFactor.Name']}</h5>
          <div style={{ float: lang === 'Heb' ? 'right' : 'left', height: '290px' }}>
            <Slider
              vertical
              min={0.00}
              max={2.00}
              marks={teaMarks}
              value={teaFactorValue}
              step={0.05}
              onChange={(res) => setTeaFactorValue(res)}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center mt-14">
        <p className="text-grey">{T['Modal.FormulaDetails.SourceReference.Caption']}</p>
        <h5 className="text-grey mx-2">
          <span
            className="cursor-pointer"
            data-tip="FAO-WHO-UNU Expert Consultation"
          >
            FAO-WHO-UNU
          </span>
        </h5>
      </div>
      <div className="border-bottom border-bottom-gray mt-8">
        <div className="mb-3 flex">
          <h5 className="text-bold">{T['Modal.FormulaDetails.OutputField.Caption']}</h5>
        </div>
      </div>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, submitting, pristine }) => (
          <form onSubmit={handleSubmit} className="pt-0 pb-0 mt-5">
            <div className="flex items-center">
              <Field
                name="neat_factor_value"
                defaultValue={neatFactorValue}
                validate={composeValidators(minValue(0.10), maxValue(1.10), mustBeNumber)}
              >
                {({ input, meta }) => (
                  <div className="flex items-center mb-3">
                    <h5
                      className="w-52 flex cursor-pointer"
                      style={{minWidth: '13rem'}}
                      data-tip={T['Db.FigureField.NeatFactor.Description']}
                    >
                      {T['Db.FigureField.NeatFactor.Name']}
                    </h5>
                    <input
                      {...input}
                      className={`form-control text-base w-28 ${meta.error && meta.touched && `border border-red-500`}`}
                      onChange={(e) => {
                        setNeatFactorValue(e.target.value)
                        input.onChange(e)
                      }}
                      disabled={true}
                      onBlur={(e) => {
                        validationOnBlur(e, neatFactorValue, input, handleSubmit, true)
                      }}
                    />
                  </div>
                )}
              </Field>
            </div>
            <div className="flex items-center">
              <Field
                name="tea_factor_value"
                defaultValue={teaFactorValue}
                validate={composeValidators(minValue(0.00), maxValue(2.00), mustBeNumber)}
              >
                {({ input, meta }) => (
                  <div className="flex items-center">
                    <h5
                      className="w-52 flex cursor-pointer"
                      style={{minWidth: '13rem'}}
                      data-tip={T['Db.FigureField.TeaFactor.Description']}
                    >
                      {T['Db.FigureField.TeaFactor.Name']}
                    </h5>
                    <input
                      {...input}
                      className={`form-control text-base w-28 ${meta.error && meta.touched && `border border-red-500`}`}
                      onChange={(e) => {
                        setTeaFactorValue(e.target.value)
                        input.onChange(e)
                      }}
                      disabled={true}
                      onBlur={(e) => {
                        validationOnBlur(e, teaFactorValue, input, handleSubmit, true)
                      }}
                    />
                  </div>
                )}
              </Field>
            </div>
          </form>
        )}
      />

      {/*quick calculations*/}
      <div className="border-bottom border-bottom-gray mt-8 lg:overflow-hidden overflow-x-scroll">
        <div className="mb-3 flex">
          <h5 className="text-bold">{T['Modal.ActivitySliders.QuickCalculations.Caption']}</h5>
        </div>
      </div>
      <div className="mt-5 lg:overflow-hidden overflow-x-scroll">
        <div className="flex items-center mb-3">
          <h5
            className="w-52 flex cursor-pointer"
            style={{minWidth: '13rem'}}
            data-tip={T['Db.FigureField.Pal.Description']}
          >
            {T['Db.FigureField.Pal.Name']}
          </h5>
          <input
            className="form-control text-base w-28"
            disabled={true}
            value={palValue}
          />
          <div className="w-5 mx-3" style={{minWidth: '3rem'}}/>
          <label className="mx-5 text-sm text-grey" style={{minWidth: '24rem'}}>
            = {T['Modal.ActivitySliders.PalFormula.Caption']}
          </label>
        </div>
        <div className="flex items-center mb-3">
          <h5
            className="w-52 flex cursor-pointer"
            style={{minWidth: '13rem'}}
            data-tip={T['Db.FigureField.Neat.Description']}
          >
            {T['Db.FigureField.Neat.Name']}
          </h5>
          <input
            className="form-control text-base w-28"
            disabled={true}
            value={neatValue}
          />
          <label className="mx-3 text-xs w-5" style={{minWidth: '3rem'}}>
            {T['Db.Unit.Kcal']}
          </label>
          <label className="mx-5 text-sm text-grey" style={{minWidth: '24rem'}}>
            = {T['Modal.ActivitySliders.NeatFormula.Caption']}
          </label>
        </div>
        <div className="flex items-center mb-3">
          <h5
            className="w-52 flex cursor-pointer"
            style={{minWidth: '13rem'}}
            data-tip={T['Db.FigureField.Tea.Description']}
          >
            {T['Db.FigureField.Tea.Name']}
          </h5>
          <input
            className="form-control text-base w-28"
            disabled={true}
            value={teaValue}
          />
          <label className="mx-3 text-xs w-5" style={{minWidth: '3rem'}}>
            {T['Db.Unit.Kcal']}
          </label>
          <label className="mx-5 text-sm text-grey" style={{minWidth: '24rem'}}>
            = {T['Modal.ActivitySliders.TeaFormula.Caption']}
          </label>
        </div>
        <div className="flex items-center">
          <h5
            className="w-52 flex cursor-pointer"
            style={{minWidth: '13rem'}}
            data-tip={T['Db.FigureField.Tdee.Description']}
          >
            {T['Db.FigureField.Tdee.Name']}
          </h5>
          <input
            className="form-control text-base w-28"
            disabled={true}
            value={tdeeValue}
          />
          <label className="mx-3 text-xs w-5" style={{minWidth: '3rem'}}>
            {T['Db.Unit.Kcal']}
          </label>
          <label className="mx-5 text-sm text-grey" style={{minWidth: '24rem'}}>
            = {T['Modal.ActivitySliders.TdeeFormula.Caption']}
          </label>
        </div>
      </div>
    </Modal>
  )
}

export default React.memo(ActivityFactorsBarsModal)