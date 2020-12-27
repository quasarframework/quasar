const isJapanese = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/
const isChinese = /[\u4e00-\u9fff\u3400-\u4dbf\u{20000}-\u{2a6df}\u{2a700}-\u{2b73f}\u{2b740}-\u{2b81f}\u{2b820}-\u{2ceaf}\uf900-\ufaff\u3300-\u33ff\ufe30-\ufe4f\uf900-\ufaff\u{2f800}-\u{2fa1f}]/u
const isKorean = /[\u3131-\u314e\u314f-\u3163\uac00-\ud7a3]/

export default function (onInput) {
  return function onComposition (e) {
    if (e.type === 'compositionend' || e.type === 'change') {
      if (e.target.composing !== true) { return }
      e.target.composing = false
      onInput(e)
    }
    else if (e.type === 'compositionupdate') {
      if (
        typeof e.data === 'string'
        && isJapanese.test(e.data) === false
        && isChinese.test(e.data) === false
        && isKorean.test(e.data) === false
      ) {
        e.target.composing = false
      }
    }
    else {
      e.target.composing = true
    }
  }
}
