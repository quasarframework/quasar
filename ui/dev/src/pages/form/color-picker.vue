<template>
  <div class="q-layout-padding" :class="dark ? 'bg-black text-white' : ''">
    <div style="max-width: 600px" class="q-gutter-y-md">
      <div class="q-gutter-x-md">
        <q-toggle :dark="dark" v-model="dark" label="Dark" :false-value="null" />
        <q-toggle :dark="dark" v-model="bordered" label="Bordered" />
        <q-toggle :dark="dark" v-model="flat" label="Flat" />
        <q-toggle :dark="dark" v-model="square" label="Square" />
        <q-toggle :dark="dark" v-model="disable" label="Disable" />
        <q-toggle :dark="dark" v-model="readonly" label="Readonly" />
        <q-toggle :dark="dark" v-model="inline" label="Inline" />
      </div>

      <div>
        <q-chip>{{ hex }}</q-chip>
        <q-chip>{{ hexa }}</q-chip>
        <q-chip>{{ rgb }}</q-chip>
        <q-chip>{{ rgba }}</q-chip>
      </div>
      <div class="text-h6">
        v-model + @change
      </div>
      <div class="row items-start q-gutter-md">
        <q-color v-bind="props" v-model="hex" @change="onChange" />
        <q-color v-bind="props" v-model="hexa" @change="onChange" />
        <q-color v-bind="props" v-model="rgb" @change="onChange" />
        <q-color v-bind="props" v-model="rgba" @change="onChange" />
      </div>

      <div>
        <q-chip>{{ hex }}</q-chip>
        <q-chip>{{ hexa }}</q-chip>
        <q-chip>{{ rgb }}</q-chip>
        <q-chip>{{ rgba }}</q-chip>
      </div>
      <div class="text-h6">
        :model-value + @change
      </div>
      <div class="row items-start q-gutter-md">
        <q-color v-bind="props" :model-value="hex" @change="val => { hex = val; onChange(val) }" />
        <q-color v-bind="props" :model-value="hexa" @change="val => { hexa = val; onChange(val) }" />
        <q-color v-bind="props" :model-value="rgb" @change="val => { rgb = val; onChange(val) }" />
        <q-color v-bind="props" :model-value="rgba" @change="val => { rgba = val; onChange(val) }" />
      </div>

      <div>
        <q-chip>{{ hex }}</q-chip>
        <q-chip>{{ hexa }}</q-chip>
        <q-chip>{{ rgb }}</q-chip>
        <q-chip>{{ rgba }}</q-chip>
      </div>
      <div class="q-gutter-md">
        <q-color v-bind="props" v-model="hex" />
        <q-color v-bind="props" v-model="hexa" />
        <q-color v-bind="props" v-model="rgb" />
        <q-color v-bind="props" v-model="rgba" />
      </div>

      <div class="text-h6">
        Null/Undefined model
        <q-btn outline color="primary" size="sm" label="Reset" @click="setNull" />
      </div>
      <div>
        <q-chip>{{ nullHex || 'null' }}</q-chip>
        <q-chip>{{ nullHexa || 'null' }}</q-chip>
        <q-chip>{{ nullRgb || 'null' }}</q-chip>
        <q-chip>{{ nullRgba || 'null' }}</q-chip>
      </div>
      <div class="q-gutter-md">
        <q-color v-bind="props" v-model="nullHex" />
        <q-color v-bind="props" format-model="hexa" v-model="nullHexa" />
        <q-color v-bind="props" format-model="rgb" v-model="nullRgb" />
        <q-color v-bind="props" format-model="rgba" v-model="nullRgba" />
      </div>

      <div class="text-h6">
        Lazy
      </div>
      <div>
        <q-chip>{{ hex }}</q-chip>
        <q-chip>{{ hexa }}</q-chip>
        <q-chip>{{ rgb }}</q-chip>
        <q-chip>{{ rgba }}</q-chip>
      </div>
      <div class="q-gutter-md">
        <q-color v-bind="props" :model-value="hex" @change="val => hex = val" />
        <q-color v-bind="props" :model-value="hexa" @change="val => hexa = val" />
        <q-color v-bind="props" :model-value="rgb" @change="val => rgb = val" />
        <q-color v-bind="props" :model-value="rgba" @change="val => rgba = val" />
      </div>

      <div class="text-h6">
        Custom palette
      </div>
      <div>
        <q-chip>{{ hex }}</q-chip>
        <q-chip>{{ hexa }}</q-chip>
        <q-chip>{{ rgb }}</q-chip>
        <q-chip>{{ rgba }}</q-chip>
      </div>
      <div class="row q-gutter-md">
        <q-color
          v-bind="props"
          :palette="customPalette"
          v-model="hex"
          default-view="palette"
          no-header
          no-footer
        />
        <q-color
          v-bind="props"
          :palette="customPalette"
          v-model="hexa"
          default-view="palette"
          no-header
          no-footer
        />
        <q-color
          v-bind="props"
          :palette="customPalette"
          v-model="rgb"
          default-view="palette"
          no-header
          no-footer
        />
        <q-color
          v-bind="props"
          :palette="customPalette"
          v-model="rgba"
          default-view="palette"
          no-header
          no-footer
        />
      </div>

      <div class="text-h6">
        Input: {{ inputModelHex }}
      </div>
      <div class="q-gutter-md">
        <q-input :dark="dark" filled v-model="inputModelHex" :rules="['anyColor']">
          <template v-slot:append>
            <q-icon name="colorize" class="cursor-pointer">
              <q-popup-proxy>
                <q-color v-model="inputModelHex" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input :dark="dark" hint="Some hint" filled v-model="inputModelHex" :rules="['anyColor']">
          <template v-slot:before>
            <q-icon name="colorize" class="cursor-pointer">
              <q-popup-proxy>
                <q-color v-model="inputModelHex" />
              </q-popup-proxy>
            </q-icon>
          </template>
          <template v-slot:after>
            <q-icon name="colorize" class="cursor-pointer">
              <q-popup-proxy>
                <q-color v-model="inputModelHex" />
              </q-popup-proxy>
            </q-icon>
          </template>
          <template v-slot:prepend>
            <q-icon name="colorize" class="cursor-pointer">
              <q-popup-proxy>
                <q-color v-model="inputModelHex" />
              </q-popup-proxy>
            </q-icon>
          </template>
          <template v-slot:append>
            <q-icon name="colorize" class="cursor-pointer">
              <q-popup-proxy>
                <q-color v-model="inputModelHex" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dark: null,
      bordered: false,
      flat: false,
      square: false,
      disable: false,
      readonly: false,
      inline: true,

      hex: '#FF00FF',
      hexa: '#FF00FFCC',
      rgb: 'rgb(0,0,0)',
      rgba: 'rgba(255,0,255,1)',

      nullHex: null,
      nullHexa: null,
      nullRgb: null,
      nullRgba: null,

      customPalette: [ '#ff0000', '#ffff00', '#0000f5', 'rgb(255,0,0)', 'rgb(255,255,0)', 'rgb(0,0,245)', 'rgba(255,0,0,0.5)' ],

      inputModelHex: '#FF00FF'
    }
  },

  computed: {
    props () {
      return {
        dark: this.dark,
        bordered: this.bordered,
        flat: this.flat,
        square: this.square,
        disable: this.disable,
        readonly: this.readonly,
        inline: this.inline
      }
    }
  },

  methods: {
    setNull () {
      this.nullHex = this.nullHexa = this.nullRgb = this.nullRgba = null
    },

    onChange (val) {
      console.log('@change', JSON.stringify(val))
      this.$q.notify('@change ' + JSON.stringify(val))
    }
  }
}
</script>
