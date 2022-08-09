import { BASE_URL_HOST } from '@common/constants'
import VisitTextField from '@components/forms/visit-text-field'
import VisitCheckbox from '@components/forms/visit-checkbox'
import VisitRow from '@components/visit-row'
import React from 'react'
import moment from 'moment'
import VisitReports from '@components/visit-row/reports'

export const renderDisplayRole = (item, T) => {
  let roleTranslated
  switch (item) {
    case "Viewer":
      roleTranslated = T['Db.MemberRole.Viewer']
      break
    case "Scheduler":
      roleTranslated = T['Db.MemberRole.Scheduler']
      break
    case "Therapist":
      roleTranslated = T['Db.MemberRole.Therapist']
      break
    case "Admin":
      roleTranslated = T['Db.MemberRole.Admin']
      break
  }

  return roleTranslated
}

export const uploadImage = async (file, token, url) => {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function () {
      var file_base64 = reader.result
      var body = { "token": token, "filename": file.name, "image_base64": file_base64 }
      var xhr = new XMLHttpRequest()
      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          resolve(JSON.parse(xhr.response))
        } else {
          reject({
            status: this.status,
            statusText: xhr.statusText
          })
        }
      }
      xhr.onerror = function () {
        reject({
          status: this.status,
          statusText: xhr.statusText
        })
      }
      xhr.open("POST", `${BASE_URL_HOST}/${url}`)
      xhr.setRequestHeader("Content-type", "application/json")
      xhr.send(JSON.stringify(body))
    }
  })
}

export const showErrorMessage = (message) => {
  const errorMessage = message.split(' ')[1] || message

  return errorMessage
}

export const renderClinicPlan = (name, displayName) => {
  let clinicPlan

  switch (name) {
    case "Free":
      clinicPlan = (<div
        style={{ backgroundColor: 'grey', color: 'white', border: '1px solid white' }}
        className="text-center font-weight-bold"
      >
        {displayName}
      </div>)
      break;
    case "Home":
      clinicPlan = (<div
        style={{ backgroundColor: '#0070c0', color: '#25c6ff', border: '1px solid #25c6ff' }}
        className="text-center font-weight-bold"
      >
        {displayName}
      </div>)
      break;
    case "Pro":
      clinicPlan = (<div
        style={{ backgroundColor: '#bf8f00', color: '#ffff00', border: '1px solid #ffff00' }}
        className="text-center font-weight-bold"
      >
        {displayName}
      </div>)
      break;
  }

  return clinicPlan
}

export const getMaxDate = () => {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();

  return today = yyyy + '-' + mm + '-' + dd;
}

export const validationOnBlur = (e, defaultValue, input, handleSubmit, numeric = false) => {
  const inputValue = numeric ? +e.target.value : e.target.value
  const defaultState = defaultValue || ""

  if (inputValue !== defaultState) {
    input.onChange(e)
    handleSubmit()
  }
}

export const validationCheckBoxOnBlur = (e, defaultValue, input, handleSubmit) => {
  if (e.target.value !== defaultValue) {
    input.onChange(e)
    handleSubmit()
  }
}

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const validateTimeOnBlur = (value, visitTime, formatType, handleSubmit) => {
  const formattedTime = moment(value).format("HH:mm:ss")
  if (formattedTime !== visitTime) {
    handleSubmit()
  }
}

export function onClickOutsideRef(ref, showSelect, setShowSelect) {
  function handleClickOutside(event) {
    if (ref.current && !ref.current.contains(event.target) && showSelect) {
      setShowSelect(false)
    }
  }

  document.addEventListener("mousedown", handleClickOutside)
  return () => {
    document.removeEventListener("mousedown", handleClickOutside)
  }
}

export const renderBoxFieldType = (items, translations, loading, setLoading, clinicId, token, id, revalidate) => {
  return items.map((item, idx) => {
    if (item.box_type_key === "TextFields") {
      return (
        <div key={idx}>
          <VisitTextField
            data={item}
            translations={translations}
            loading={loading}
            setLoading={setLoading}
            clinicId={clinicId}
            token={token}
            visitId={id}
            revalidate={revalidate}
          />
        </div>
      )
    } else if (item.box_type_key === "Labels") {
      return (
        <div key={idx}>
          <VisitCheckbox
            data={item}
            translations={translations}
            loading={loading}
            setLoading={setLoading}
            clinicId={clinicId}
            token={token}
            visitId={id}
            revalidate={revalidate}
          />
        </div>
      )
    } else if (item.box_type_key === "FigureFields") {
      return (
        <div key={idx}>
          <VisitRow
            data={item}
            translations={translations}
            loading={loading}
            setLoading={setLoading}
            clinicId={clinicId}
            token={token}
            visitId={id}
            revalidate={revalidate}
          />
        </div>
      )
    } else if(item.box_type_key === "Reports") {
      return (
        <div key={idx}>
          <VisitReports
            data={item}
            translations={translations}
            loading={loading}
            setLoading={setLoading}
            clinicId={clinicId}
            token={token}
            visitId={id}
            revalidate={revalidate}
          />
        </div>
      )
    }
  })
}

