<template>
  <div class="q-pa-md">
    <div class="row items-center q-gutter-sm q-mb-md">
      <q-btn
        v-if="sourceStatus === 'closed'"
        color="positive"
        label="openSource()"
        no-caps
        @click="openSource"
      />
      <q-btn
        v-else
        color="negative"
        label="closeSource()"
        no-caps
        @click="closeSource"
      />

      <div>
        Status:
        <q-badge
          :color="
            sourceStatus === 'open'
              ? 'positive'
              : sourceStatus === 'connecting'
                ? 'warning'
                : 'grey'
          "
          :label="sourceStatus"
        />
      </div>
    </div>

    <div v-if="log.length === 0">No event received yet</div>
    <div v-for="entry in log" :key="entry.id" class="text-caption ellipsis">
      <strong>{{ entry.wiki }}</strong> {{ entry.title }}
      <span class="text-grey">by {{ entry.user }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useEventSource } from 'quasar'

const log = ref([])

// a public stream of the edits made on all Wikimedia projects
const { sourceStatus, openSource, closeSource } = useEventSource(
  'https://stream.wikimedia.org/v2/stream/recentchange',
  {
    lazy: true,
    onMessage(data) {
      const change = JSON.parse(data)
      log.value.unshift({
        id: change.meta.id,
        wiki: change.wiki,
        title: change.title,
        user: change.user
      })
      log.value.length = Math.min(log.value.length, 10)
    }
  }
)
</script>
