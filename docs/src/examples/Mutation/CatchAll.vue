<template>
  <div class="q-pa-md">
    <div class="row no-wrap q-gutter-md">
      <q-btn label="Add row" color="primary" @click="addRow" :disable="listItems.length >= 7" />
      <q-btn label="Remove row" color="accent" @click="removeRow" :disable="listItems.length === 0" />
    </div>

    <div class="row no-wrap q-col-gutter-md">
      <div v-mutation="handler" class="col-4">
        <q-list v-if="listItems.length > 0" bordered separator class="q-mt-md rounded-borders">
          <q-item v-for="(item, index) in listItems" :key="item" :id="`item-${index}`">
            <q-item-section>
              {{ item }}
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="col-8">
        <q-card v-if="mutationInfo.length > 0" bordered flat class="q-mt-md overflow-auto">
          <pre class="catch-all-pre q-pa-md">{{ mutationInfo }}</pre>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
function domToObj (domEl, whitelist) {
  const obj = {}
  for (let i = 0; i < whitelist.length; i++) {
    if (domEl[whitelist[i]] instanceof NodeList) {
      obj[whitelist[i]] = Array.from(domEl[whitelist[i]])
    }
    else {
      obj[whitelist[i]] = domEl[whitelist[i]]
    }
  }
  return obj
}

const whitelist = [
  'id',
  'type',
  'addedNodes',
  'removedNodes',
  'attributeName',
  'attributeNamespace',
  'nextSibling',
  'oldValue',
  'previousSibling',
  'target',
  'tagName',
  'className',
  'childNodes'
]

export default {
  data () {
    return {
      listItems: [],
      mutationInfo: ''
    }
  },

  methods: {
    handler (mutationRecords) {
      const info = []

      for (const index in mutationRecords) {
        const record = mutationRecords[index]

        info.push(
          JSON.stringify(record, function (name, value) {
            if (name === '') {
              return domToObj(value, whitelist)
            }
            if (Array.isArray(this)) {
              if (typeof value === 'object') {
                return domToObj(value, whitelist)
              }
              return value
            }
            if (whitelist.find(x => (x === name))) {
              return value
            }
          }, 2)
        )
      }

      this.mutationInfo = info.join('\n')
    },

    addRow () {
      this.listItems.push(`List item #${this.listItems.length + 1}`)
    },

    removeRow () {
      this.listItems.pop()
    }
  }
}
</script>

<style lang="sass">
.catch-all-pre
  font-size: 10px
  max-height: 350px
</style>
