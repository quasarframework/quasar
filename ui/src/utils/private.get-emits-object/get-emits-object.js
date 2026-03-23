const trueFn = () => true

export default function getEmitsObject(emitsArray) {
  const emitsObject = {}

  emitsArray.forEach(val => {
    emitsObject[val] = trueFn
  })

  return emitsObject
}
