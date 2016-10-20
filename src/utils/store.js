import uid from './uid'

let data = {}

export function add (name, el, ctx) {
  let id = uid()
  el.dataset['__' + name] = id
  if (!data[name]) {
    data[name] = {}
  }
  else if (data[name][id]) {
    console.warn('Element store [add]: overwriting data')
  }
  data[name][id] = ctx
}

export function get (name, el) {
  let id = el.dataset['__' + name]
  if (!id) {
    console.warn('Element store [get]: id not registered', name, el)
    return
  }
  if (!data[name]) {
    console.warn('Element store [get]: name not registered', name, el)
    return
  }
  let ctx = data[name][id]
  if (!ctx) {
    console.warn('Element store [get]: data not found for', name, ':', id, '->', el)
    return
  }
  return ctx
}

export function remove (name, el) {
  let id = el.dataset['__' + name]
  if (!id) {
    console.warn('Element store [remove]: id not registered', name, el)
    return
  }
  if (data[name] && data[name][id]) {
    delete data[name][id]
  }
}
