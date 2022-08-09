export const required = (value) => (value ? undefined : 'Required')

export const mustBeNumber = (value) =>
  isNaN(value) ? 'Must be a number' : undefined

export const minValue = (min) => (value) => {
  const numStr = (`${value}`.match(/\d+|\./g) || []).join('')
  if (numStr === '') {
    return undefined
  }
  const num = +numStr

  return isNaN(num) || num >= min ? undefined : `Should be greater than ${min}`
}

export const minLength = (min) => (value) => {
  return `${value}`.length < min ? `Min length is ${min}` : undefined
}

export const maxLength = (max) => (value) => {
  return `${value}`.length > max ? `Max length is ${max}` : undefined
}

export const maxValue = (max) => (value) => {
  const numStr = (`${value}`.match(/\d+|\./g) || []).join('')
  if (numStr === '') {
    return undefined
  }
  const num = +numStr

  return isNaN(num) || num <= max ? undefined : `Should be less than ${max}`
}

export const composeValidators = (...validators) => (value) =>
  validators.reduce((error, validator) => error || validator(value), undefined)

export const emailValidation = (value) => {
  const match = `${value}`.match(
    /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
  )
  return match ? undefined : 'Please enter a valid email'
}
