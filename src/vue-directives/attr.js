export default function (attribs, oldAttribs) {
  if (typeof attribs === 'undefined') {
    console.error('v-attr received empty new value from "' + oldAttribs + '"', this.el)
    return
  }

  let values = Array.isArray(attribs) ? attribs : [attribs]

  if (typeof oldAttribs !== 'undefined') {
    var oldValues = Array.isArray(oldAttribs) ? oldAttribs : [oldAttribs]

    oldValues = oldValues.filter((val) => !values.includes(val))
    oldValues.forEach((val) => { this.el.removeAttribute(val) })
  }

  values.forEach((value) => { this.el.setAttribute(value, '') })
}
