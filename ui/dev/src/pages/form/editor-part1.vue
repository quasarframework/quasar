<template>
  <div class="q-layout-padding">
    <q-toggle v-model="hideToolbar" label="Hide Toolbar" class="q-mb-lg" />
    <q-toggle v-model="flat" label="Flat" class="q-mb-lg" />
    <q-toggle v-model="square" label="Square" class="q-mb-lg" />
    <q-toggle v-model="dense" label="Dense" class="q-mb-lg" />

    <q-editor
      v-model="modelWithPlaceHolder"
      :flat="flat"
      :square="square"
      :dense="dense"
      :toolbar="hideToolbar ? [] : [
        ['underline', 'print', 'bold', 'italic', 'link'],
        ['customItalic'],
        ['save', 'upload'],
        ['spellcheck'],
        ['disabledButton'],
        ['custom_btn']
      ]"
      :hide-toolbar="hideToolbar"
      :definitions="{
        bold: {cmd: 'bold', label: 'Bold', tip: 'My bold tooltip'},
        italic: {cmd: 'italic', tip: 'My italic tooltip'},
        customItalic: {cmd: 'italic', icon: 'camera_enhance', tip: 'Italic'},
        save: {tip: 'Save your work', icon: 'save', label: 'Save', handler: saveWork},
        spellcheck: {tip: 'Run spell-check', icon: 'spellcheck', handler: spellCheck},
        upload: {tip: 'Upload to cloud', textColor: 'primary', icon: 'cloud_upload', label: 'Upload', handler: upload},
        disabledButton: {tip: 'I am disabled...', disable: true, icon: 'cloud_off', handler: saveWork}
      }"
      placeholder="Some place holder"
    >
      <template v-slot:custom_btn>
        <q-btn
          size="sm"
          dense
          color="secondary"
          icon="import_contacts"
          label="Import"
          no-wrap
          unelevated
          @click="importSomething"
        />
      </template>
    </q-editor>

    <br><br><br>
    <q-editor
      v-model="model"
      :flat="flat"
      :square="square"
      :dense="dense"
      toolbar-text-color="white"
      toolbar-toggle-color="yellow-8"
      toolbar-bg="primary"
      placeholder="My place holder"
      :toolbar="[
        ['bold', 'italic', 'underline'],
        [{
          label: $q.lang.editor.formatting,
          icon: $q.iconSet.editor.formatting,
          list: 'no-icons',
          options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code']
        }]
      ]"
    />

    <div class="caption bg-yellow">
      Model
    </div>
    <div>{{ model }}</div>

    <br><br><br>

    <q-select
      v-model="btnType"
      :options="[
        { label: 'Default (flat)', value: 'none' },
        { label: 'Outline', value: 'outline' },
        { label: 'Push', value: 'push' }
      ]"
      emit-value
      map-options
      class="q-mb-md"
    />
    <q-editor
      ref="editor"
      class="bg-grey"
      max-height="100px"
      v-model="modelScroll"
      :flat="flat"
      :square="square"
      :dense="dense"
      :toolbar-push="push"
      :toolbar-outline="outline"
      :toolbar-rounded="rounded"
      :toolbar="[
        ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
        ['token', 'hr', 'link', 'custom_btn'],
        ['print', 'fullscreen'],
        [
          {
            label: $q.lang.editor.formatting,
            icon: $q.iconSet.editor.formatting,
            list: 'no-icons',
            options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code']
          },
          {
            label: $q.lang.editor.fontSize,
            icon: $q.iconSet.editor.fontSize,
            fixedLabel: true,
            fixedIcon: true,
            list: 'no-icons',
            options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7']
          },
          {
            label: $q.lang.editor.defaultFont,
            icon: $q.iconSet.editor.font,
            fixedIcon: true,
            list: 'no-icons',
            options: ['default_font', 'arial', 'arial_black', 'comic_sans', 'courier_new', 'impact', 'lucida_grande', 'times_new_roman', 'verdana']
          },
          'removeFormat'
        ],
        ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
        [
          {
            label: $q.lang.editor.align,
            icon: $q.iconSet.editor.align,
            fixedLabel: true,
            list: 'only-icons',
            options: ['left', 'center', 'right', 'justify']
          },
          {
            label: $q.lang.editor.align,
            icon: $q.iconSet.editor.align,
            fixedLabel: true,
            options: ['left', 'center', 'right', 'justify']
          }
        ],
        ['undo', 'redo'],
        [{
          label: 'Dropdown Test',
          highlight: true,
          options: ['gogu', 'outdent', 'indent', 'gigi']
        }],
        ['viewsource']
      ]"
      :fonts="{
        arial: 'Arial',
        arial_black: 'Arial Black',
        comic_sans: 'Comic Sans MS',
        courier_new: 'Courier New',
        impact: 'Impact',
        lucida_grande: 'Lucida Grande',
        times_new_roman: 'Times New Roman',
        verdana: 'Verdana'
      }"
      :definitions="{
        gigi: {cmd: 'bold', icon: 'map', tip: 'Gigi bold'},
        bold: {icon: 'content_paste'},
        gogu: {tip: 'Custom', icon: 'account_balance', handler: vm => vm.runCmd('print')}
      }"
    >
      <template v-slot:custom_btn>
        <q-btn dense color="yellow" no-wrap size="sm">
          Wow
        </q-btn>
      </template>

      <template v-slot:token>
        <q-btn-dropdown dense no-caps ref="token" no-wrap color="green" label="Token" size="sm">
          <q-list>
            <q-item tag="label" clickable @click="add('email')">
              <q-item-section side>
                <q-icon name="mail" />
              </q-item-section>
              <q-item-section>Email</q-item-section>
            </q-item>
            <q-item tag="label" clickable @click="add('title')">
              <q-item-section side>
                <q-icon name="title" />
              </q-item-section>
              <q-item-section>Title</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </template>
    </q-editor>

    <div class="caption bg-yellow">
      Model
    </div>
    <div>{{ modelScroll }}</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      hideToolbar: false,
      flat: false,
      square: false,
      dense: false,
      btnType: 'none',
      push: false,
      outline: false,
      rounded: false,
      modelWithPlaceHolder: '',
      model: 'Editor in <a href="http://quasar.dev">Quasar</a></div><div>Second line',
      modelScroll: 'Editor in <a href="http://quasar.dev">Quasar</a></div><div style="height: 500px; background: yellow">Spacer 1</div><div style="height: 500px; background: yellow">Spacer 2</div><div>Second line'
    }
  },
  watch: {
    btnType (val) {
      [ 'push', 'outline', 'flat' ].forEach(type => {
        this[ type ] = type === val
      })
    }
  },
  methods: {
    saveWork () {
      this.$q.notify({
        icon: 'done',
        color: 'positive',
        message: 'I guess something got saved.'
      })
    },
    upload () {
      this.$q.notify({
        icon: 'cloud_upload',
        color: 'secondary',
        message: 'Hmm, will upload at another time, ok?'
      })
    },
    spellCheck () {
      this.$q.notify({
        icon: 'spellcheck',
        color: 'secondary',
        message: 'I\'ll sure run the spellcheck. Later.'
      })
    },
    importSomething () {
      this.$q.notify({
        color: 'accent',
        message: 'Importing...'
      })
    },
    add (name) {
      const edit = this.$refs.editor
      this.$refs.token.hide()
      edit.caret.restore()
      edit.runCmd('insertHTML', `&nbsp;<div class="editor_token row inline items-center" contenteditable="false">&nbsp;<span>${ name }</span>&nbsp;<i class="q-icon material-icons cursor-pointer" onclick="this.parentNode.parentNode.removeChild(this.parentNode)">close</i></div>&nbsp;`)
      edit.focus()
    }
  }
}
</script>

<style lang="sass">
.editor_token
  background: rgba(0, 0, 0, .6)
  color: white
  padding: 3px
  &, .q-icon
    border-radius: 3px
  .q-icon
    background: rgba(0, 0, 0, .2)
</style>
