import { computed } from 'vue'

export default function useFileDomProps(props, typeGuard) {
  function getFormDomProps() {
    const model = props.modelValue

    try {
      const dt = new DataTransfer()

      if (Object(model) === model) {
        ;('length' in model ? [...model] : [model]).forEach(file => {
          dt.items.add(file)
        })
      }

      return {
        files: dt.files
      }
    } catch {
      return {
        files: void 0
      }
    }
  }

  return typeGuard
    ? computed(() => {
        if (props.type !== 'file') return
        return getFormDomProps()
      })
    : computed(getFormDomProps)
}
