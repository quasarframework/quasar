const trueFn = () => true

export default function (emitsArray) {
  const emitsObject = {}

  emitsArray.forEach(val => {
    emitsObject[ val ] = trueFn
  })

  return emitsObject
}
