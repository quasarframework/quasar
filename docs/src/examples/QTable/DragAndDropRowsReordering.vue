<template>
  <div class="q-pa-md">
    <q-table flat bordered title="Treats" :rows="rows" :columns="columns" row-key="name">
      <template #body-cell-drag-handle="props">
        <q-td :props="props">
          <q-icon name="drag_handle" size="md" class="drag-handle" />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import Sortable from 'https://esm.run/sortablejs@latest'
import { getCurrentInstance, onMounted, onUnmounted, ref } from 'vue'

// Borrowed from https://github.com/angular/components/blob/master/src/cdk/drag-drop/drag-utils.ts

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/** Clamps a number between zero and a maximum. */
function clamp (value, max) {
  return Math.max(0, Math.min(max, value))
}

/**
 * Moves an item one index in an array to another.
 * @param array Array in which to move the item.
 * @param fromIndex Starting index of the item.
 * @param toIndex Index to which the item should be moved.
 */
function moveItemInArray (
  array,
  fromIndex,
  toIndex
) {
  const from = clamp(fromIndex, array.length - 1)
  const to = clamp(toIndex, array.length - 1)

  if (from === to) {
    return
  }

  const target = array[ from ]
  const delta = to < from ? -1 : 1

  for (let i = from; i !== to; i += delta) {
    array[ i ] = array[ i + delta ]
  }

  array[ to ] = target
}

// ------------------------------

const columns = [
  {
    name: 'drag-handle',
    required: true,
    align: 'left'
  },
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    field: 'name'
  }
]

export default {
  setup () {
    const rows = ref([
      { name: 'Frozen Yogurt' },
      { name: 'Ice cream sandwich' },
      { name: 'Eclair' },
      { name: 'Cupcake' },
      { name: 'Gingerbread' },
      { name: 'Jelly bean' },
      { name: 'Lollipop' },
      { name: 'Honeycomb' },
      { name: 'Donut' },
      { name: 'KitKat' }
    ])

    let sortable
    const instance = getCurrentInstance().proxy
    onMounted(() => {
      const tableBody = instance.$el.querySelector('.q-table > tbody')
      // Check out other options at https://github.com/SortableJS/Sortable#options
      sortable = Sortable.create(tableBody, {
        handle: '.drag-handle',
        animation: 150,
        onUpdate ({ oldIndex, newIndex }) {
          moveItemInArray(rows.value, oldIndex, newIndex)
        }
      })
    })
    onUnmounted(() => {
      sortable.destroy()
    })

    return {
      columns,
      rows
    }
  }
}
</script>

<style scoped>
.drag-handle {
  cursor: move;
  cursor: -webkit-grabbing;
}
</style>
