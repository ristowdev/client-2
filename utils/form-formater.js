export function formatCreditCard(value) {
  const digists = `${value || ''}`.match(/\d{0,4}/g)
  if (digists) {
    return digists.filter(Boolean).slice(0, 4).join(' ')
  }
  return ''
}

export function inputNumberFormatter(max, min) {
  return (value) => {
    const digists = `${value || ''}`.match(/\d+/g)
    if (digists) {
      const num = +digists.filter(Boolean).join('')
      if (isNaN(max) && num > max) {
        return max
      }
      if (isNaN(min) && num < min) {
        return min
      }
      return num
    }
    return ''
  }
}
