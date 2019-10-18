<template>
  <div class="q-pa-md">
    <div class="row justify-around items-center q-pb-lg">
      <q-btn label="Add row" @click="addRow" />
      <q-btn label="Remove row" @click="removeRow" />
    </div>
    <div class="row">
      <div v-mutation="handler" class="col-4">
        <q-list v-if="listItems.length > 0" bordered separator>
          <q-item v-for="item in listItems" :key="item">
            <q-item-section>
              {{ item }}
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div class="col-8">
        <q-card v-if="mutationInfo.length > 0">
          <q-card-section>
            <pre class="doc-code language-markup">
              <code class="doc-code__inner language-markup">{{ mutationInfo }}</code>
            </pre>
          </q-card-section>
        </q-card>
      </div>

    </div>
  </div>
</template>

<script>
function domToObj (domEl, whitelist) {
  let obj = {}
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

export default {
  data () {
    return {
      listItems: [],
      mutationInfo: ''
    }
  },

  methods: {
    handler (mutationRecords) {
      const whitelist = ['id', 'type', 'addedNodes', 'removedNodes', 'attributeName', 'attributeNamespace', 'nextSibling', 'oldValue', 'previousSibling', 'target', 'tagName', 'className', 'childNodes']
      this.mutationInfo = ''

      for (let index in mutationRecords) {
        const record = mutationRecords[index]
        console.log(record)
        this.mutationInfo += JSON.stringify(record, function (name, value) {
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
        this.mutationInfo += '\n'
      }
    },

    addRow () {
      if (this.listItems.length < 10) {
        this.listItems.push(`List item #${this.listItems.length + 1}`)
      }
    },

    removeRow () {
      if (this.listItems.length > 0) {
        this.listItems.pop()
      }
    }
  }
}
</script>
