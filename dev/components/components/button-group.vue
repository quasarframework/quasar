<template>
  <div class="layout-padding button-group-test">
    <q-btn-group>
      <q-btn color="yellow">
        First
      </q-btn>
      <q-btn color="amber">
        Second
      </q-btn>
      <q-btn color="orange">
        Third
      </q-btn>
    </q-btn-group>
    <br>
    <q-btn-group push>
      <q-btn color="yellow" push>
        First
      </q-btn>
      <q-btn color="amber" push>
        Second
      </q-btn>
      <q-btn color="orange" push>
        Third
      </q-btn>
    </q-btn-group>
    <br>
    <q-btn-group rounded>
      <q-btn color="yellow" rounded>
        First
      </q-btn>
      <q-btn color="amber" rounded>
        Second
      </q-btn>
      <q-btn color="orange" rounded>
        Third
      </q-btn>
    </q-btn-group>
    <br>
    <q-btn-group outline>
      <q-btn color="yellow" outline>
        First
      </q-btn>
      <q-btn color="amber" outline>
        Second
      </q-btn>
      <q-btn color="orange" outline>
        Third
      </q-btn>
    </q-btn-group>
    <br>
    <q-btn-group flat>
      <q-btn color="yellow" flat>
        First
      </q-btn>
      <q-btn color="amber" flat>
        Second
      </q-btn>
      <q-btn color="orange" flat>
        Third
      </q-btn>
    </q-btn-group>
  </div>
</template>

<style lang="stylus">
.button-group-test
  .q-btn-group
    margin 5px 15px
</style>
