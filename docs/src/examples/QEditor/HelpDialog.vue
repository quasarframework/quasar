<template>
  <div class="q-pa-md q-gutter-sm">
    <q-editor
      v-model="editor"
      aria-label="Help dialog demonstration"
      min-height="5rem"
      :toolbar="[['bold', 'italic', 'underline'], ['undo', 'redo'], ['help']]"
    >
      <template v-slot:help>
        <q-btn
          dense
          flat
          size="sm"
          icon="help_outline"
          aria-label="Editor help"
          @click="showHelp = true"
        />
      </template>
    </q-editor>

    <q-dialog v-model="showHelp">
      <q-card>
        <q-card-section>
          <div class="text-h6">Editor help</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-markup-table flat bordered>
            <thead>
              <tr>
                <th class="text-left">Keys</th>
                <th class="text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="shortcut in shortcuts" :key="shortcut.keys">
                <td
                  ><kbd>{{ shortcut.keys }}</kbd></td
                >
                <td>{{ shortcut.action }}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const editor = ref('Press the help button at the end of the toolbar.')
const showHelp = ref(false)

const shortcuts = [
  { keys: 'TAB', action: 'Move between the toolbar and the editing area' },
  {
    keys: 'ARROW LEFT / ARROW RIGHT',
    action: 'Move between the toolbar buttons'
  },
  { keys: 'HOME / END', action: 'Jump to the first / last toolbar button' },
  { keys: 'CTRL + B', action: 'Bold' },
  { keys: 'CTRL + I', action: 'Italic' },
  { keys: 'CTRL + U', action: 'Underline' },
  { keys: 'CTRL + Z', action: 'Undo' },
  { keys: 'CTRL + Y', action: 'Redo' }
]
</script>
