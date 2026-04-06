#!/usr/bin/env node
import { Command } from 'commander'
import { float, integer } from './index.js'

const program = new Command()

program
  .name('powergrid')

// Float commands
program
  .command('float')
  .description('Analyze IEEE 754 floating point representation')
  .argument('<k>', 'exponent bits')
  .argument('<n>', 'mantissa bits')
  .option('-v, --verbose', 'show all representable values')
  .action((k: string, n: string, options: { verbose?: boolean }) => {
    const result = float.analyze(Number(k), Number(n))

    console.log('\n[IEEE 754 Float Analysis]')
    console.log(`k=${result.k} (阶码位), n=${result.n} (尾数位)`)
    console.log(`Bias=${result.Bias}, K=${result.K} (阶码个数), N=${result.N} (尾数个数)`)
    console.log(`e: [${result.eRange.min}, ${result.eRange.max}]`)
    console.log(`E: [${result.ERange.min}, ${result.ERange.max}]`)
    console.log(`\n规格化: [${result.normalized.min}, ${result.normalized.max}]`)
    console.log(`非规格化: [${result.denormalized.min}, ${result.denormalized.max}]`)

    if (options.verbose) {
      console.log('\n正数可表示值:')
      console.log(result.positiveValues.join(', '))
    }
  })

// Integer commands
program
  .command('add')
  .description('Integer addition overflow analysis')
  .argument('<k>', 'bits')
  .option('-o, --overflow', 'show overflow cases only')
  .action((k: string, options: { overflow?: boolean }) => {
    const table = integer.addition(Number(k))

    console.log('\n[Integer Addition]')
    console.log(`${k}-bit range: [${table.min}, ${table.max}]`)

    if (options.overflow) {
      console.log('\nOverflow cases:')
      const size = Math.pow(2, Number(k))
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (table.overflow[i][j] !== 0) {
            const x = table.indexToValue(i)
            const y = table.indexToValue(j)
            const type = table.overflow[i][j] === 1 ? '+' : '-'
            console.log(`  ${x} + ${y} = ${table.results[i][j]} (${type}overflow)`)
          }
        }
      }
    }
  })

program
  .command('sub')
  .description('Integer subtraction overflow analysis')
  .argument('<k>', 'bits')
  .option('-o, --overflow', 'show overflow cases only')
  .action((k: string, options: { overflow?: boolean }) => {
    const table = integer.subtraction(Number(k))

    console.log('\n[Integer Subtraction]')
    console.log(`${k}-bit range: [${table.min}, ${table.max}]`)

    if (options.overflow) {
      console.log('\nOverflow cases:')
      const size = Math.pow(2, Number(k))
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (table.overflow[i][j] !== 0) {
            const x = table.indexToValue(i)
            const y = table.indexToValue(j)
            const type = table.overflow[i][j] === 1 ? '+' : '-'
            console.log(`  ${x} - ${y} = ${table.results[i][j]} (${type}overflow)`)
          }
        }
      }
    }
  })

program
  .command('bin')
  .description('Convert between decimal and binary')
  .argument('<value>', 'decimal integer or binary string')
  .argument('<k>', 'bits')
  .option('-r, --reverse', 'convert binary to decimal')
  .action((value: string, k: string, options: { reverse?: boolean }) => {
    try {
      if (options.reverse) {
        const decimal = integer.fromBinary(value, Number(k))
        console.log(`\nBinary: ${value}`)
        console.log(`Decimal: ${decimal}`)
      } else {
        const binary = integer.toBinary(Number(value), Number(k))
        console.log(`\nDecimal: ${value}`)
        console.log(`Binary: ${binary}`)
      }
    } catch (e) {
      console.error(`Error: ${(e as Error).message}`)
      process.exit(1)
    }
  })

program.parse()
