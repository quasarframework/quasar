import { describe, test, expect } from 'vitest'

import colors, { rgbToString } from './colors.js'

describe('[colors API]', () => {
  describe('[Functions]', () => {
    describe('[(function)rgbToHex]', () => {
      test.each([
        [ 'black', { r: 0, g: 0, b: 0 }, '#000000' ],
        [ 'white', { r: 255, g: 255, b: 255 }, '#ffffff' ],
        [ 'red', { r: 255, g: 0, b: 0 }, '#ff0000' ],
        [ 'green', { r: 0, g: 255, b: 0 }, '#00ff00' ],
        [ 'blue', { r: 0, g: 0, b: 255 }, '#0000ff' ],
        [ 'yellow', { r: 255, g: 255, b: 0 }, '#ffff00' ],
        [ 'cyan', { r: 0, g: 255, b: 255 }, '#00ffff' ],
        [ 'magenta', { r: 255, g: 0, b: 255 }, '#ff00ff' ],
        [ 'gray', { r: 128, g: 128, b: 128 }, '#808080' ]
      ])('rgbToHex(%s) with/without alpha', (_, value, expected) => {
        expect(
          colors.rgbToHex(value)
        ).toBe(expected)

        expect(
          colors.rgbToHex({ ...value, a: 100 })
        ).toBe(expected + 'ff')

        expect(
          colors.rgbToHex({ ...value, a: 58 })
        ).toBe(expected + '94')
      })

      test.each([
        [ 'r > 255', { r: 256, g: 0, b: 0 } ],
        [ 'g > 255', { r: 0, g: 256, b: 0 } ],
        [ 'b > 255', { r: 0, g: 0, b: 256 } ],
        [ 'a > 100', { r: 0, g: 0, b: 0, a: 101 } ]
      ])('rgbToHex(%s) throws', (_, value) => {
        expect(() => {
          colors.rgbToHex(value)
        }).toThrow(/Expected 3 numbers below 256/)
      })
    })

    describe('[(function)hexToRgb]', () => {
      test.each([
        [ 'black', '#000000', { r: 0, g: 0, b: 0 } ],
        [ 'white', '#ffffff', { r: 255, g: 255, b: 255 } ],
        [ 'red', '#ff0000', { r: 255, g: 0, b: 0 } ],
        [ 'green', '#00ff00', { r: 0, g: 255, b: 0 } ],
        [ 'blue', '#0000ff', { r: 0, g: 0, b: 255 } ],
        [ 'yellow', '#ffff00', { r: 255, g: 255, b: 0 } ],
        [ 'cyan', '#00ffff', { r: 0, g: 255, b: 255 } ],
        [ 'magenta', '#ff00ff', { r: 255, g: 0, b: 255 } ],
        [ 'gray', '#808080', { r: 128, g: 128, b: 128 } ]
      ])('hexToRgb(%s)', (_, value, expected) => {
        expect(
          colors.hexToRgb(value)
        ).toStrictEqual(expected)

        expect(
          colors.hexToRgb(value + 'ff')
        ).toStrictEqual({ ...expected, a: 100 })

        expect(
          colors.hexToRgb(value + '94')
        ).toStrictEqual({ ...expected, a: 58 })
      })

      test('hexToRgb(<invalid>) throws', () => {
        expect(() => {
          colors.hexToRgb()
        }).toThrow(/Expected a string/)

        expect(() => {
          colors.hexToRgb(100)
        }).toThrow(/Expected a string/)
      })
    })

    describe('[(function)hsvToRgb]', () => {
      test.each([
        [ 'black', { h: 0, s: 0, v: 0 }, { r: 0, g: 0, b: 0 } ],
        [ 'white', { h: 0, s: 0, v: 100 }, { r: 255, g: 255, b: 255 } ],
        [ 'red', { h: 0, s: 100, v: 100 }, { r: 255, g: 0, b: 0 } ],
        [ 'green', { h: 120, s: 100, v: 100 }, { r: 0, g: 255, b: 0 } ],
        [ 'blue', { h: 240, s: 100, v: 100 }, { r: 0, g: 0, b: 255 } ],
        [ 'yellow', { h: 60, s: 100, v: 100 }, { r: 255, g: 255, b: 0 } ],
        [ 'cyan', { h: 180, s: 100, v: 100 }, { r: 0, g: 255, b: 255 } ],
        [ 'magenta', { h: 300, s: 100, v: 100 }, { r: 255, g: 0, b: 255 } ],
        [ 'gray', { h: 0, s: 0, v: 50 }, { r: 128, g: 128, b: 128 } ]
      ])('hsvToRgb(%s)', (_, value, expected) => {
        expect(
          colors.hsvToRgb(value)
        ).toStrictEqual({ ...expected, a: undefined })

        expect(
          colors.hsvToRgb({ ...value, a: 100 })
        ).toStrictEqual({ ...expected, a: 100 })

        expect(
          colors.hsvToRgb({ ...value, a: 58 })
        ).toStrictEqual({ ...expected, a: 58 })
      })
    })

    describe('[(function)rgbToHsv]', () => {
      test.each([
        [ 'black', { r: 0, g: 0, b: 0 }, { h: 0, s: 0, v: 0 } ],
        [ 'white', { r: 255, g: 255, b: 255 }, { h: 0, s: 0, v: 100 } ],
        [ 'red', { r: 255, g: 0, b: 0 }, { h: 0, s: 100, v: 100 } ],
        [ 'green', { r: 0, g: 255, b: 0 }, { h: 120, s: 100, v: 100 } ],
        [ 'blue', { r: 0, g: 0, b: 255 }, { h: 240, s: 100, v: 100 } ],
        [ 'yellow', { r: 255, g: 255, b: 0 }, { h: 60, s: 100, v: 100 } ],
        [ 'cyan', { r: 0, g: 255, b: 255 }, { h: 180, s: 100, v: 100 } ],
        [ 'magenta', { r: 255, g: 0, b: 255 }, { h: 300, s: 100, v: 100 } ],
        [ 'gray', { r: 128, g: 128, b: 128 }, { h: 0, s: 0, v: 50 } ]
      ])('rgbToHsv(%s)', (_, value, expected) => {
        expect(
          colors.rgbToHsv(value)
        ).toStrictEqual({ ...expected, a: undefined })

        expect(
          colors.rgbToHsv({ ...value, a: 100 })
        ).toStrictEqual({ ...expected, a: 100 })

        expect(
          colors.rgbToHsv({ ...value, a: 58 })
        ).toStrictEqual({ ...expected, a: 58 })
      })
    })

    describe('[(function)textToRgb]', () => {
      test.each([
        [ 'black', '#000000', { r: 0, g: 0, b: 0 } ],
        [ 'white', '#ffffff', { r: 255, g: 255, b: 255 } ],
        [ 'red', '#ff0000', { r: 255, g: 0, b: 0 } ],
        [ 'green', '#00ff00', { r: 0, g: 255, b: 0 } ],
        [ 'blue', '#0000ff', { r: 0, g: 0, b: 255 } ],
        [ 'yellow', '#ffff00', { r: 255, g: 255, b: 0 } ],
        [ 'cyan', '#00ffff', { r: 0, g: 255, b: 255 } ],
        [ 'magenta', '#ff00ff', { r: 255, g: 0, b: 255 } ],
        [ 'gray', '#808080', { r: 128, g: 128, b: 128 } ]
      ])('textToRgb(%s)', (_, value, expected) => {
        expect(
          colors.textToRgb(value)
        ).toStrictEqual(expected)

        expect(
          colors.textToRgb(value + 'ff')
        ).toStrictEqual({ ...expected, a: 100 })

        expect(
          colors.textToRgb(value + '94')
        ).toStrictEqual({ ...expected, a: 58 })
      })

      test.each([
        [ 'black', 'rgb(0, 0, 0)', { r: 0, g: 0, b: 0 } ],
        [ 'white', 'rgb(255, 255, 255)', { r: 255, g: 255, b: 255 } ],
        [ 'red', 'rgb(255, 0, 0)', { r: 255, g: 0, b: 0 } ],
        [ 'green', 'rgb(0, 255, 0)', { r: 0, g: 255, b: 0 } ],
        [ 'blue', 'rgb(0, 0, 255)', { r: 0, g: 0, b: 255 } ],
        [ 'yellow', 'rgb(255, 255, 0)', { r: 255, g: 255, b: 0 } ],
        [ 'cyan', 'rgb(0, 255, 255)', { r: 0, g: 255, b: 255 } ],
        [ 'magenta', 'rgb(255, 0, 255)', { r: 255, g: 0, b: 255 } ],
        [ 'gray', 'rgb(128, 128, 128)', { r: 128, g: 128, b: 128 } ]
      ])('textToRgb(%s)', (_, value, expected) => {
        expect(
          colors.textToRgb(value)
        ).toStrictEqual(expected)
      })

      test.each([
        [ 'black', 'rgba(0, 0, 0, .1)', { r: 0, g: 0, b: 0, a: 10 } ],
        [ 'white', 'rgba(255, 255, 255, 0.1)', { r: 255, g: 255, b: 255, a: 10 } ],
        [ 'red', 'rgba(255, 0, 0, .1)', { r: 255, g: 0, b: 0, a: 10 } ],
        [ 'green', 'rgba(0, 255, 0, .1)', { r: 0, g: 255, b: 0, a: 10 } ],
        [ 'blue', 'rgba(0, 0, 255, .1)', { r: 0, g: 0, b: 255, a: 10 } ],
        [ 'yellow', 'rgba(255, 255, 0, .1)', { r: 255, g: 255, b: 0, a: 10 } ],
        [ 'cyan', 'rgba(0, 255, 255, .1)', { r: 0, g: 255, b: 255, a: 10 } ],
        [ 'magenta', 'rgba(255, 0, 255, .1)', { r: 255, g: 0, b: 255, a: 10 } ],
        [ 'gray', 'rgba(128, 128, 128, .1)', { r: 128, g: 128, b: 128, a: 10 } ]
      ])('textToRgb(%s)', (_, value, expected) => {
        expect(
          colors.textToRgb(value)
        ).toStrictEqual(expected)
      })

      test.each([
        [ 'rgba(0, 255   , 0,    .1)' ],
        [ ' rgba   (  0, 255   , 0,    .1)' ],
        [ 'rgba( 0 , 255 , 0 , .1 )' ],
        [ '  rgba ( 0 ,   255 , 0 ,  .1 )    ' ]
      ])('textToRgb(%s)', (value) => {
        expect(
          colors.textToRgb(value)
        ).toStrictEqual({ r: 0, g: 255, b: 0, a: 10 })
      })

      test('textToRgb(<invalid>) throws', () => {
        expect(() => {
          colors.textToRgb()
        }).toThrow(/Expected a string/)

        expect(() => {
          colors.textToRgb(100)
        }).toThrow(/Expected a string/)
      })
    })

    describe('[(function)lighten]', () => {
      test.each([
        [ 'black', '#000', 10, '#1a1a1a' ],
        [ 'white', '#fff', 10, '#ffffff' ],
        [ 'red', '#f00', 10, '#ff1a1a' ],
        [ 'green', '#0f0', 10, '#1aff1a' ],
        [ 'blue', '#00f', 10, '#1a1aff' ],
        [ 'yellow', '#ff0', 10, '#ffff1a' ],
        [ 'cyan', '#0ff', 10, '#1affff' ],
        [ 'magenta', '#f0f', 10, '#ff1aff' ],
        [ 'gray', '#888', 10, '#949494' ]
      ])('lighten(%s)', (_, value, amount, expected) => {
        expect(
          colors.lighten(value, amount)
        ).toBe(expected)
      })

      test('lighten(<invalid>) throws', () => {
        expect(() => {
          colors.lighten()
        }).toThrow(/Expected a string as color/)

        expect(() => {
          colors.lighten('#f0f', 'a')
        }).toThrow(/Expected a numeric percent/)
      })
    })

    describe('[(function)luminosity]', () => {
      test.each([
        [ 'black', { r: 0, g: 0, b: 0 }, 0 ],
        [ 'white', { r: 255, g: 255, b: 255 }, 1 ],
        [ 'red', { r: 255, g: 0, b: 0 }, 0.2126 ],
        [ 'green', { r: 0, g: 255, b: 0 }, 0.7152 ],
        [ 'blue', { r: 0, g: 0, b: 255 }, 0.0722 ],
        [ 'yellow', { r: 255, g: 255, b: 0 }, 0.9278 ],
        [ 'cyan', { r: 0, g: 255, b: 255 }, 0.7874 ],
        [ 'magenta', { r: 255, g: 0, b: 255 }, 0.2848 ],
        [ 'gray', { r: 128, g: 128, b: 128 }, 0.215859375 ]
      ])('luminosity(%s)', (_, value, expected) => {
        expect(
          colors.luminosity(value)
        ).toBeCloseTo(expected)
      })

      test('luminosity(<invalid>) throws', () => {
        expect(() => {
          colors.luminosity()
        }).toThrow(/Expected a string or a {r, g, b} object as color/)

        expect(() => {
          colors.luminosity(10)
        }).toThrow(/Expected a string or a {r, g, b} object as color/)

        expect(() => {
          colors.luminosity({})
        }).toThrow(/Expected a string or a {r, g, b} object as color/)
      })
    })

    describe('[(function)brightness]', () => {
      test.each([
        [ 'black', { r: 0, g: 0, b: 0 }, 0 ],
        [ 'white', { r: 255, g: 255, b: 255 }, 255 ],
        [ 'red', { r: 255, g: 0, b: 0 }, 76.2458 ],
        [ 'green', { r: 0, g: 255, b: 0 }, 149.685 ],
        [ 'blue', { r: 0, g: 0, b: 255 }, 29.07 ],
        [ 'yellow', { r: 255, g: 255, b: 0 }, 225.93 ],
        [ 'cyan', { r: 0, g: 255, b: 255 }, 178.755 ],
        [ 'magenta', { r: 255, g: 0, b: 255 }, 105.315 ],
        [ 'gray', { r: 128, g: 128, b: 128 }, 128 ]
      ])('brightness(%s)', (_, value, expected) => {
        expect(
          colors.brightness(value)
        ).toBeCloseTo(expected)
      })

      test('brightness(<invalid>) throws', () => {
        expect(() => {
          colors.brightness()
        }).toThrow(/Expected a string or a {r, g, b} object as color/)

        expect(() => {
          colors.brightness(10)
        }).toThrow(/Expected a string or a {r, g, b} object as color/)

        expect(() => {
          colors.brightness({})
        }).toThrow(/Expected a string or a {r, g, b} object as color/)
      })
    })

    describe('[(function)blend]', () => {
      test.each([
        [ 'black', 'white', '#000000', '#ffffff', '#000000ff' ],
        [ 'white', 'black', '#ffffff', '#000000', '#ffffffff' ],
        [ 'red', 'green', '#ff0000', '#00ff00', '#ff0000ff' ],
        [ 'green', 'red', '#00ff00', '#ff0000', '#00ff00ff' ],
        [ 'blue', 'yellow', '#0000ff', '#ffff00', '#0000ffff' ],
        [ 'yellow', 'blue', '#ffff00', '#0000ff', '#ffff00ff' ],
        [ 'cyan', 'magenta', '#00ffff', '#ff00ff', '#00ffffff' ],
        [ 'magenta', 'cyan', '#ff00ff', '#00ffff', '#ff00ffff' ],
        [ 'gray', 'gray', '#808080', '#808080', '#808080ff' ]
      ])('blend(%s, %s) as hex str', (_, __, fgColor, bgColor, expected) => {
        expect(
          colors.blend(fgColor, bgColor)
        ).toBe(expected)
      })

      test.each([
        [ 'black', 'white', { r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }, { r: 0, g: 0, b: 0, a: 100 } ],
        [ 'white', 'black', { r: 255, g: 255, b: 255 }, { r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255, a: 100 } ],
        [ 'red', 'green', { r: 255, g: 0, b: 0 }, { r: 0, g: 255, b: 0 }, { r: 255, g: 0, b: 0, a: 100 } ],
        [ 'green', 'red', { r: 0, g: 255, b: 0 }, { r: 255, g: 0, b: 0 }, { r: 0, g: 255, b: 0, a: 100 } ],
        [ 'blue', 'yellow', { r: 0, g: 0, b: 255 }, { r: 255, g: 255, b: 0 }, { r: 0, g: 0, b: 255, a: 100 } ],
        [ 'yellow', 'blue', { r: 255, g: 255, b: 0 }, { r: 0, g: 0, b: 255 }, { r: 255, g: 255, b: 0, a: 100 } ],
        [ 'cyan', 'magenta', { r: 0, g: 255, b: 255 }, { r: 255, g: 0, b: 255 }, { r: 0, g: 255, b: 255, a: 100 } ],
        [ 'magenta', 'cyan', { r: 255, g: 0, b: 255 }, { r: 0, g: 255, b: 255 }, { r: 255, g: 0, b: 255, a: 100 } ],
        [ 'gray', 'gray', { r: 128, g: 128, b: 128 }, { r: 128, g: 128, b: 128 }, { r: 128, g: 128, b: 128, a: 100 } ]
      ])('blend(%s, %s) as rgb object', (_, __, fgColor, bgColor, expected) => {
        expect(
          colors.blend(fgColor, bgColor)
        ).toStrictEqual(expected)
      })

      test.each([
        [ 'black', 'white', '#000000', { r: 255, g: 255, b: 255 }, '#000000ff' ],
        [ 'white', 'black', '#ffffff', { r: 0, g: 0, b: 0 }, '#ffffffff' ],
        [ 'red', 'green', '#ff0000', { r: 0, g: 255, b: 0 }, '#ff0000ff' ],
        [ 'green', 'red', '#00ff00', { r: 255, g: 0, b: 0 }, '#00ff00ff' ],
        [ 'blue', 'yellow', '#0000ff', { r: 255, g: 255, b: 0 }, '#0000ffff' ],
        [ 'yellow', 'blue', '#ffff00', { r: 0, g: 0, b: 255 }, '#ffff00ff' ],
        [ 'cyan', 'magenta', '#00ffff', { r: 255, g: 0, b: 255 }, '#00ffffff' ],
        [ 'magenta', 'cyan', '#ff00ff', { r: 0, g: 255, b: 255 }, '#ff00ffff' ],
        [ 'gray', 'gray', '#808080', { r: 128, g: 128, b: 128 }, '#808080ff' ]
      ])('blend(%s, %s) as hex / rgb object', (_, __, fgColor, bgColor, expected) => {
        expect(
          colors.blend(fgColor, bgColor)
        ).toStrictEqual(expected)
      })

      test.each([
        [ 'black', 'white', { r: 0, g: 0, b: 0 }, '#ffffff', { r: 0, g: 0, b: 0, a: 100 } ],
        [ 'white', 'black', { r: 255, g: 255, b: 255 }, '#000000', { r: 255, g: 255, b: 255, a: 100 } ],
        [ 'red', 'green', { r: 255, g: 0, b: 0 }, '#00ff00', { r: 255, g: 0, b: 0, a: 100 } ],
        [ 'green', 'red', { r: 0, g: 255, b: 0 }, '#ff0000', { r: 0, g: 255, b: 0, a: 100 } ],
        [ 'blue', 'yellow', { r: 0, g: 0, b: 255 }, '#ffff00', { r: 0, g: 0, b: 255, a: 100 } ],
        [ 'yellow', 'blue', { r: 255, g: 255, b: 0 }, '#0000ff', { r: 255, g: 255, b: 0, a: 100 } ],
        [ 'cyan', 'magenta', { r: 0, g: 255, b: 255 }, '#ff00ff', { r: 0, g: 255, b: 255, a: 100 } ],
        [ 'magenta', 'cyan', { r: 255, g: 0, b: 255 }, '#00ffff', { r: 255, g: 0, b: 255, a: 100 } ],
        [ 'gray', 'gray', { r: 128, g: 128, b: 128 }, '#808080', { r: 128, g: 128, b: 128, a: 100 } ]
      ])('blend(%s, %s) as rgb / hex', (_, __, fgColor, bgColor, expected) => {
        expect(
          colors.blend(fgColor, bgColor)
        ).toStrictEqual(expected)
      })
    })

    describe('[(function)changeAlpha]', () => {
      test.each([
        [ 'white', '#ffffff', 0.1, '#ffffff1a' ],
        [ 'black', '#000000', 0.1, '#0000001a' ],
        [ 'red', '#ff0000', 0.1, '#ff00001a' ],
        [ 'green', '#00ff00', 0.1, '#00ff001a' ],
        [ 'blue', '#0000ff', 0.1, '#0000ff1a' ],
        [ 'yellow', '#ffff00', 0.1, '#ffff001a' ],
        [ 'cyan', '#00ffff', 0.1, '#00ffff1a' ],
        [ 'magenta', '#ff00ff', 0.1, '#ff00ff1a' ],
        [ 'gray', '#808080', 0.1, '#8080801a' ]
      ])('changeAlpha(%s, 0.1)', (_, color, offset, expected) => {
        expect(
          colors.changeAlpha(color, offset)
        ).toBe(expected)
      })

      test.each([
        [ 'white', '#ffffff', -0.1, '#ffffff00' ],
        [ 'black', '#000000', -0.1, '#00000000' ],
        [ 'red', '#ff0000', -0.1, '#ff000000' ],
        [ 'green', '#00ff00', -0.1, '#00ff0000' ],
        [ 'blue', '#0000ff', -0.1, '#0000ff00' ],
        [ 'yellow', '#ffff00', -0.1, '#ffff0000' ],
        [ 'cyan', '#00ffff', -0.1, '#00ffff00' ],
        [ 'magenta', '#ff00ff', -0.1, '#ff00ff00' ],
        [ 'gray', '#808080', -0.1, '#80808000' ]
      ])('changeAlpha(%s, -0.1)', (_, color, offset, expected) => {
        expect(
          colors.changeAlpha(color, offset)
        ).toBe(expected)
      })

      test('changeAlpha(<invalid>) throws', () => {
        expect(() => {
          colors.changeAlpha()
        }).toThrow(/Expected a string as color/)

        expect(() => {
          colors.changeAlpha('#f0f', 2)
        }).toThrow(/Expected offset to be between -1 and 1/)
      })
    })

    describe('[(function)getPaletteColor]', () => {
      test('has correct return value', () => {
        expect(
          colors.getPaletteColor('blue')
        ).toBe('#2196f3')

        expect(
          colors.getPaletteColor('red')
        ).toBe('#f44336')
      })
    })

    describe('[(function)rgbToString]', () => {
      test.each([
        [ 'black', { r: 0, g: 0, b: 0 }, 'rgb(0,0,0)' ],
        [ 'white', { r: 255, g: 255, b: 255 }, 'rgb(255,255,255)' ],
        [ 'red', { r: 255, g: 0, b: 0 }, 'rgb(255,0,0)' ],
        [ 'green', { r: 0, g: 255, b: 0 }, 'rgb(0,255,0)' ],
        [ 'blue', { r: 0, g: 0, b: 255 }, 'rgb(0,0,255)' ],
        [ 'yellow', { r: 255, g: 255, b: 0 }, 'rgb(255,255,0)' ],
        [ 'cyan', { r: 0, g: 255, b: 255 }, 'rgb(0,255,255)' ],
        [ 'magenta', { r: 255, g: 0, b: 255 }, 'rgb(255,0,255)' ],
        [ 'gray', { r: 128, g: 128, b: 128 }, 'rgb(128,128,128)' ]
      ])('rgbToString(%s)', (_, value, expected) => {
        expect(
          rgbToString(value)
        ).toBe(expected)
      })

      test.each([
        [ 'black', { r: 0, g: 0, b: 0, a: 58 }, 'rgba(0,0,0,0.58)' ],
        [ 'white', { r: 255, g: 255, b: 255, a: 58 }, 'rgba(255,255,255,0.58)' ],
        [ 'red', { r: 255, g: 0, b: 0, a: 58 }, 'rgba(255,0,0,0.58)' ],
        [ 'green', { r: 0, g: 255, b: 0, a: 58 }, 'rgba(0,255,0,0.58)' ],
        [ 'blue', { r: 0, g: 0, b: 255, a: 58 }, 'rgba(0,0,255,0.58)' ],
        [ 'yellow', { r: 255, g: 255, b: 0, a: 58 }, 'rgba(255,255,0,0.58)' ],
        [ 'cyan', { r: 0, g: 255, b: 255, a: 58 }, 'rgba(0,255,255,0.58)' ],
        [ 'magenta', { r: 255, g: 0, b: 255, a: 58 }, 'rgba(255,0,255,0.58)' ],
        [ 'gray', { r: 128, g: 128, b: 128, a: 58 }, 'rgba(128,128,128,0.58)' ]
      ])('rgbToString(%s, a:58)', (_, value, expected) => {
        expect(
          rgbToString(value)
        ).toBe(expected)
      })
    })
  })
})
