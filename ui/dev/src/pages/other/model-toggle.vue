<template>
  <div class="q-layout-padding q-mx-auto" style="max-width: 600px;">
    <q-list bordered separator class="q-mt-lg">
      <q-item-label header>
        Expansion Item - no model
      </q-item-label>
      <q-separator />

      <q-expansion-item
        default-opened
        label="Expansion Item - defaultOpened"
      >
        <q-card>
          <q-card-section>{{ lorem }}</q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        label="Expansion Item"
      >
        <q-card>
          <q-card-section>{{ lorem }}</q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        default-opened
        label="Expansion Item - defaultOpened"
      >
        <q-card>
          <q-card-section>{{ lorem }}</q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>

    <q-list bordered separator class="q-mt-lg">
      <q-item-label header>
        Expansion Item - model
      </q-item-label>
      <q-separator />

      <q-expansion-item
        v-model="expModelOpen1"
        default-opened
        :label="`Expansion Item - model [${ expModelOpen1 }] (started as true) - defaultOpened`"
      >
        <q-card>
          <q-card-section>{{ lorem }}</q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        v-model="expModelClosed1"
        default-opened
        :label="`Expansion Item - model [${ expModelClosed1 }] (started as false) - defaultOpened`"
      >
        <q-card>
          <q-card-section>{{ lorem }}</q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        v-model="expModelOpen2"
        :label="`Expansion Item - model [${ expModelOpen2 }] (started as true)`"
      >
        <q-card>
          <q-card-section>{{ lorem }}</q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        v-model="expModelClosed2"
        :label="`Expansion Item - model [${ expModelClosed2 }] (started as false)`"
      >
        <q-card>
          <q-card-section>{{ lorem }}</q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>

    <q-list bordered separator class="q-mt-lg">
      <q-item-label header>
        Expansion Item - Accordion - no model
      </q-item-label>
      <q-separator />

      <q-expansion-item
        group="group1"
        default-opened
        label="Expansion Item - Accordion (group1) - defaultOpened - should start open even if next defaultOpened"
      >
        <q-card>
          <q-card-section>{{ lorem }}</q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        group="group1"
        label="Expansion Item - Accordion (group1)"
      >
        <q-card>
          <q-card-section>{{ lorem }}</q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        :group="changingGroup"
        default-opened
        :label="`Expansion Item - Accordion (${changingGroup}) - defaultOpened - should start opened`"
      >
        <q-card>
          <q-card-section>
            <q-radio v-model="changingGroup" val="group1" label="group1" />
            <q-radio v-model="changingGroup" val="group2" label="group2" />
          </q-card-section>
          <q-card-section>{{ lorem }}</q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        group="group2"
        default-opened
        label="Expansion Item - Accordion (group2) - defaultOpened - should start opened"
      >
        <q-card>
          <q-card-section>{{ lorem }}</q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>

    <q-card class="q-mt-lg">
      <q-card-section>
        <q-input v-model="showHideSequence" label="Sequence of show/hide/$nextTick (s/h/t)" />
      </q-card-section>
      <q-card-actions vertical>
        <q-btn :label="`Run on ExpansionItem - should end up ${showHideSequenceEndStatus}`" @click="runSequence($refs.refExpansionItem)" />
        <q-btn :label="`Run on ExpansionItem - model [${seqModelExpansionItem}] - should end up ${showHideSequenceEndStatus}`" @click="runSequence($refs.refExpansionItemModel)" />
        <q-btn :label="`Run on Dialog - should end up ${showHideSequenceEndStatus}`" @click="runSequence($refs.refDialog)" />
        <q-btn :label="`Run on Dialog - model [${seqModelDialog}] - should end up ${showHideSequenceEndStatus}`" @click="runSequence($refs.refDialogModel)" />
      </q-card-actions>

      <q-list separator>
        <q-expansion-item
          ref="refExpansionItem"
          :label="`Expansion Item - no model`"
        >
          <q-card>
            <q-card-section>{{ lorem }}</q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          ref="refExpansionItemModel"
          v-model="seqModelExpansionItem"
          :label="`Expansion Item - model [${seqModelExpansionItem}]`"
        >
          <q-card>
            <q-card-section>{{ lorem }}</q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>

      <q-dialog ref="refDialog">
        <q-card class="q-pa-lg">
          Dialog
        </q-card>
      </q-dialog>

      <q-dialog ref="refDialogModel" v-model="seqModelDialog">
        <q-card>
          <q-card-section>
            <q-input v-model="showHideSequence" label="Sequence of show/hide/$nextTick (s/h/t)" autofocus />
          </q-card-section>
          <q-card-actions vertical>
            <q-btn :label="`Run on Dialog - model [${seqModelDialog}] - should end up ${showHideSequenceEndStatus}`" @click="runSequence($refs.refDialogModel)" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      expModelOpen1: true,
      expModelClosed1: false,
      expModelOpen2: true,
      expModelClosed2: false,
      changingGroup: 'group1',

      showHideSequence: 'htshs',
      seqModelExpansionItem: true,
      seqModelDialog: true,

      lorem: 'Lorem ipsum dolor sit amet...'
    }
  },
  computed: {
    showHideSequenceArr () {
      return this.showHideSequence.toLowerCase().split('').filter(v => [ 's', 'h', 't' ].indexOf(v) > -1)
    },
    showHideSequenceEndStatus () {
      const
        filtered = this.showHideSequenceArr.filter(v => v !== 't'),
        len = filtered.length
      return len === 0
        ? 'N/A'
        : (filtered[ len - 1 ] === 's' ? 'opened' : 'closed')
    }
  },
  methods: {
    runSequence (ref, seq = this.showHideSequenceArr) {
      const len = seq.length

      for (let i = 0; i < len; i++) {
        if (seq[ i ] === 't') {
          this.$nextTick(() => {
            this.runSequence(ref, seq.slice(i + 1))
          })

          return
        }
        ref[ seq[ i ] === 's' ? 'show' : 'hide' ]()
      }
    }
  }
}
</script>
