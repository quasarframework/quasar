export default function (terms, {field, list}) {
  const token = terms.toLowerCase()
  return list.filter(item => ('' + item[field]).toLowerCase().startsWith(token))
}
