export default function (data, filter, selectionMode, singleSelection) {
  if (!filter || selectionMode === 'none') {
    return data
  }

  if (selectionMode === 'single') {
    return singleSelection
  }

  return data.filter(row => row.__selected)
}
