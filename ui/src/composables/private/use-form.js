import { h, computed } from 'vue'

export const useFormProps = {
  name: String
}

export function useFormAttrs (props) {
  return computed(() => ({
    type: 'hidden',
    name: props.name,
    value: props.modelValue
  }))
}

export function useFormInject (formAttrs = {}, formDomProps = {}) {
  return (child, action, className) => {
    child[ action ](
      h('input', {
        class: 'hidden' + (className || ''),
        ...formAttrs.value,
        ...formDomProps.value
      })
    )
  }
}

export function useFormInputNameAttr (props) {
  return computed(() => props.name || props.for)
}
