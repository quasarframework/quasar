import { h } from 'vue'

export const useFormProps = {
  name: String
}

// returns a formAttrs() getter
export function useFormAttrs(props) {
  return () => ({
    type: 'hidden',
    name: props.name,
    value: props.modelValue
  })
}

export function useFormInject(formAttrs) {
  return (child, action, className) => {
    child[action](
      h('input', {
        class: 'hidden' + (className || ''),
        ...(formAttrs !== void 0 ? formAttrs() : void 0)
      })
    )
  }
}

export function useFormInputNameAttr(props) {
  return () => props.name || props.for
}
