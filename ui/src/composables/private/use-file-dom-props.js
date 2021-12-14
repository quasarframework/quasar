import { computed } from 'vue'

export default function (props, typeGuard) {
  function getFormDomProps () {
    const model = props.modelValue

    try {
      const dt = 'DataTransfer' in window
        ? new DataTransfer()
        : ('ClipboardEvent' in window
            ? new ClipboardEvent('').clipboardData
            : void 0
          )

      if (Object(model) === model) {
        ('length' in model
          ? Array.from(model)
          : [ model ]
        ).forEach(file => {
          dt.items.add(file)
        })
      }

      return {
        files: dt.files
      }
    }
    catch (e) {
      return {
        files: void 0
      }
    }
  }

  return typeGuard === true
    ? computed(() => {
      if (props.type !== 'file') {
        return
      }

      return getFormDomProps()
    })
    : computed(getFormDomProps)
}
