
let
  baseElement = document.createElement('base'),
  relativeElement = document.createElement('a')

document.head.appendChild(baseElement)

export default (relativePath, base) => {
  let resolved

  baseElement.href = base
  relativeElement.href = relativePath
  resolved = relativeElement.href
  baseElement.href = ''

  return resolved
}
