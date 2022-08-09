import { coreAPI } from '.'
import { BASE_URL_STATIC, BASE_URL_VISIT } from '@common/constants'

export default {
  createVisit(data) {
    return coreAPI.post(`${BASE_URL_VISIT}/CreateVisit`, data)
  },

  submitVisit(data) {
    return coreAPI.post(`${BASE_URL_VISIT}/SubmitVisit`, data)
  },

  deleteVisit(data) {
    return coreAPI.post(`${BASE_URL_VISIT}/DeleteVisit`, data)
  },

  getVisitTypes() {
    return coreAPI.get(`${BASE_URL_STATIC}/visit_types.json`)
  },

  getExerciseActivities() {
    return coreAPI.get(`${BASE_URL_STATIC}/exercise_activities.json`)
  },

  getExerciseSheet(clinicId, visitId, token, type) {
    return coreAPI.get(`${BASE_URL_VISIT}/${type === 'ExerciseSheet' ? '/GetExerciseSheet' : '/GetExercisePlan'}?clinic_id=${clinicId}&visit_id=${visitId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },

  editVisitDetails(data) {
    return coreAPI.post(`${BASE_URL_VISIT}/EditVisitDetails`, data)
  },

  editTextField(data) {
    return coreAPI.post(`${BASE_URL_VISIT}/EditTextField`, data)
  },

  editLabelCheck(data) {
    return coreAPI.post(`${BASE_URL_VISIT}/EditLabelCheck`, data)
  },

  editFigureValue(data) {
    return coreAPI.post(`${BASE_URL_VISIT}/EditFigureValue`, data)
  },

  editFigureUnit(data) {
    return coreAPI.post(`${BASE_URL_VISIT}/EditFigureUnit`, data)
  },

  editFigureIsDisplayed(data) {
    return coreAPI.post(`${BASE_URL_VISIT}/EditFigureIsDisplayed`, data)
  },

  editReportIsDisplayed(data) {
    return coreAPI.post(`${BASE_URL_VISIT}/EditReportIsDisplayed`, data)
  },

  editFigureSource(data) {
    return coreAPI.post(`${BASE_URL_VISIT}/EditFigureSource`, data)
  },

  editSourceIsDisplayed(data) {
    return coreAPI.post(`${BASE_URL_VISIT}/EditSourceIsDisplayed`, data)
  },

  editFormulaFigureValue(data) {
    return coreAPI.post(`${BASE_URL_VISIT}/EditFormulaFigureValue`, data)
  },

  editActivitySliders(data) {
    return coreAPI.post(`${BASE_URL_VISIT}/EditActivitySliders`, data)
  },

  editCalcActivity24h(data) {
    return coreAPI.post(`${BASE_URL_VISIT}/EditCalcActivity24h`, data)
  },

  editExerciseSheet(data, type) {
    return coreAPI.post(`${BASE_URL_VISIT}/${type === 'ExerciseSheet' ? '/EditExerciseSheet' : '/EditExercisePlan'}`, data)
  },

  createFoodSheet(data, token) {
    return coreAPI.post(`${BASE_URL_VISIT}/CreateFoodSheet`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
  },

  deleteFoodSheetRow(data, token) {
    return coreAPI.post(`${BASE_URL_VISIT}/DeleteFoodSheet`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
  },

  editFoodSheetRow(data, token) {
    return coreAPI.post(`${BASE_URL_VISIT}/EditFoodSheet`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
  },

  searchFoodItems(query, token) {
    return coreAPI.get(`${BASE_URL_VISIT}/SearchFoodItems?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
  },

  removeFoodSheetRow(data, token) {
    return coreAPI.post(`${BASE_URL_VISIT}/RemoveFoodSheetRow`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
  },

  addFoodSheetRow(data, token) {
    return coreAPI.post(`${BASE_URL_VISIT}/addFoodSheetRow`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
  }
}
