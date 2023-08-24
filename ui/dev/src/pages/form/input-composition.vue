<template>
  <div class="q-layout-padding">
    <div
      class="q-gutter-sm"
      @keydown="evt => addLog(evt)"
      @keypress="evt => addLog(evt)"
      @keyup="evt => addLog(evt)"
    >
      <q-input
        v-model="text"
        outlined
        label="Composition tests"
      />
    </div>

    <q-btn label="Reset log" @click="resetLog" />
    <div class="scroll" style="max-height: 80vh">
      <div class="row no-wrap q-col-gutter-md" v-for="(row, index) in log" :key="index">
        <div class="col-2">
          {{ index }}. {{ row[0] }} * {{ row[1] }}
        </div>
        <div class="col-8 row q-gutter-x-sm">
          <div v-for="(v, k) in row[2]" :key="k">
            {{ k }}: {{ v }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: '',
      log: []
    }
  },

  methods: {
    addLog (evt) {
      const evtDump = {
        key: evt.key,
        code: evt.code,
        charCode: evt.charCode,
        keyCode: evt.keyCode,
        which: evt.which,

        ctrlKey: evt.ctrlKey,
        shiftKey: evt.shiftKey,
        altKey: evt.altKey,
        metaKey: evt.metaKey,
        repeat: evt.repeat,
        detail: evt.detail,
        isTrusted: evt.isTrusted,
        isComposing: evt.isComposing,
        composed: evt.composed
      }

      const filtered = this.log.filter(r => r[ 0 ] === evt.type)

      if (filtered.length > 0) {
        const old = filtered[ 0 ]

        if (JSON.stringify(old[ 2 ]) === JSON.stringify(evtDump)) {
          old[ 1 ]++

          this.log = [ ...this.log ]

          return
        }
      }

      this.log.unshift([ evt.type, 1, evtDump ])
    },

    resetLog () {
      this.log = []
    }
  }
}
</script>
