<template>
  <div class="layout-padding">
    <q-document :title="`My choice: ${option}`"/>
    <b>Dynamic document title</b>
    <p>This component permits you to bind to the document title directly from your template, and update it dynamically</p>
    <q-btn label="tree" color="primary" @click="option='tree'"/>
    <q-btn label="flower" color="primary" @click="option='flower'"/>
    <q-btn label="sun" color="primary" @click="option='sun'"/>
  </div>
</template>

<script>
export default {
  data () {
    return {
      option: ''
    }
  }
}
</script>
