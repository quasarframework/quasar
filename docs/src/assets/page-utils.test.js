import { afterEach, expect, test } from 'vitest'

import { copyToClipboard } from './page-utils.js'

const realDocument = globalThis.document

afterEach(() => {
  globalThis.document = realDocument
})

// the copy runs through a throwaway textarea, so it necessarily takes the
// focus; these pin that it always hands it back
function stubDocument(activeElement) {
  const order = []
  const textArea = {
    focus: () => order.push('textArea'),
    select() {},
    remove() {}
  }

  globalThis.document = {
    activeElement,
    createElement: () => textArea,
    body: { append() {} },
    execCommand: () => true
  }

  return order
}

test('the copy hands focus back to whatever triggered it', () => {
  const trigger = {
    isConnected: true,
    focus() {
      order.push('trigger')
    }
  }
  const order = stubDocument(trigger)

  copyToClipboard('https://quasar.dev/#anchor')

  expect(order).toStrictEqual(['textArea', 'trigger'])
})

test('a trigger that left the document is not focused back', () => {
  const trigger = {
    isConnected: false,
    focus() {
      order.push('trigger')
    }
  }
  const order = stubDocument(trigger)

  copyToClipboard('https://quasar.dev/#anchor')

  expect(order).toStrictEqual(['textArea'])
})
