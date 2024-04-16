import { describe, test, expect } from 'vitest'

import patterns from './patterns.js'

describe('[patterns API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)testPattern]', () => {
      test('is defined correctly', () => {
        expect(patterns.testPattern).toBeTypeOf('object')
        expect(Object.keys(patterns.testPattern)).not.toHaveLength(0)
      })

      test('date', () => {
        const { date } = patterns.testPattern

        expect(date('2024/01/01')).toBe(true)
        expect(date('2024/01/31')).toBe(true)
        expect(date('2024/02/29')).toBe(true)
        expect(date('2024/10/01')).toBe(true)
        expect(date('2024/01/21')).toBe(true)

        expect(date('1/10/01')).toBe(true)
        expect(date('-1/01/21')).toBe(true)
        expect(date('-150/10/01')).toBe(true)
        expect(date('-2024/01/21')).toBe(true)

        expect(date('2024/01/41')).toBe(false)
        expect(date('2024/41/01')).toBe(false)
        expect(date('2024/1/01')).toBe(false)
        expect(date('2024/01/1')).toBe(false)
        expect(date('2024/1/1')).toBe(false)
      })

      test('time', () => {
        const { time } = patterns.testPattern

        expect(time('00:00')).toBe(true)
        expect(time('23:59')).toBe(true)
        expect(time('12:00')).toBe(true)
        expect(time('12:59')).toBe(true)
        expect(time('12:00')).toBe(true)
        expect(time('12:59')).toBe(true)

        expect(time('0:00')).toBe(true)
        expect(time('1:59')).toBe(true)
        expect(time('2:0')).toBe(false)
        expect(time('3:9')).toBe(false)

        expect(time('24:00')).toBe(false)
        expect(time('1:79')).toBe(false)
        expect(time('26:09')).toBe(false)
        expect(time('26:9')).toBe(false)
      })

      test('fulltime', () => {
        const { fulltime } = patterns.testPattern

        expect(fulltime('00:00:00')).toBe(true)
        expect(fulltime('23:59:59')).toBe(true)
        expect(fulltime('12:00:00')).toBe(true)
        expect(fulltime('12:59:59')).toBe(true)
        expect(fulltime('12:00:00')).toBe(true)
        expect(fulltime('12:59:59')).toBe(true)

        expect(fulltime('0:00:00')).toBe(true)
        expect(fulltime('1:59:59')).toBe(true)
        expect(fulltime('10:69:59')).toBe(false)
        expect(fulltime('21:59:79')).toBe(false)
        expect(fulltime('2:0:0')).toBe(false)
        expect(fulltime('3:9:9')).toBe(false)

        expect(fulltime('24:00:00')).toBe(false)
        expect(fulltime('1:79:59')).toBe(false)
        expect(fulltime('26:09:59')).toBe(false)
        expect(fulltime('26:9:59')).toBe(false)
        expect(fulltime('26:9:9')).toBe(false)
      })

      test('timeOrFulltime', () => {
        const { timeOrFulltime } = patterns.testPattern

        expect(timeOrFulltime('00:00')).toBe(true)
        expect(timeOrFulltime('23:59')).toBe(true)
        expect(timeOrFulltime('12:00')).toBe(true)
        expect(timeOrFulltime('12:59')).toBe(true)
        expect(timeOrFulltime('12:00')).toBe(true)
        expect(timeOrFulltime('12:59')).toBe(true)

        expect(timeOrFulltime('00:00:00')).toBe(true)
        expect(timeOrFulltime('23:59:59')).toBe(true)
        expect(timeOrFulltime('12:00:00')).toBe(true)
        expect(timeOrFulltime('12:59:59')).toBe(true)
        expect(timeOrFulltime('12:00:00')).toBe(true)
        expect(timeOrFulltime('12:59:59')).toBe(true)

        expect(timeOrFulltime('0:00:00')).toBe(true)
        expect(timeOrFulltime('1:59:59')).toBe(true)
        expect(timeOrFulltime('10:69:59')).toBe(false)
        expect(timeOrFulltime('21:59:79')).toBe(false)
        expect(timeOrFulltime('2:0:0')).toBe(false)
        expect(timeOrFulltime('3:9:9')).toBe(false)

        expect(timeOrFulltime('24:00:00')).toBe(false)
        expect(timeOrFulltime('1:79:59')).toBe(false)
        expect(timeOrFulltime('26:09:59')).toBe(false)
        expect(timeOrFulltime('26:9:59')).toBe(false)
        expect(timeOrFulltime('26:9:9')).toBe(false)
      })

      test('email', () => {
        const { email } = patterns.testPattern

        expect(email('some@email.com')).toBe(true)
        expect(email('some@email.co.uk')).toBe(true)
        expect(email('some.user@email.com')).toBe(true)
        expect(email('some.user@some-email.com')).toBe(true)

        expect(email('some.user@some_email.com')).toBe(false)
        expect(email('some_user@some_email.com')).toBe(false)

        expect(email('some_user@some_email')).toBe(false)
        expect(email('some_user@some_email.')).toBe(false)
        expect(email('some_user@some_email.c')).toBe(false)
        expect(email('some_user@some_email.c.')).toBe(false)
        expect(email('some_user@some_email.c.o')).toBe(false)
        expect(email('some_user@some_email.com.')).toBe(false)

        expect(email('@some_email.com')).toBe(false)
        expect(email('some_user@')).toBe(false)
        expect(email('some_user@.')).toBe(false)
        expect(email('some_user@.com')).toBe(false)
        expect(email('')).toBe(false)
        expect(email('  ')).toBe(false)
        expect(email('user@@email.com')).toBe(false)
        expect(email('user@service@email.com')).toBe(false)
      })

      test('hexColor', () => {
        const { hexColor } = patterns.testPattern

        expect(hexColor('#fff')).toBe(true)
        expect(hexColor('#FFF')).toBe(true)
        expect(hexColor('#000')).toBe(true)
        expect(hexColor('#000000')).toBe(true)
        expect(hexColor('#ffffff')).toBe(true)
        expect(hexColor('#FFFFFF')).toBe(true)
        expect(hexColor('#a0B5CC')).toBe(true)
        expect(hexColor('#EEEEEE')).toBe(true)

        expect(hexColor('#ff')).toBe(false)
        expect(hexColor('#FFFF')).toBe(false)
        expect(hexColor('#0000')).toBe(false)
        expect(hexColor('#00000')).toBe(false)
        expect(hexColor('#ffffff0')).toBe(false)
        expect(hexColor('#FFFFFF0')).toBe(false)
        expect(hexColor('#fffff')).toBe(false)
        expect(hexColor('#FFFFFFF')).toBe(false)
      })

      test('hexaColor', () => {
        const { hexaColor } = patterns.testPattern

        expect(hexaColor('#ffff')).toBe(true)
        expect(hexaColor('#FFFF')).toBe(true)
        expect(hexaColor('#abcd')).toBe(true)
        expect(hexaColor('#ABCD')).toBe(true)
        expect(hexaColor('#Ab7D')).toBe(true)
        expect(hexaColor('#0000')).toBe(true)
        expect(hexaColor('#00000000')).toBe(true)
        expect(hexaColor('#ffffff00')).toBe(true)
        expect(hexaColor('#FFFFFF00')).toBe(true)
        expect(hexaColor('#ffffffA1')).toBe(true)
        expect(hexaColor('#FFFFFF96')).toBe(true)

        expect(hexaColor('#taaa')).toBe(false)
        expect(hexaColor('#FTFF')).toBe(false)
        expect(hexaColor('#apcd')).toBe(false)
        expect(hexaColor('#AqQD')).toBe(false)
        expect(hexaColor('#Ab7x')).toBe(false)

        expect(hexaColor('#ff')).toBe(false)
        expect(hexaColor('#000')).toBe(false)
        expect(hexaColor('#00000')).toBe(false)
        expect(hexaColor('#ffffff')).toBe(false)
        expect(hexaColor('#FFFFFF')).toBe(false)
        expect(hexaColor('#fffff')).toBe(false)
        expect(hexaColor('#FFFFFFF')).toBe(false)
      })

      test('hexOrHexaColor', () => {
        const { hexOrHexaColor } = patterns.testPattern

        expect(hexOrHexaColor('#fff')).toBe(true)
        expect(hexOrHexaColor('#FFF')).toBe(true)
        expect(hexOrHexaColor('#FFFF')).toBe(true)
        expect(hexOrHexaColor('#000')).toBe(true)
        expect(hexOrHexaColor('#0000')).toBe(true)
        expect(hexOrHexaColor('#000000')).toBe(true)
        expect(hexOrHexaColor('#ffffff')).toBe(true)
        expect(hexOrHexaColor('#FFFFFF')).toBe(true)

        expect(hexOrHexaColor('#ffff')).toBe(true)
        expect(hexOrHexaColor('#FFFF')).toBe(true)
        expect(hexOrHexaColor('#0000')).toBe(true)
        expect(hexOrHexaColor('#00000000')).toBe(true)
        expect(hexOrHexaColor('#ffffff00')).toBe(true)
        expect(hexOrHexaColor('#FFFFFF00')).toBe(true)

        expect(hexOrHexaColor('#ftffff')).toBe(false)
        expect(hexOrHexaColor('#fTffff')).toBe(false)
        expect(hexOrHexaColor('#FYFFFF')).toBe(false)

        expect(hexOrHexaColor('#ff')).toBe(false)
        expect(hexOrHexaColor('#00000')).toBe(false)
        expect(hexOrHexaColor('#FFFFFFF')).toBe(false)
      })

      test('rgbColor', () => {
        const { rgbColor } = patterns.testPattern

        expect(rgbColor('rgb(0,0,0)')).toBe(true)
        expect(rgbColor('rgb(255,255,255)')).toBe(true)
        expect(rgbColor('rgb(0,0,255)')).toBe(true)
        expect(rgbColor('rgb(255,0,0)')).toBe(true)
        expect(rgbColor('rgb(0,255,0)')).toBe(true)

        expect(rgbColor('rgb(0,0,0')).toBe(false)
        expect(rgbColor('0,0,0,0)')).toBe(false)
        expect(rgbColor('(0,0,0,0)')).toBe(false)
        expect(rgbColor('rgb(0,0,0,0')).toBe(false)
        expect(rgbColor('rgb(500,0,0,0)')).toBe(false)
        expect(rgbColor('rgb(0,500,0,0)')).toBe(false)
        expect(rgbColor('rgb(0,0,500,0)')).toBe(false)
        expect(rgbColor('rgb(0,0,0,5)')).toBe(false)
      })

      test('rgbaColor', () => {
        const { rgbaColor } = patterns.testPattern

        expect(rgbaColor('rgba(0,0,0,0)')).toBe(true)
        expect(rgbaColor('rgba(255,255,255,1)')).toBe(true)
        expect(rgbaColor('rgba(0,0,255,0.5)')).toBe(true)
        expect(rgbaColor('rgba(255,0,0,0.1)')).toBe(true)
        expect(rgbaColor('rgba(0,255,0,0.9)')).toBe(true)

        expect(rgbaColor('rgba(0,255,0,1.9)')).toBe(false)

        expect(rgbaColor('rgba(0,0,0)')).toBe(false)
        expect(rgbaColor('rgba(0,0,0,0')).toBe(false)
        expect(rgbaColor('rgba(0,0,0,0,0)')).toBe(false)
      })

      test('rgbOrRgbaColor', () => {
        const { rgbOrRgbaColor } = patterns.testPattern

        expect(rgbOrRgbaColor('rgb(0,0,0)')).toBe(true)
        expect(rgbOrRgbaColor('rgb(255,255,255)')).toBe(true)
        expect(rgbOrRgbaColor('rgb(0,0,255)')).toBe(true)
        expect(rgbOrRgbaColor('rgb(255,0,0)')).toBe(true)
        expect(rgbOrRgbaColor('rgb(0,255,0)')).toBe(true)

        expect(rgbOrRgbaColor('rgba(0,0,0,0)')).toBe(true)
        expect(rgbOrRgbaColor('rgba(255,255,255,1)')).toBe(true)
        expect(rgbOrRgbaColor('rgba(0,0,255,0.5)')).toBe(true)
        expect(rgbOrRgbaColor('rgba(255,0,0,0.1)')).toBe(true)
        expect(rgbOrRgbaColor('rgba(0,255,0,0.9)')).toBe(true)

        expect(rgbOrRgbaColor('rgb(0,0,0')).toBe(false)
        expect(rgbOrRgbaColor('rgb(0,0,0,0)')).toBe(false)
        expect(rgbOrRgbaColor('(0,0,0,0)')).toBe(false)
        expect(rgbOrRgbaColor('0,0,0,0)')).toBe(false)
        expect(rgbOrRgbaColor('rgb(0,0,0,0')).toBe(false)
        expect(rgbOrRgbaColor('rgb(500,0,0,0)')).toBe(false)
        expect(rgbOrRgbaColor('rgb(0,500,0,0)')).toBe(false)
        expect(rgbOrRgbaColor('rgb(0,0,500,0)')).toBe(false)
        expect(rgbOrRgbaColor('rgb(0,0,0,5)')).toBe(false)
      })

      test('hexOrRgbColor', () => {
        const { hexOrRgbColor } = patterns.testPattern

        expect(hexOrRgbColor('#fff')).toBe(true)
        expect(hexOrRgbColor('#FFF')).toBe(true)
        expect(hexOrRgbColor('#000')).toBe(true)
        expect(hexOrRgbColor('#000000')).toBe(true)
        expect(hexOrRgbColor('#ffffff')).toBe(true)
        expect(hexOrRgbColor('#FFFFFF')).toBe(true)

        expect(hexOrRgbColor('rgb(0,0,0)')).toBe(true)
        expect(hexOrRgbColor('rgb(255,255,255)')).toBe(true)
        expect(hexOrRgbColor('rgb(0,0,255)')).toBe(true)
        expect(hexOrRgbColor('rgb(255,0,0)')).toBe(true)
        expect(hexOrRgbColor('rgb(0,255,0)')).toBe(true)

        expect(hexOrRgbColor('#ff')).toBe(false)
        expect(hexOrRgbColor('#FFFF')).toBe(false)
        expect(hexOrRgbColor('#0000')).toBe(false)
        expect(hexOrRgbColor('#00000')).toBe(false)
        expect(hexOrRgbColor('#fffff')).toBe(false)
        expect(hexOrRgbColor('#FFFFFFF')).toBe(false)

        expect(hexOrRgbColor('rgb(0,0,0')).toBe(false)
        expect(hexOrRgbColor('0,0,0,0)')).toBe(false)
        expect(hexOrRgbColor('rgb(0,0,0,0)')).toBe(false)
        expect(hexOrRgbColor('rgba(0,0,0,0)')).toBe(false)
        expect(hexOrRgbColor('rgb(500,0,0,0)')).toBe(false)
        expect(hexOrRgbColor('rgb(0,500,0,0)')).toBe(false)
        expect(hexOrRgbColor('rgb(0,0,267,0)')).toBe(false)
        expect(hexOrRgbColor('rgb(0,0,0,5)')).toBe(false)
      })

      test('hexaOrRgbaColor', () => {
        const { hexaOrRgbaColor } = patterns.testPattern

        expect(hexaOrRgbaColor('#ffff')).toBe(true)
        expect(hexaOrRgbaColor('#FFFF')).toBe(true)
        expect(hexaOrRgbaColor('#abcd')).toBe(true)
        expect(hexaOrRgbaColor('#ABCD')).toBe(true)
        expect(hexaOrRgbaColor('#Ab7D')).toBe(true)
        expect(hexaOrRgbaColor('#0000')).toBe(true)
        expect(hexaOrRgbaColor('#00000000')).toBe(true)
        expect(hexaOrRgbaColor('#ffffff00')).toBe(true)
        expect(hexaOrRgbaColor('#FFFFFF00')).toBe(true)
        expect(hexaOrRgbaColor('#ffffffA1')).toBe(true)
        expect(hexaOrRgbaColor('#FFFFFF96')).toBe(true)

        expect(hexaOrRgbaColor('rgba(0,0,0,0)')).toBe(true)
        expect(hexaOrRgbaColor('rgba(255,255,255,1)')).toBe(true)
        expect(hexaOrRgbaColor('rgba(0,0,255,0.5)')).toBe(true)
        expect(hexaOrRgbaColor('rgba(255,0,0,0.1)')).toBe(true)
        expect(hexaOrRgbaColor('rgba(0,255,0,0.9)')).toBe(true)

        expect(hexaOrRgbaColor('rgba(500,0,0,0)')).toBe(false)
        expect(hexaOrRgbaColor('rgba(0,500,0,0)')).toBe(false)
        expect(hexaOrRgbaColor('rgba(0,0,500,0)')).toBe(false)
        expect(hexaOrRgbaColor('rgba(0,0,0,5)')).toBe(false)

        expect(hexaOrRgbaColor('#taaa')).toBe(false)
        expect(hexaOrRgbaColor('#FTFF00')).toBe(false)
        expect(hexaOrRgbaColor('#apcd11')).toBe(false)
        expect(hexaOrRgbaColor('#AqQDa0')).toBe(false)
        expect(hexaOrRgbaColor('#Ab7xff')).toBe(false)

        expect(hexaOrRgbaColor('#ff')).toBe(false)
        expect(hexaOrRgbaColor('#000')).toBe(false)
        expect(hexaOrRgbaColor('#00000')).toBe(false)
        expect(hexaOrRgbaColor('#ffffff')).toBe(false)
        expect(hexaOrRgbaColor('#FFFFFF')).toBe(false)
        expect(hexaOrRgbaColor('#fffff')).toBe(false)
        expect(hexaOrRgbaColor('#FFFFFFF')).toBe(false)
      })

      test('anyColor', () => {
        const { anyColor } = patterns.testPattern

        expect(anyColor('#fff')).toBe(true)
        expect(anyColor('#FFF')).toBe(true)
        expect(anyColor('#000')).toBe(true)
        expect(anyColor('#000000')).toBe(true)
        expect(anyColor('#ffffff')).toBe(true)
        expect(anyColor('#FFFFFF')).toBe(true)

        expect(anyColor('rgb(0,0,0)')).toBe(true)
        expect(anyColor('rgb(255,255,255)')).toBe(true)
        expect(anyColor('rgb(0,0,255)')).toBe(true)
        expect(anyColor('rgb(255,0,0)')).toBe(true)
        expect(anyColor('rgb(0,255,0)')).toBe(true)

        expect(anyColor('#ffff')).toBe(true)
        expect(anyColor('#FFFF')).toBe(true)
        expect(anyColor('#abcd')).toBe(true)
        expect(anyColor('#ABCD')).toBe(true)
        expect(anyColor('#Ab7D')).toBe(true)
        expect(anyColor('#0000')).toBe(true)
        expect(anyColor('#00000000')).toBe(true)
        expect(anyColor('#ffffff00')).toBe(true)
        expect(anyColor('#FFFFFF00')).toBe(true)
        expect(anyColor('#ffffffA1')).toBe(true)
        expect(anyColor('#FFFFFF96')).toBe(true)

        expect(anyColor('rgba(0,0,0,0)')).toBe(true)
        expect(anyColor('rgba(255,255,255,1)')).toBe(true)
        expect(anyColor('rgba(0,0,255,0.5)')).toBe(true)
        expect(anyColor('rgba(255,0,0,0.1)')).toBe(true)
        expect(anyColor('rgba(0,255,0,0.9)')).toBe(true)

        expect(anyColor('#ff')).toBe(false)
        expect(anyColor('#00000')).toBe(false)
        expect(anyColor('#fffff')).toBe(false)
        expect(anyColor('#FFFFFFF')).toBe(false)

        expect(anyColor('rgb(0,0,0')).toBe(false)
        expect(anyColor('0,0,0,0)')).toBe(false)
        expect(anyColor('rgb(0,0,0,0')).toBe(false)

        expect(anyColor('rgba(500,0,0,0)')).toBe(false)
        expect(anyColor('rgba(0,500,0,0)')).toBe(false)
        expect(anyColor('rgba(0,0,500,0)')).toBe(false)
        expect(anyColor('rgba(0,0,0,5)')).toBe(false)
      })
    })
  })
})
