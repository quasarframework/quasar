<template>
  <div style="padding: 25px">

    <q-btn-dropdown auto-close
      :split="lastMultiAction !== null"
      :icon="lastMultiAction !== null ? multiActions[lastMultiAction].icon : undefined"
      :label="lastMultiAction !== null ? multiActions[lastMultiAction].label : 'Choose action'"
      @click="lastMultiAction !== null ? multiActions[lastMultiAction].handler() : undefined"
    >
      <q-list>
        <q-item v-for="(action, actionKey) in multiActions" :key="actionKey"
          clickable
          @click="() => { lastMultiAction = actionKey; action.handler() }"
        >
          <q-item-section side><q-icon :name="action.icon" /></q-item-section>
          <q-item-section>{{action.label}}</q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

  </div>
</template>

<script>
export default {
  data: function () {
    return {
      lastMultiAction: null
    }
  },
  computed: {
    multiActions () {
      return {
        delete: {
          icon: 'delete',
          label: 'Delete',
          handler: () => {}
        },
        hide: {
          icon: 'visibility_off',
          label: 'Hide',
          handler: () => {}
        }
      }
    }
  }
}
</script>
