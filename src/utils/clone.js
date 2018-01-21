export default function (data) {
  const s = JSON.stringify(data)
  if (s) {
    return JSON.parse(s)
  }
}
