export const useDarkProps = {
  dark: {
    type: Boolean,
    default: null
  }
}

// returns an isDark() getter; the $q.dark.isActive read stays reactive
// by being tracked in whichever effect calls the getter
export default function useDark(props, $q) {
  return () => (props.dark === null ? $q.dark.isActive : props.dark)
}
