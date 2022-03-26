<template>
  <div class="q-layout-padding column q-gutter-y-lg">
    <q-select
      style="width: 300px"
      v-model="multiple"
      multiple
      :options="filteredOptions"
      filled
      behavior="menu"
      label="Multiple - Menu - google filters"
    />

    <q-select
      style="width: 300px"
      v-model="multiple"
      multiple
      :options="filteredOptions"
      filled
      behavior="dialog"
      label="Multiple - Dialog - google filters"
    />
  </div>
</template>

<script>
const optionNames = [ 'Google', 'Twitter', 'Facebook', 'Apple', 'Oracle' ]
const options = Array(100).fill(null).reduce((acc, _, i) => {
  optionNames.forEach(n => {
    acc.push(`${n} - ${i}`)
  })

  return acc
}, [])

export default {
  data: () => ({
    multiple: []
  }),
  computed: {
    filteredOptions () {
      if (this.multiple.some(x => x.indexOf('Google') > -1)) {
        return options.filter(x => x.indexOf('Twitter') === -1 && x.indexOf('Apple') === -1 && x.indexOf('Oracle') === -1)
      }

      return options
    }
  }
}
</script>
