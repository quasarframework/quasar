import { ref, getCurrentInstance } from 'vue'

import getEmitsObject from '../../utils/private.get-emits-object/get-emits-object.js'

// To be used for the custom component
// used on a Dialog plugin

export default function useDialogPluginComponent () {
  const { emit, proxy } = getCurrentInstance()

  // we need a Vue reference to the QDialog
  // component so we can handle it;
  // <q-dialog ref="dialogRef" ...
  // make sure that the setup() in which this
  // function is called returns dialogRef variable
  const dialogRef = ref(null)

  function show () { dialogRef.value.show() }
  function hide () { dialogRef.value.hide() }

  function onDialogOK (payload) {
    emit('ok', payload)
    hide()
  }

  function onDialogHide () { emit('hide') }

  // expose public methods required by Dialog plugin
  Object.assign(proxy, { show, hide })

  return {
    dialogRef,
    onDialogHide,
    onDialogOK,
    onDialogCancel: hide
  }
}

// Don't forget to update the types in "ui/types/composables.d.ts"
const emits = [ 'ok', 'hide' ]

useDialogPluginComponent.emits = emits
useDialogPluginComponent.emitsObject = getEmitsObject(emits)
