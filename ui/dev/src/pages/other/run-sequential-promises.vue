<template>
  <div class="q-layout-padding run-sequential-promises">
    <q-markup-table separator="cell" flat bordered dense>
      <thead>
        <tr>
          <th class="text-left">
            Propose
          </th>
          <th class="text-left">
            abortOnFail
          </th>
          <th class="text-left">
            Threads
          </th>
          <th class="text-left">
            Outcome
          </th>
          <th class="text-left">
            Return value
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(test, index) in testList" :key="index">
          <td class="text-left">
            <div class="row items-center no-wrap fixed-cell">
              {{ test.proposed }}
            </div>
          </td>
          <td class="text-left">
            <div class="row items-center no-wrap fixed-cell">
              {{ test.abortOnFail }}
            </div>
          </td>
          <td class="text-left">
            <div class="row items-center no-wrap fixed-cell">
              {{ test.threads }}
            </div>
          </td>
          <td class="text-left" :class="`text-${test.color}`">
            <div class="row items-center no-wrap fixed-cell">
              <q-icon size="2em" :name="test.icon" />
              <div class="q-ml-sm">{{ test.outcome }}</div>
            </div>
          </td>
          <td class="text-left">
            <pre>{{ test.result }}</pre>
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script setup>
import { runSequentialPromises, is } from 'quasar'
import { ref } from 'vue'

const testList = ref([])

function getPromiseList (fail) {
  return [
    () => new Promise(resolve => {
      setTimeout(() => { resolve('one') }, Math.random() * 1000)
    }),

    () => new Promise((resolve, reject) => {
      setTimeout(() => {
        if (fail) { reject('cannot settle promise 2') }
        else { resolve('two') }
      }, Math.random() * 1000)
    }),

    () => new Promise(resolve => {
      setTimeout(() => { resolve('three') }, Math.random() * 1000)
    }),

    () => new Promise(resolve => {
      setTimeout(() => { resolve('four') }, Math.random() * 1000)
    }),

    () => new Promise(resolve => {
      setTimeout(() => { resolve('five') }, Math.random() * 1000)
    })
  ]
}

function runTest (fixture, runFn) {
  const index = testList.value.length

  testList.value[ index ] = {
    proposed: fixture[ 0 ],
    abortOnFail: fixture[ 1 ],
    threads: fixture[ 2 ],

    icon: 'auto_mode',
    outcome: 'running',
    result: '...',
    color: 'grey'
  }

  runFn((result, success) => {
    Object.assign(testList.value[ index ], {
      icon: success ? 'done' : 'cancel',
      outcome: success ? 'as expected' : 'FAIL',
      result: JSON.stringify(result),
      color: success ? 'green' : 'negative'
    })
  })
}

runTest([ '3 resolve', 'yes', '1 thread' ], setResult => {
  runSequentialPromises(getPromiseList(), { abortOnFail: true }).then(list => {
    setResult(
      list,
      is.deepEqual(list, [
        { promiseIndex: 0, data: 'one' },
        { promiseIndex: 1, data: 'two' },
        { promiseIndex: 2, data: 'three' },
        { promiseIndex: 3, data: 'four' },
        { promiseIndex: 4, data: 'five' }
      ])
    )
  }).catch(result => {
    setResult(result, false)
  })
})

runTest([ '3 resolve', '', '1 thread' ], setResult => {
  runSequentialPromises(getPromiseList(), { abortOnFail: false }).then(list => {
    setResult(
      list,
      is.deepEqual(list, [
        { promiseIndex: 0, data: 'one' },
        { promiseIndex: 1, data: 'two' },
        { promiseIndex: 2, data: 'three' },
        { promiseIndex: 3, data: 'four' },
        { promiseIndex: 4, data: 'five' }
      ])
    )
  }).catch(result => {
    setResult(result, false)
  })
})

runTest([ '3 resolve', 'yes', '2 thread' ], setResult => {
  runSequentialPromises(getPromiseList(), { abortOnFail: true, threadsNumber: 2 }).then(list => {
    setResult(
      list,
      is.deepEqual(list, [
        { promiseIndex: 0, data: 'one' },
        { promiseIndex: 1, data: 'two' },
        { promiseIndex: 2, data: 'three' },
        { promiseIndex: 3, data: 'four' },
        { promiseIndex: 4, data: 'five' }
      ])
    )
  }).catch(result => {
    setResult(result, false)
  })
})

runTest([ '3 resolve', '-', '2 thread' ], setResult => {
  runSequentialPromises(getPromiseList(), { abortOnFail: false, threadsNumber: 2 }).then(list => {
    setResult(
      list,
      is.deepEqual(list, [
        { promiseIndex: 0, data: 'one' },
        { promiseIndex: 1, data: 'two' },
        { promiseIndex: 2, data: 'three' },
        { promiseIndex: 3, data: 'four' },
        { promiseIndex: 4, data: 'five' }
      ])
    )
  }).catch(result => {
    setResult(result, false)
  })
})

runTest([ '1 reject', 'yes', '1 thread' ], setResult => {
  runSequentialPromises(getPromiseList(true), { abortOnFail: true }).then(list => {
    setResult(list, false)
  }).then(result => {
    setResult(result, false)
  }).catch(result => {
    setResult(
      result,
      is.deepEqual(result, { promiseIndex: 1, error: 'cannot settle promise 2' })
    )
  })
})

runTest([ '1 reject', '-', '1 thread' ], setResult => {
  runSequentialPromises(getPromiseList(true), { abortOnFail: false }).then(list => {
    setResult(
      list,
      is.deepEqual(list, [
        { promiseIndex: 0, data: 'one' },
        { promiseIndex: 1, error: 'cannot settle promise 2' },
        { promiseIndex: 2, data: 'three' },
        { promiseIndex: 3, data: 'four' },
        { promiseIndex: 4, data: 'five' }
      ])
    )
  }).catch(result => {
    setResult(result, false)
  })
})

runTest([ '1 reject', 'yes', '2 threads' ], setResult => {
  runSequentialPromises(getPromiseList(true), { abortOnFail: true, threadsNumber: 2 }).then(list => {
    setResult(list, false)
  }).then(result => {
    setResult(result, false)
  }).catch(result => {
    setResult(
      result,
      is.deepEqual(result, { promiseIndex: 1, error: 'cannot settle promise 2' })
    )
  })
})

runTest([ '1 reject', '-', '2 threads' ], setResult => {
  runSequentialPromises(getPromiseList(true), { abortOnFail: false, threadsNumber: 2 }).then(list => {
    setResult(
      list,
      is.deepEqual(list, [
        { promiseIndex: 0, data: 'one' },
        { promiseIndex: 1, error: 'cannot settle promise 2' },
        { promiseIndex: 2, data: 'three' },
        { promiseIndex: 3, data: 'four' },
        { promiseIndex: 4, data: 'five' }
      ])
    )
  }).catch(result => {
    setResult(result, false)
  })
})
</script>

<style lang="sass">
.run-sequential-promises
  pre
    margin: 0
    font-size: 10px
  .fixed-cell
    height: 35px
</style>
