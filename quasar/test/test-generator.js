const fs = require('fs-extra')

let newApiDir = '../dist/api'
let targetFolder = './jest/__tests__/generated'

if (fs.existsSync(targetFolder)) {
  fs.removeSync(targetFolder)
}
fs.mkdirSync(targetFolder)
fs.mkdirSync(`${targetFolder}/components`)
fs.mkdirSync(`${targetFolder}/tests`)

fs.readdirSync(`${newApiDir}`)
  .map(filename => ({
    filename,
    api: require(`${newApiDir}/${filename}`)
  }))
  .filter(({ api }) => api.type === 'component')

  .map(({ filename, api }) => {
    const name = filename.replace('.json', '')
    const upperCaseName = name.toUpperCase()
    const vueFileName = `${upperCaseName}.vue`

    const props = Object.entries(api.props || {})
      .map(([name, propApi]) => {
        if (!propApi.required) {
          return undefined
        }
        if (propApi.values) {
          return `:${name}="${propApi.values[0]}"`
        }
        let type = propApi.type
        if (Array.isArray(type)) {
          type = type[0] // just pull ou some type for now
        }
        if (type === 'Number') {
          return `:${name}="${5}"` // Just five... you know.. because I get to choose
        }
        if (type === 'String') {
          return `${name}="Test String"`
        }
        if (type === 'Array') {
          return `:${name}="[]"`
        }
        return undefined
      }).filter(_ => _).join(' ')

    fs.writeFileSync(`${targetFolder}/components/${vueFileName}`, `
<template>
  <div>
    <${name} ${props}/>
  </div>
</template>

<script>
export default {
  name: '${name.toUpperCase()}',
  data () {
    return {

    }
  },

}
</script> 
`)

    /**
     * Now write the test
     */
    fs.writeFileSync(`${targetFolder}/tests/${upperCaseName}.spec.js`, `
/* eslint-disable */
/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import ${upperCaseName} from './../components/${vueFileName}'
import { Quasar, ${name} } from 'quasar'

describe('generated ${name} test', () => {
  const wrapper = mountQuasar(${upperCaseName}, {
    utils: {
      appError: () => (fn) => fn,
      appSuccess: () => (fn) => fn
    }
  })
  const vm = wrapper.vm

  it('passes the sanity check and creates a wrapper', () => {
    expect(wrapper.isVueInstance()).toBe(true)
  })
   it('mounts', () => {
    const localVue = createLocalVue()
    localVue.use(Quasar, { components: { ${name} } })
    const wrapper2 = mount(${upperCaseName}, {
      localVue
    })
  })
})

`)
  })
