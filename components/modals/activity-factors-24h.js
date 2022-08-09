import React, { useEffect, useState } from 'react'
import Modal from '@components/modals/index'
import ReactTooltip from 'react-tooltip'
import { useRequest } from '@services/api'
import ContainerLoader from '@components/loader/container'
import { toast } from 'react-toastify'
import { visitService } from '@services/index'
import { showErrorMessage } from '@utils/helpers'

function ActivityFactors24hModal(
  {
    token,
    clinicId,
    visitId,
    showModal,
    setShowModal,
    setSelectedSourceKey,
    setModalType,
    figureFields,
    revalidate,
    setLoading,
    translations
  }
) {

  const { data, isValidating } = useRequest(`/prod/visitapi/GetCalcActivity24h?clinic_id=${clinicId}&visit_id=${visitId}`, { token })

  const T = translations

  const [neatFactorValue, setNeatFactorValue] = useState(0)
  const [teaFactorValue, setTeaFactorValue] = useState(0)
  const [tefFactorValue, setTefFactorValue] = useState(0)
  const [tefValue, setTefValue] = useState(0)
  const [bmrValue, setBmrValue] = useState(0)
  const [palValue, setPalValue] = useState(0)
  const [neatValue, setNeatValue] = useState(0)
  const [teaValue, setTeaValue] = useState(0)
  const [tdeeValue, setTdeeValue] = useState(0)

  const [sleepTime, setSleepTime] = useState('')
  const [sleepTimeXPar, setSleepTimeXPar] = useState(0)
  const [sleepPal, setSleepPal] = useState(0)

  const [tvTime, setTvTime] = useState('')
  const [tvTimeXPar, setTvTimeXPar] = useState(0)
  const [tvPal, setTvPal] = useState(0)
  const [tvTefFactor, setTvTefFactor] = useState(true)
  const [tvActivityFactor, setTvActivityFactor] = useState(true)

  const [dressingTime, setDressingTime] = useState(0)
  const [dressingTimeXPar, setDressingTimeXPar] = useState(0)
  const [dressingPal, setDressingPal] = useState(0)
  const [dressingTefFactor, setDressingTefFactor] = useState(true)
  const [dressingActivityFactor, setDressingActivityFactor] = useState(true)

  const [cookingTime, setCookingTime] = useState(0)
  const [cookingTimeXPar, setCookingTimeXPar] = useState(0)
  const [cookingPal, setCookingPal] = useState(0)
  const [cookingTefFactor, setCookingTefFactor] = useState(true)
  const [cookingActivityFactor, setCookingActivityFactor] = useState(true)

  const [houseHoldWorkTime, setHouseHoldWorkTime] = useState(0)
  const [houseHoldWorkTimeXPar, setHouseHoldWorkTimeXPar] = useState(0)
  const [houseHoldWorkPal, setHouseHoldWorkPal] = useState(0)
  const [houseHoldWorkTefFactor, setHouseHoldWorkTefFactor] = useState(true)
  const [houseHoldWorkActivityFactor, setHouseHoldWorkActivityFactor] = useState(true)

  const [eatingTime, setEatingTime] = useState(0)
  const [eatingTimeXPar, setEatingTimeXPar] = useState(0)
  const [eatingPal, setEatingPal] = useState(0)
  const [eatingTefFactor, setEatingTefFactor] = useState(true)
  const [eatingActivityFactor, setEatingActivityFactor] = useState(true)

  const [drivingCarTime, setDrivingCarTime] = useState(0)
  const [drivingCarTimeXPar, setDrivingCarTimeXPar] = useState(0)
  const [drivingCarPal, setDrivingCarPal] = useState(0)
  const [drivingCarTefFactor, setDrivingCarTefFactor] = useState(true)
  const [drivingCarActivityFactor, setDrivingCarActivityFactor] = useState(true)

  const [ridingBusTime, setRidingBusTime] = useState(0)
  const [ridingBusTimeXPar, setRidingBusTimeXPar] = useState(0)
  const [ridingBusPal, setRidingBusPal] = useState(0)
  const [ridingBusTefFactor, setRidingBusTefFactor] = useState(true)
  const [ridingBusActivityFactor, setRidingBusActivityFactor] = useState(true)

  const [sittingWorkTime, setSittingWorkTime] = useState(0)
  const [sittingWorkTimeXPar, setSittingWorkTimeXPar] = useState(0)
  const [sittingWorkPal, setSittingWorkPal] = useState(0)
  const [sittingWorkTefFactor, setSittingWorkTefFactor] = useState(true)
  const [sittingWorkActivityFactor, setSittingWorkActivityFactor] = useState(true)

  const [standingWorkTime, setStandingWorkTime] = useState(0)
  const [standingWorkTimeXPar, setStandingWorkTimeXPar] = useState(0)
  const [standingWorkPal, setStandingWorkPal] = useState(0)
  const [standingWorkTefFactor, setStandingWorkTefFactor] = useState(true)
  const [standingWorkActivityFactor, setStandingWorkActivityFactor] = useState(true)

  const [intensiveWorkTime, setIntensiveWorkTime] = useState(0)
  const [intensiveWorkTimeXPar, setIntensiveWorkTimeXPar] = useState(0)
  const [intensiveWorkPal, setIntensiveWorkPal] = useState(0)
  const [intensiveWorkTefFactor, setIntensiveWorkTefFactor] = useState(true)
  const [intensiveWorkActivityFactor, setIntensiveWorkActivityFactor] = useState(true)

  const [walkingTime, setWalkingTime] = useState(0)
  const [walkingTimeXPar, setWalkingTimeXPar] = useState(0)
  const [walkingPal, setWalkingPal] = useState(0)
  const [walkingTefFactor, setWalkingTefFactor] = useState(true)
  const [walkingActivityFactor, setWalkingActivityFactor] = useState(true)

  const [lightExerciseTime, setLightExerciseTime] = useState(0)
  const [lightExerciseTimeXPar, setLightExerciseTimeXPar] = useState(0)
  const [lightExercisePal, setLightExercisePal] = useState(0)
  const [lightExerciseTefFactor, setLightExerciseTefFactor] = useState(true)
  const [lightExerciseActivityFactor, setLightExerciseActivityFactor] = useState(true)

  const [mediumExerciseTime, setMediumExerciseTime] = useState(0)
  const [mediumExerciseTimeXPar, setMediumExerciseTimeXPar] = useState(0)
  const [mediumExercisePal, setMediumExercisePal] = useState(0)
  const [mediumExerciseTefFactor, setMediumExerciseTefFactor] = useState(true)
  const [mediumExerciseActivityFactor, setMediumExerciseActivityFactor] = useState(true)

  const [intensiveExerciseTime, setIntensiveExerciseTime] = useState(0)
  const [intensiveExerciseTimeXPar, setIntensiveExerciseTimeXPar] = useState(0)
  const [intensiveExercisePal, setIntensiveExercisePal] = useState(0)
  const [intensiveExerciseTefFactor, setIntensiveExerciseTefFactor] = useState(true)
  const [intensiveExerciseActivityFactor, setIntensiveExerciseActivityFactor] = useState(true)

  // Total Non Aerobic Activity = TNAA
  const [tnaaTime, setTnaaTime] = useState(0)
  const [tnaaPal, setTnaaPal] = useState(0)
  const [tnaaTef, setTnaaTef] = useState(0)
  const [tnaaActivity, setTnaaActivity] = useState(0)

  // Total Aerobic Excercise = TAE
  const [taeTime, setTaeTime] = useState(0)
  const [taePal, setTaePal] = useState(0)
  const [taeTef, setTaeTef] = useState(0)
  const [taeActivity, setTaeActivity] = useState(0)

  // Total
  const [totalTime, setTotalTime] = useState(0)
  const [totalPal, setTotalPal] = useState(0)
  const [totalTef, setTotalTef] = useState(0)
  const [totalActivity, setTotalActivity] = useState(0)

  useEffect(() => {
    figureFields.map(item => {
      if (item.figure_key === 'NeatFactor') {
        const value = item.sources.filter(source => source.source_key === "ActivityFactors24H")[0]
        setNeatFactorValue(value.converted_value)
      } else if (item.figure_key === 'TeaFactor') {
        const value = item.sources.filter(source => source.source_key === "ActivityFactors24H")[0]
        setTeaFactorValue(value.converted_value)
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

  const submitOnCloseModal = async () => {
    //custom to fixed function to avoid rounding numbers(one state is 3 decimals another is 2)
    const updatedNeatFactor = tnaaActivity.toFixed(2)
    const updatedTeaFactor = taeActivity.toFixed(2)
    if ((+updatedNeatFactor !== neatFactorValue) || (+updatedTeaFactor !== teaFactorValue)) {
      // setLoading(true)
      if (totalTime === 24) {
        setLoading(true)
        const fieldValues = [
          { key_name: 'Sleep', key_value: sleepTime || null },
          { key_name: 'NeatItem1', key_value: tvTime || null },
          { key_name: 'NeatItem2', key_value: dressingTime || null },
          { key_name: 'NeatItem3', key_value: cookingTime || null },
          { key_name: 'NeatItem4', key_value: houseHoldWorkTime || null },
          { key_name: 'NeatItem5', key_value: eatingTime || null },
          { key_name: 'NeatItem6', key_value: drivingCarTime || null },
          { key_name: 'NeatItem7', key_value: ridingBusTime || null },
          { key_name: 'NeatItem8', key_value: sittingWorkTime || null },
          { key_name: 'NeatItem9', key_value: standingWorkTime || null },
          { key_name: 'NeatItem10', key_value: intensiveWorkTime || null },
          { key_name: 'TeaItem1', key_value: walkingTime || null },
          { key_name: 'TeaItem2', key_value: lightExerciseTime || null },
          { key_name: 'TeaItem3', key_value: mediumExerciseTime || null },
          { key_name: 'TeaItem4', key_value: intensiveExerciseTime || null },
        ]

        const values = {
          clinic_id: clinicId,
          token,
          visit_id: visitId,
          field_values: JSON.stringify(fieldValues)
        }

        try {
          await visitService.editCalcActivity24h(values)
          await revalidate()
        } catch (e) {
          return toast.error(T[showErrorMessage(e.message)])
        }
        setLoading(false)
      }
    }
  }

  const ModalRow = (
    {
      value,
      time,
      setTime,
      timeXPar,
      setTimeXPar,
      pal,
      setPal,
      tefFactor,
      setTefFactor,
      activityFactor,
      setActivityFactor,
      firstChild
    }
  ) => {
    if(!isValidating) {
      const defaultTime = value.calculator_field_value
      setTime(time || (+defaultTime).toFixed(1))
    }

    setTimeXPar((time || value.calculator_field_value) * value.par_value)
    setPal(((time || value.calculator_field_value) * value.par_value / 24).toFixed(2))

    if (!firstChild) {
      const tefValue = (0.1 / (24 - sleepTime) * (+time || value.calculator_field_value)).toFixed(3)
      setTefFactor(time !== '0.0' ? tefValue : '0.000')
      const activityValue = (value.par_value - 1) * (+time || value.calculator_field_value) / 24 - (+tefValue)
      setActivityFactor(time !== '0.0' ? activityValue.toFixed(3) : '0.000')
    }

    //TNAA calculations
    setTnaaTime((+sleepTime) + (+tvTime) + (+dressingTime) + (+cookingTime) + (+houseHoldWorkTime) + (+eatingTime) + (+drivingCarTime) + (+ridingBusTime) + (+sittingWorkTime) + (+standingWorkTime) + (+intensiveWorkTime))
    setTnaaPal((+sleepPal) + (+tvPal) + (+dressingPal) + (+cookingPal) + (+houseHoldWorkPal) + (+eatingPal) + (+drivingCarPal) + (+ridingBusPal) + (+sittingWorkPal) + (+standingWorkPal) + (+intensiveWorkPal))
    setTnaaTef((+tvTefFactor) + (+dressingTefFactor) + (+cookingTefFactor) + (+houseHoldWorkTefFactor) + (+eatingTefFactor) + (+drivingCarTefFactor) + (+ridingBusTefFactor) + (+sittingWorkTefFactor) + (+standingWorkTefFactor) + (+intensiveWorkTefFactor))
    setTnaaActivity((+tvActivityFactor) + (+dressingActivityFactor) + (+cookingActivityFactor) + (+houseHoldWorkActivityFactor) + (+eatingActivityFactor) + (+drivingCarActivityFactor) + (+ridingBusActivityFactor) + (+sittingWorkActivityFactor) + (+standingWorkActivityFactor) + (+intensiveWorkActivityFactor))

    //  TAE Calculations
    setTaeTime((+walkingTime) + (+lightExerciseTime) + (+mediumExerciseTime) + (+intensiveExerciseTime))
    setTaePal((+walkingPal) + (+lightExercisePal) + (+mediumExercisePal) + (+intensiveExercisePal))
    setTaeTef((+walkingTefFactor) + (+lightExerciseTefFactor) + (+mediumExerciseTefFactor) + (+mediumExerciseTefFactor))
    setTaeActivity((+walkingActivityFactor) + (+lightExerciseActivityFactor) + (+mediumExerciseActivityFactor) + (+intensiveExerciseActivityFactor))

    //  Total Calculations
    setTotalTime(tnaaTime + taeTime)
    setTotalPal(tnaaPal + taePal)
    setTotalTef(tnaaTef + taeTef)
    setTotalActivity(tnaaActivity + taeActivity)

    return (
      <div className="flex mb-3">
        <p className="w-64 flex items-center">
          {T[value.calculator_field_trans_key]}
        </p>
        <div className="w-24 mx-1">
          <input
            className="form-control"
            defaultValue={time}
            onBlur={(e) => {
              const val = +e.target.value
              const zero = 0
              let formattedVal = val ? val.toFixed(1) : zero.toFixed(1)
              setTime(formattedVal)
            }}
          />
        </div>
        <div className="w-24 mx-1">
          <input
            className="form-control"
            value={value.par_value.toFixed(1)}
            disabled={true}
          />
        </div>
        <div className="w-24 mx-1">
          <input
            className="form-control"
            value={timeXPar.toFixed(1)}
            disabled={true}
          />
        </div>
        <div className="w-24 mx-1">
          <input
            className="form-control"
            value={pal}
            disabled={true}
          />
        </div>
        <div className="w-24 mx-1">
          <input
            className="form-control"
            value={tefFactor ? tefFactor : ''}
            disabled={true}
          />
        </div>
        <div className="w-24 mx-1">
          <input
            className="form-control"
            value={activityFactor ? activityFactor : ''}
            disabled={true}
          />
        </div>
      </div>
    )
  }

  const ModalSumRow = ({ header, timeTotal, palTotal, tefTotal, activityTotal, totalSum }) => (
    <div className="flex mb-3">
      <p className="w-64 flex items-center font-bold">
        {header}
      </p>
      <div className="w-24 mx-1">
        <input
          className={`form-control font-bold ${totalSum && totalTime !== 24 && `border border-red-500`}`}
          value={Number(timeTotal).toFixed(1)}
          disabled={true}
        />
      </div>
      <div className="w-24 mx-1">
        <input
          className="form-control font-bold"
          value={""}
          disabled={true}
        />
      </div>
      <div className="w-24 mx-1">
        <input
          className="form-control font-bold"
          value={""}
          disabled={true}
        />
      </div>
      <div className="w-24 mx-1">
        <input
          className="form-control font-bold"
          value={Number(palTotal).toFixed(2)}
          disabled={true}
        />
      </div>
      <div className="w-24 mx-1">
        <input
          className="form-control font-bold"
          value={Number(tefTotal).toFixed(2)}
          disabled={true}
        />
      </div>
      <div className="w-24 mx-1">
        <input
          className="form-control font-bold"
          value={Number(activityTotal).toFixed(2)}
          disabled={true}
        />
      </div>
    </div>
  )

  return (
    <Modal
      modalIsOpen={showModal}
      onCloseModal={() => {
        setShowModal(false)
        setSelectedSourceKey('')
        setModalType('')
        submitOnCloseModal()
      }}
      activityFactors={true}
      header={T['Db.Source.ActivityFactors24H.Name']}
    >
      {!data ? <ContainerLoader/> :
        <>
          <ReactTooltip place="right"/>
          <div className="lg:overflow-hidden overflow-x-scroll w-full">
            <div className="flex mt-5 text-sm mb-3" style={{minWidth: '720px'}}>
              <div className="w-64 flex items-end">
                <span className="underline">{T['Modal.Activity24h.ActivityNameHeader.Caption']}</span>
              </div>
              <div className="flex items-end justify-center text-center w-24 mx-1">
                {T['Modal.Activity24h.TimeHeader.Caption']}
              </div>
              <div className="flex items-end justify-center text-center w-24 mx-1">
                {T['Modal.Activity24h.ParHeader.Caption']}
              </div>
              <div className="flex items-end justify-center text-center w-24 mx-1">
                {T['Modal.Activity24h.TimeXParHeader.Caption']}
              </div>
              <div className="flex items-end justify-center text-center w-24 mx-1">
                {T['Modal.Activity24h.PalHeader.Caption']}
              </div>
              <div className="flex items-end justify-center text-center w-24 mx-1">
                {T['Modal.Activity24h.TefFactorHeader.Caption']}
              </div>
              <div className="flex items-end justify-center text-center w-24 mx-1">
                {T['Modal.Activity24h.ActivityFactorHeader.Caption']}
              </div>
            </div>
            <div style={{minWidth: '720px'}}>
              <ModalRow
                firstChild={true}
                value={data[0]}
                time={sleepTime}
                setTime={setSleepTime}
                timeXPar={sleepTimeXPar}
                setTimeXPar={setSleepTimeXPar}
                pal={sleepPal}
                setPal={setSleepPal}
              />
              <ModalRow
                value={data[1]}
                time={tvTime}
                setTime={setTvTime}
                timeXPar={tvTimeXPar}
                setTimeXPar={setTvTimeXPar}
                tefFactor={tvTefFactor}
                setTefFactor={setTvTefFactor}
                activityFactor={tvActivityFactor}
                setActivityFactor={setTvActivityFactor}
                pal={tvPal}
                setPal={setTvPal}
              />
              <ModalRow
                value={data[2]}
                time={dressingTime}
                setTime={setDressingTime}
                timeXPar={dressingTimeXPar}
                setTimeXPar={setDressingTimeXPar}
                tefFactor={dressingTefFactor}
                setTefFactor={setDressingTefFactor}
                activityFactor={dressingActivityFactor}
                setActivityFactor={setDressingActivityFactor}
                pal={dressingPal}
                setPal={setDressingPal}
              />
              <ModalRow
                value={data[3]}
                time={cookingTime}
                setTime={setCookingTime}
                timeXPar={cookingTimeXPar}
                setTimeXPar={setCookingTimeXPar}
                tefFactor={cookingTefFactor}
                setTefFactor={setCookingTefFactor}
                activityFactor={cookingActivityFactor}
                setActivityFactor={setCookingActivityFactor}
                pal={cookingPal}
                setPal={setCookingPal}
              />
              <ModalRow
                value={data[4]}
                time={houseHoldWorkTime}
                setTime={setHouseHoldWorkTime}
                timeXPar={houseHoldWorkTimeXPar}
                setTimeXPar={setHouseHoldWorkTimeXPar}
                tefFactor={houseHoldWorkTefFactor}
                setTefFactor={setHouseHoldWorkTefFactor}
                activityFactor={houseHoldWorkActivityFactor}
                setActivityFactor={setHouseHoldWorkActivityFactor}
                pal={houseHoldWorkPal}
                setPal={setHouseHoldWorkPal}
              />
              <ModalRow
                value={data[5]}
                time={eatingTime}
                setTime={setEatingTime}
                timeXPar={eatingTimeXPar}
                setTimeXPar={setEatingTimeXPar}
                tefFactor={eatingTefFactor}
                setTefFactor={setEatingTefFactor}
                activityFactor={eatingActivityFactor}
                setActivityFactor={setEatingActivityFactor}
                pal={eatingPal}
                setPal={setEatingPal}
              />
              <ModalRow
                value={data[6]}
                time={drivingCarTime}
                setTime={setDrivingCarTime}
                timeXPar={drivingCarTimeXPar}
                setTimeXPar={setDrivingCarTimeXPar}
                tefFactor={drivingCarTefFactor}
                setTefFactor={setDrivingCarTefFactor}
                activityFactor={drivingCarActivityFactor}
                setActivityFactor={setDrivingCarActivityFactor}
                pal={drivingCarPal}
                setPal={setDrivingCarPal}
              />
              <ModalRow
                value={data[7]}
                time={ridingBusTime}
                setTime={setRidingBusTime}
                timeXPar={ridingBusTimeXPar}
                setTimeXPar={setRidingBusTimeXPar}
                tefFactor={ridingBusTefFactor}
                setTefFactor={setRidingBusTefFactor}
                activityFactor={ridingBusActivityFactor}
                setActivityFactor={setRidingBusActivityFactor}
                pal={ridingBusPal}
                setPal={setRidingBusPal}
              />
              <ModalRow
                value={data[8]}
                time={sittingWorkTime}
                setTime={setSittingWorkTime}
                timeXPar={sittingWorkTimeXPar}
                setTimeXPar={setSittingWorkTimeXPar}
                tefFactor={sittingWorkTefFactor}
                setTefFactor={setSittingWorkTefFactor}
                activityFactor={sittingWorkActivityFactor}
                setActivityFactor={setSittingWorkActivityFactor}
                pal={sittingWorkPal}
                setPal={setSittingWorkPal}
              />
              <ModalRow
                value={data[9]}
                time={standingWorkTime}
                setTime={setStandingWorkTime}
                timeXPar={standingWorkTimeXPar}
                setTimeXPar={setStandingWorkTimeXPar}
                tefFactor={standingWorkTefFactor}
                setTefFactor={setStandingWorkTefFactor}
                activityFactor={standingWorkActivityFactor}
                setActivityFactor={setStandingWorkActivityFactor}
                pal={standingWorkPal}
                setPal={setStandingWorkPal}
              />
              <ModalRow
                value={data[10]}
                time={intensiveWorkTime}
                setTime={setIntensiveWorkTime}
                timeXPar={intensiveWorkTimeXPar}
                setTimeXPar={setIntensiveWorkTimeXPar}
                tefFactor={intensiveWorkTefFactor}
                setTefFactor={setIntensiveWorkTefFactor}
                activityFactor={intensiveWorkActivityFactor}
                setActivityFactor={setIntensiveWorkActivityFactor}
                pal={intensiveWorkPal}
                setPal={setIntensiveWorkPal}
              />
              <ModalSumRow
                header={T['Modal.Activity24h.NeatTotal.Caption']}
                timeTotal={tnaaTime}
                palTotal={tnaaPal}
                tefTotal={tnaaTef}
                activityTotal={tnaaActivity}
              />
              <div className="mb-10"/>
              <ModalRow
                value={data[11]}
                time={walkingTime}
                setTime={setWalkingTime}
                timeXPar={walkingTimeXPar}
                setTimeXPar={setWalkingTimeXPar}
                tefFactor={walkingTefFactor}
                setTefFactor={setWalkingTefFactor}
                activityFactor={walkingActivityFactor}
                setActivityFactor={setWalkingActivityFactor}
                pal={walkingPal}
                setPal={setWalkingPal}
              />
              <ModalRow
                value={data[12]}
                time={lightExerciseTime}
                setTime={setLightExerciseTime}
                timeXPar={lightExerciseTimeXPar}
                setTimeXPar={setLightExerciseTimeXPar}
                tefFactor={lightExerciseTefFactor}
                setTefFactor={setLightExerciseTefFactor}
                activityFactor={lightExerciseActivityFactor}
                setActivityFactor={setLightExerciseActivityFactor}
                pal={lightExercisePal}
                setPal={setLightExercisePal}
              />
              <ModalRow
                value={data[13]}
                time={mediumExerciseTime}
                setTime={setMediumExerciseTime}
                timeXPar={mediumExerciseTimeXPar}
                setTimeXPar={setMediumExerciseTimeXPar}
                tefFactor={mediumExerciseTefFactor}
                setTefFactor={setMediumExerciseTefFactor}
                activityFactor={mediumExerciseActivityFactor}
                setActivityFactor={setMediumExerciseActivityFactor}
                pal={mediumExercisePal}
                setPal={setMediumExercisePal}
              />
              <ModalRow
                value={data[14]}
                time={intensiveExerciseTime}
                setTime={setIntensiveExerciseTime}
                timeXPar={intensiveExerciseTimeXPar}
                setTimeXPar={setIntensiveExerciseTimeXPar}
                tefFactor={intensiveExerciseTefFactor}
                setTefFactor={setIntensiveExerciseTefFactor}
                activityFactor={intensiveExerciseActivityFactor}
                setActivityFactor={setIntensiveExerciseActivityFactor}
                pal={intensiveExercisePal}
                setPal={setIntensiveExercisePal}
              />
              <ModalSumRow
                header={T['Modal.Activity24h.TeaTotal.Caption']}
                timeTotal={taeTime}
                palTotal={taePal}
                tefTotal={taeTef}
                activityTotal={taeActivity}
              />
              <div className="mb-10"/>
              <ModalSumRow
                header={T['Modal.Activity24h.Total.Caption']}
                timeTotal={totalTime}
                palTotal={totalPal}
                tefTotal={totalTef}
                activityTotal={totalActivity}
                totalSum={totalTime !== 0 && true}
              />
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
          <div className="flex items-center mb-3 mt-5">
            <h5
              className="w-52 cursor-pointer flex"
              data-tip={T['Db.FigureField.NeatFactor.Description']}
            >
              {T['Db.FigureField.NeatFactor.Name']}
            </h5>
            <input
              className="form-control text-base w-28"
              value={tnaaActivity?.toFixed(2) || neatFactorValue}
              disabled={true}
            />
          </div>
          <div className="flex items-center mb-3">
            <h5
              className="w-52 cursor-pointer flex"
              data-tip={T['Db.FigureField.TeaFactor.Description']}
            >
              {T['Db.FigureField.TeaFactor.Name']}
            </h5>
            <input
              className="form-control text-base w-28"
              value={taeActivity?.toFixed(2) || teaFactorValue}
              disabled={true}
            />
          </div>
          {/*quick calculations*/}
          <div className="border-bottom border-bottom-gray mt-8">
            <div className="mb-3 flex">
              <h5 className="text-bold">{T['Modal.Activity24h.QuickCalculations.Caption']}</h5>
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
                = {T['Modal.Activity24h.PalFormula.Caption']}
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
                = {T['Modal.Activity24h.NeatFormula.Caption']}
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
                = {T['Modal.Activity24h.TeaFormula.Caption']}
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
                = {T['Modal.Activity24h.TdeeFormula.Caption']}
              </label>
            </div>
          </div>
        </>
      }
    </Modal>
  )
}

export default React.memo(ActivityFactors24hModal)