<template>
  <div>
    <div class="layout-padding">
      <p class="caption">
        Source data:
      </p>
      <ul class="light-paragraph">
        <li>
          {{data}}
        </li>
      </ul>
      <p class="caption">
        Header:
      </p>
      <ul class="light-paragraph">
        <li v-for="(v, i) in labels">
          {{v}}: {{JSON.stringify(headers[i])}}
        </li>
      </ul>
      <p
        class="caption"
        v-for="ext in ['csv', 'xlsx', 'txt', 'html']"
        :key="ext"
      >
        <span class="desktop-only">Click</span>
        <span class="mobile-only">Tap</span>
        to download {{ext}}.
        <q-btn v-for="(label, i) in labels" :key="i" :label="label" @click="download(ext, i)" />
      </p>
    </div>
  </div>
</template>

<script>
import { saveAs } from 'file-saver'
import {
  QBtn,
  dataTo
} from 'quasar'

export default {
  components: {
    QBtn
  },
  data () {
    return {
      data: [
        {a: 1, b: 2},
        {a: 3, b: 4}
      ],
      headers: [
        undefined,
        null,
        {a: 'foo', b: 'bar'},
        ['b', 'a']
      ],
      labels: [
        'Use keys (default)',
        'No header',
        'Named header',
        'Fields ordered'
      ]
    }
  },
  methods: {
    download (ext, type = 0) {
      let blob
      switch (type) {
        case 0:
          blob = dataTo(ext, this.data)
          break
        default:
          blob = dataTo(ext, this.data, {header: this.headers[type]})
      }
      saveAs(blob, `data.${type}.${ext}`)
    }
  }
}
</script>
