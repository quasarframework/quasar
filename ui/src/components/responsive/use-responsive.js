import useRatio from '../../composables/private.use-ratio/use-ratio.js'

export { useRatioProps as useResponsiveProps } from '../../composables/private.use-ratio/use-ratio.js'

export default function useResponsive(props) {
  const ratioStyle = useRatio(props)

  return {
    ratioStyle
  }
}
