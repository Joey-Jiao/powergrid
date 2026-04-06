/**
 * Integer Arithmetic with Overflow Detection (Two's Complement)
 */

interface OverflowTable {
  /** Number of bits */
  bits: number
  /** Minimum representable value */
  min: number
  /** Maximum representable value */
  max: number
  /** Result matrix [i][j] = operation(i, j) with overflow handling */
  results: number[][]
  /** Overflow indicator: 1 = positive overflow, -1 = negative overflow, 0 = no overflow */
  overflow: number[][]
  /** Convert matrix index to actual integer value */
  indexToValue: (index: number) => number
  /** Convert integer value to matrix index */
  valueToIndex: (value: number) => number
}

/**
 * Generate addition overflow table for k-bit signed integers
 */
function addition(k: number): OverflowTable {
  const min = -Math.pow(2, k - 1)
  const max = Math.pow(2, k - 1) - 1
  const size = Math.pow(2, k)
  const wrapConstant = Math.pow(2, k)

  const indexToValue = (index: number): number => index + min
  const valueToIndex = (value: number): number => value - min

  const results: number[][] = Array.from({ length: size }, () => Array(size).fill(0))
  const overflow: number[][] = Array.from({ length: size }, () => Array(size).fill(0))

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const x = indexToValue(i)
      const y = indexToValue(j)
      const sum = x + y

      if (sum > max) {
        results[i][j] = sum - wrapConstant
        overflow[i][j] = 1
      } else if (sum < min) {
        results[i][j] = sum + wrapConstant
        overflow[i][j] = -1
      } else {
        results[i][j] = sum
        overflow[i][j] = 0
      }
    }
  }

  return { bits: k, min, max, results, overflow, indexToValue, valueToIndex }
}

/**
 * Generate subtraction overflow table for k-bit signed integers
 */
function subtraction(k: number): OverflowTable {
  const min = -Math.pow(2, k - 1)
  const max = Math.pow(2, k - 1) - 1
  const size = Math.pow(2, k)
  const wrapConstant = Math.pow(2, k)

  const indexToValue = (index: number): number => index + min
  const valueToIndex = (value: number): number => value - min

  const results: number[][] = Array.from({ length: size }, () => Array(size).fill(0))
  const overflow: number[][] = Array.from({ length: size }, () => Array(size).fill(0))

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const x = indexToValue(i)
      const y = indexToValue(j)
      const diff = x - y

      if (diff > max) {
        results[i][j] = diff - wrapConstant
        overflow[i][j] = 1
      } else if (diff < min) {
        results[i][j] = diff + wrapConstant
        overflow[i][j] = -1
      } else {
        results[i][j] = diff
        overflow[i][j] = 0
      }
    }
  }

  return { bits: k, min, max, results, overflow, indexToValue, valueToIndex }
}

/**
 * Convert signed integer to binary string (two's complement)
 */
function toBinary(n: number, k: number): string {
  const min = -Math.pow(2, k - 1)
  const max = Math.pow(2, k - 1) - 1

  if (n > max || n < min) {
    throw new Error(`Value ${n} out of range for ${k}-bit integer [${min}, ${max}]`)
  }

  if (n >= 0) {
    return n.toString(2).padStart(k, '0')
  } else {
    // Two's complement for negative numbers
    const positive = Math.pow(2, k) + n
    return positive.toString(2).padStart(k, '0')
  }
}

/**
 * Convert binary string (two's complement) to signed integer
 */
function fromBinary(binary: string, k: number): number {
  if (binary.length !== k) {
    throw new Error(`Binary string length ${binary.length} does not match bit count ${k}`)
  }

  const unsigned = parseInt(binary, 2)
  const signBit = binary[0] === '1'

  if (signBit) {
    return unsigned - Math.pow(2, k)
  }
  return unsigned
}

export { addition, subtraction, toBinary, fromBinary }
export type { OverflowTable }
