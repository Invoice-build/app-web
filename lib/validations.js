import Web3 from 'web3'

export function isRequired (field = null) {
  const _field = field ? `${field} ` : ''
  return v => !!v || `${_field}is required`
}

export function isEmail () {
  return v => !v || isEmailCheck(v) || 'Must be a valid email'
}

export const isEmailCheck = email => {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regex.test(String(email).toLowerCase())
}

export function minChar (minLength, field = null) {
  const _field = field ? `${field} ` : ''
  return v => !v || v.length >= minLength || `${_field}must be at least ${minLength} characters`
}

export function isSameAs (val, field) {
  return v => !v || v === val || `must be the same as ${field}`
}

export function isNumber () {
  return v => !v || isNumberCheck(v) || 'must be a valid number'
}
export function isNumberCheck (val) {
  return !isNaN(parseFloat(val)) && isFinite(val)
}

export function isInt () {
  return v => !v || Number.isInteger(parseFloat(v)) || 'must be integer'
}

export function isPositive () {
  return v => !v || isPositiveCheck(v) || 'must be a positive number'
}
export function isPositiveCheck (number) {
  return number >= 0
}

export function isLessThanOrEqualTo (max) {
  return v => !v || parseFloat(v) <= max || `must be less than ${max}`
}

export function maxDecimals (max) {
  return v => !v || decimalsLength(v) <= max || `${max} decimal max`
}
export function decimalsLength (val) {
  if (!val.split('.')[1]) return 0
  return val.split('.')[1].toString().length
}

export function isEthAddr () {
  return v => !v || Web3.utils.isAddress(v) || 'Must be a valid Ethereum address'
}
