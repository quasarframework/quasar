<template>
  <div class="q-layout-padding">
    <q-toggle v-model="center" label="Center" />
    <q-toggle v-model="typeA" label="Type A" />
    <q-toggle v-model="noWrap" label="No Wrap" />

    <div class="bg-yellow">
      <div class="row q-gutter-x-md" :class="rowClass">
        <div class="bg-red">
          Test
        </div>

        <div class="bg-red" style="height: 180px">
          Test
        </div>
      </div>
    </div>

    <q-separator spaced />

    <div class="bg-yellow">
      <div class="row no-wrap q-gutter-x-md" :class="rowClass">
        <q-btn v-bind="props" color="orange" text-color="black">
          <div class="bg-grey-6">
            Nothing
          </div>
          <div class="bg-grey-2">
            Test 1 Test 1 Test 1
          </div>
          <div class="bg-grey-4">
            Test 2 Test 2 Test 2
          </div>
          <div class="bg-grey-2">
            Test 3 Test 3 Test 3
          </div>
          <div class="bg-grey-4">
            Test 4 Test 4 Test 4
          </div>
          <div class="bg-grey-2">
            Test 5 Test 5 Test 5
          </div>
          <div class="bg-grey-4">
            Test 6 Test 6 Test 6
          </div>
        </q-btn>

        <q-btn v-bind="props" color="orange" text-color="black" stretch>
          <div class="bg-grey-6">
            Nothing + stretch
          </div>
          <div class="bg-grey-2">
            Test 1 Test 1 Test 1
          </div>
          <div class="bg-grey-4">
            Test 2 Test 2 Test 2
          </div>
          <div class="bg-grey-2">
            Test 3 Test 3 Test 3
          </div>
          <div class="bg-grey-4">
            Test 4 Test 4 Test 4
          </div>
          <div class="bg-grey-2">
            Test 5 Test 5 Test 5
          </div>
          <div class="bg-grey-4">
            Test 6 Test 6 Test 6
          </div>
        </q-btn>

        <div class="bg-red" style="height: 180px">
          Test
        </div>
      </div>
    </div>

    <q-separator spaced />

    <div class="bg-yellow">
      <div class="row no-wrap q-gutter-x-md" :class="rowClass">
        <q-btn round icon="android" />

        <q-btn v-bind="props" color="orange" text-color="black" stack>
          <div class="bg-grey-6">
            Stack
          </div>
          <div class="bg-grey-2">
            Test 1 Test 1 Test 1
          </div>
          <div class="bg-grey-4">
            Test 2 Test 2 Test 2
          </div>
        </q-btn>

        <q-btn v-bind="props" type="button" color="orange" text-color="black" stack stretch>
          <div class="bg-grey-6">
            Button + Stack + stretch
          </div>
          <div class="bg-grey-2">
            Test 1 Test 1 Test 1
          </div>
          <div class="bg-grey-4">
            Test 2 Test 2 Test 2
          </div>
        </q-btn>

        <q-btn v-bind="props" type="a" color="orange" text-color="black" stack stretch>
          <div class="bg-grey-6">
            A + Stack + stretch
          </div>
          <div class="bg-grey-2">
            Test 1 Test 1 Test 1
          </div>
          <div class="bg-grey-4">
            Test 2 Test 2 Test 2
          </div>
        </q-btn>

        <div class="bg-red" style="height: 180px">
          Test
        </div>
      </div>
    </div>

    <q-separator spaced />

    <div class="bg-yellow overflow-hidden">
      <div class="column no-wrap q-gutter-y-md" :class="rowClass">
        <q-btn round icon="android" />

        <q-btn v-bind="props" color="orange" text-color="black" stack>
          <div class="bg-grey-6">
            Stack
          </div>
          <div class="bg-grey-2">
            Test 1 Test 1 Test 1
          </div>
          <div class="bg-grey-4">
            Test 2 Test 2 Test 2
          </div>
        </q-btn>

        <q-btn v-bind="props" type="button" color="orange" text-color="black" stack stretch>
          <div class="bg-grey-6">
            Button + Stack + stretch
          </div>
          <div class="bg-grey-2">
            Test 1 Test 1 Test 1
          </div>
          <div class="bg-grey-4">
            Test 2 Test 2 Test 2
          </div>
        </q-btn>

        <q-btn v-bind="props" type="a" color="orange" text-color="black" stack stretch>
          <div class="bg-grey-6">
            A + Stack + stretch
          </div>
          <div class="bg-grey-2">
            Test 1 Test 1 Test 1
          </div>
          <div class="bg-grey-4">
            Test 2 Test 2 Test 2
          </div>
        </q-btn>

        <div class="bg-red" style="height: 180px">
          Test
        </div>
      </div>
    </div>

    <q-separator spaced />

    <div class="bg-yellow">
      <div class="row no-wrap q-gutter-x-md" :class="rowClass">
        <q-btn v-bind="props" type="button" color="orange" text-color="black" stack stretch style="width: 300px">
          <div class="bg-grey-6">
            Button + Stack + stretch
          </div>
          <div class="bg-grey-2">
            Test 1 Test 1 Test 1
          </div>
          <div class="bg-grey-4">
            Test 2 Test 2 Test 2
          </div>
        </q-btn>

        <q-btn v-bind="props" type="a" color="orange" text-color="black" stack stretch style="width: 300px">
          <div class="bg-grey-6">
            A + Stack + stretch
          </div>
          <div class="bg-grey-2">
            Test 1 Test 1 Test 1
          </div>
          <div class="bg-grey-4">
            Test 2 Test 2 Test 2
          </div>
        </q-btn>

        <div class="bg-red" style="height: 180px">
          Test
        </div>
      </div>
    </div>

    <q-separator spaced />

    <div class="bg-yellow">
      <div class="row no-wrap q-gutter-x-md" :class="rowClass">
        <q-btn v-bind="props" color="orange" text-color="black" stack align="between">
          <div class="bg-grey-6">
            Stack + between
          </div>
          <div class="bg-grey-2">
            Test 1 Test 1 Test 1
          </div>
          <div class="bg-grey-4">
            Test 2 Test 2 Test 2
          </div>
        </q-btn>

        <q-btn v-bind="props" color="orange" text-color="black" stack stretch align="between">
          <div class="bg-grey-6">
            Stack + between + stretch
          </div>
          <div class="bg-grey-2">
            Test 1 Test 1 Test 1
          </div>
          <div class="bg-grey-4">
            Test 2 Test 2 Test 2
          </div>
        </q-btn>

        <div class="bg-red" style="height: 180px">
          Test
        </div>
      </div>
    </div>

    <q-separator spaced />

    <div class="bg-yellow">
      <div class="row no-wrap q-gutter-x-md" :class="rowClass">
        <q-field outlined label="Test" style="min-width: 20em" class="bg-grey-2" />

        <div class="bg-red" style="height: 180px">
          Test
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      center: false,
      typeA: false,
      noWrap: false
    }
  },
  computed: {
    rowClass () {
      if (this.center === true) {
        return 'items-center'
      }
    },

    props () {
      return {
        type: this.typeA ? 'a' : 'button',
        noWrap: this.noWrap
      }
    }
  }
}
</script>
