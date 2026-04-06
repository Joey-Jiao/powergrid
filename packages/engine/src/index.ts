import * as floatModule from './core/float.js'
import * as integerModule from './core/integer.js'

const float = {
  analyze: floatModule.analyze,
}

const integer = {
  addition: integerModule.addition,
  subtraction: integerModule.subtraction,
  toBinary: integerModule.toBinary,
  fromBinary: integerModule.fromBinary,
}

export { float, integer }
export type { FloatAnalysis } from './core/float.js'
export type { OverflowTable } from './core/integer.js'
