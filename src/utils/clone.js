export default function (data) {
  const s = JSON.stringify(data)
  return s === void 0 ? s : JSON.parse(s)
}
