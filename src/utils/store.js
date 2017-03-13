import uid from './uid'

let data = {}

export function add (name, el, ctx) {
  let id = uid()
  el.dataset['q_' + name] = id
  if (!data[name]) {
    data[name] = {}
  }
  data[name][id] = ctx
}

export function get (name, el) {
  let id = el.dataset['q_' + name]
  if (!id) {
    return
  }
  if (!data[name]) {
    return
  }
  let ctx = data[name][id]
  if (!ctx) {
    return
  }
  return ctx
}

export function remove (name, el) {
  let id = el.dataset['q_' + name]
  if (!id) {
    return
  }
  if (data[name] && data[name][id]) {
    delete data[name][id]
  }
}
