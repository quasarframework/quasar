import { client } from '../../plugins/platform/Platform.js'

const isJapanese =
  /[\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFF9F\u4E00-\u9FAF\u3400-\u4DBF]/
const isChinese =
  /[\u4E00-\u9FFF\u3400-\u4DBF\u{20000}-\u{2A6DF}\u{2A700}-\u{2B73F}\u{2B740}-\u{2B81F}\u{2B820}-\u{2CEAF}\uF900-\uFAFF\u3300-\u33FF\uFE30-\uFE4F\uF900-\uFAFF\u{2F800}-\u{2FA1F}]/u
const isKorean = /[\u3131-\u314E\u314F-\u3163\uAC00-\uD7A3]/
const isPlainText = /[a-z0-9_ -]$/i

export default function useKeyComposition(onInput) {
  return function onComposition(e) {
    if (e.type === 'compositionend' || e.type === 'change') {
      if (!e.target.qComposing) return
      e.target.qComposing = false
      onInput(e)
    } else if (
      e.type === 'compositionupdate' &&
      !e.target.qComposing &&
      typeof e.data === 'string'
    ) {
      const isComposing = client.is.firefox
        ? !isPlainText.test(e.data)
        : isJapanese.test(e.data) ||
          isChinese.test(e.data) ||
          isKorean.test(e.data)

      if (isComposing) {
        e.target.qComposing = true
      }
    }
  }
}
