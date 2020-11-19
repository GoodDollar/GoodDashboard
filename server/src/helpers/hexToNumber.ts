import { hexToNumber, isHex } from 'web3-utils'

export default (number: any, defaultValue: number = 0): number => {
  if (!isHex(number)) {
    return defaultValue
  }

  return hexToNumber(number)
}