export const renderAttachedSourceIcon = (type) => {
  switch (type) {
    case "Formula":
      return "fas fa-info-circle w-5 text-center"
      break;
    case "EditableFormula":
      return "fas fa-calculator w-5 text-center"
      break;
    case "SystemValue":
      return "fas fa-info-circle w-5 text-center"
      break;
    case "Calculator":
      return "fas fa-calculator w-5 text-center"
      break;
    case "Ranker":
      return "fas fa-chart-bar w-5 text-center"
      break;
    case "LinkedVisit":
      return "far fa-file-alt w-5 text-center"
      break;
    case "LinkedFigure":
      return "far fa-file-alt w-5 text-center"
      break;
  }
}

export const renderSelectedSource = (
  setShowSourceSelect,
  T,
  sources,
  sourceKey,
  figureKey,
  setModalType,
  setSelectedSourceKey,
  lang
) => {
  return sources.map((source, idx) => (
    source.source_key === sourceKey && (
      <p
        key={idx}
        className="text-sm cursor-pointer text-gray lg:w-96 w-80 flex relative"
        style={{ minWidth: '356px', border: '1px solid lightgray', padding: '2px 7px' }}
      >
        <span
          onClick={() => setShowSourceSelect(figureKey)}
        >
          {T['Page.VisitDetails.SourceRefer.Caption']}
        </span> {' '}
        <span
          className={`text-primary hover:underline text-sm ${lang === 'Heb' && 'text-right'}`}
          onClick={() => {
            renderModalTypeBySource(source, setModalType)
            setSelectedSourceKey(sourceKey)
          }}
          >
          <i className={renderAttachedSourceIcon(source.source_type_key)}/> {' '}
            {T[source.source_short_trans_key]}
        </span>
        <i
          className={`absolute fas fa-angle-down py-1.5 -top-0.5  ${lang === 'Heb' ? 'left-1 pr-40' : 'right-1 pl-40'}`}
          onClick={() => setShowSourceSelect(figureKey)}
        />
      </p>
    )
  ))
}

export const renderModalTypeBySource = (source, setModalType) => {
  console.log(source)
  if (source.source_key === 'ActivityFactorsBars') {
    renderSourceTypeModal('ActivityFactorsBars', setModalType)
  } else if (source.source_key === 'ActivityFactors24H') {
    renderSourceTypeModal('ActivityFactors24H', setModalType)
  } else if (source.source_key === 'ExercisePlan') {
    renderSourceTypeModal('ExercisePlan', setModalType)
  } else if (source.source_key === 'ExerciseSheet') {
    renderSourceTypeModal('ExerciseSheet', setModalType)
  } else if (source.source_key === 'EatingPlan') {
    renderSourceTypeModal('EatingPlan', setModalType)
  }else if (source.source_key === 'EatingLog') {
    renderSourceTypeModal('EatingLog', setModalType)
  } else {
    renderSourceTypeModal(source.source_type_key, setModalType)
  }
}

export const renderSourceTypeModal = (type, setModalType) => {
  switch (type) {
    case 'Formula':
      return setModalType('Formula')
      break
    case 'EditableFormula':
      return setModalType('EditableFormula')
      break
    case 'Ranker':
      return setModalType('Ranker')
      break
    case 'ActivityFactorsBars':
      return setModalType('ActivityFactorsBars')
      break
    case 'ActivityFactors24H':
      return setModalType('ActivityFactors24H')
      break
    case 'ExerciseSheet':
      return setModalType('ExerciseSheet')
      break
    case 'ExercisePlan':
      return setModalType('ExercisePlan')
      break
    case 'EatingPlan':
      return setModalType('EatingPlan')
      break
    case 'EatingLog':
      return setModalType('EatingLog')
      break
  }
}

export function toFixed(num, fixed) {
  const re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
  const formattedNum = num.toString().match(re)[0];

  return +formattedNum
}

export const insert = (arr, index, newItem) => [
  // part of the array before the specified index
  ...arr.slice(0, index),
  // inserted item
  newItem,
  // part of the array after the specified index
  ...arr.slice(index)
]
