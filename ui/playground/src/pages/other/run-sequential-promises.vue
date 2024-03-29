<template>
  <div class="q-layout-padding run-sequential-promises">
    <q-markup-table separator="cell" flat bordered dense>
      <thead>
        <tr>
          <th class="text-left">
            Type
          </th>
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
            <div class="row items-center no-wrap">
              {{ test.type }}
            </div>
          </td>
          <td class="text-left">
            <div class="row items-center no-wrap">
              {{ test.proposed }}
            </div>
          </td>
          <td class="text-left">
            <div class="row items-center no-wrap">
              {{ test.abortOnFail }}
            </div>
          </td>
          <td class="text-left">
            <div class="row items-center no-wrap">
              {{ test.threads }}
            </div>
          </td>
          <td class="text-left" :class="`text-${test.color}`">
            <div class="row items-center no-wrap">
              <q-icon :name="test.icon" />
              <div class="q-ml-sm">{{ test.outcome }}</div>
            </div>
          </td>
          <td class="text-left">
            <div class="row items-center no-wrap">
              <q-btn unelevated label="Copy" no-caps size="xs" dense color="primary" class="q-mr-xs" @click="test.copy" />
              <pre>{{ test.result }}</pre>
            </div>
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script setup>
import { runSequentialPromises, is, copyToClipboard, Notify } from 'quasar'
import { ref } from 'vue'

const testList = ref([])

function runTest (fixture, runFn) {
  const index = testList.value.length

  testList.value[ index ] = {
    type: fixture[ 0 ],
    proposed: fixture[ 1 ],
    abortOnFail: fixture[ 2 ],
    threads: fixture[ 3 ],

    icon: 'auto_mode',
    outcome: 'running',
    result: '...',
    color: 'grey',

    copy: () => {
      copyToClipboard(testList.value[ index ].result)
        .then(() => {
          Notify.create({
            type: 'positive',
            message: 'Copied result to clipboard'
          })
        })
        .catch(() => {
          Notify.create({
            type: 'negative',
            message: 'Could not copy to clipboard'
          })
        })
    }
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

function getPromiseList (fail) {
  return [
    resultAggregator => new Promise((resolve, reject) => {
      if (resultAggregator.length !== 5) {
        reject('resultAggregator is NOT a 5 element array')
      }
      else {
        setTimeout(() => { resolve('one') }, Math.random() * 1000)
      }
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

    resultAggregator => new Promise((resolve, reject) => {
      if (Array.isArray(resultAggregator) === false) {
        reject('resultAggregator is NOT an array')
      }
      else {
        setTimeout(() => { resolve('four') }, Math.random() * 1000)
      }
    }),

    resultAggregator => new Promise((resolve, reject) => {
      if (resultAggregator[ 0 ].status !== 'fulfilled') {
        reject('resultAggregator does NOT have result of first promise')
      }
      else if (resultAggregator[ 0 ].value !== 'one') {
        reject('resultAggregator does NOT have correct value for first promise')
      }
      else {
        setTimeout(() => { resolve('five') }, Math.random() * 1000)
      }
    })
  ]
}

runTest([ 'list', 'resolve all', 'yes', '1 thread' ], setResult => {
  runSequentialPromises(getPromiseList(), { abortOnFail: true }).then(list => {
    setResult(
      list,
      is.deepEqual(list, [
        { key: 0, status: 'fulfilled', value: 'one' },
        { key: 1, status: 'fulfilled', value: 'two' },
        { key: 2, status: 'fulfilled', value: 'three' },
        { key: 3, status: 'fulfilled', value: 'four' },
        { key: 4, status: 'fulfilled', value: 'five' }
      ])
    )
  }).catch(result => {
    setResult(result, false)
  })
})

runTest([ 'list', 'resolve all', '-', '1 thread' ], setResult => {
  runSequentialPromises(getPromiseList(), { abortOnFail: false }).then(list => {
    setResult(
      list,
      is.deepEqual(list, [
        { key: 0, status: 'fulfilled', value: 'one' },
        { key: 1, status: 'fulfilled', value: 'two' },
        { key: 2, status: 'fulfilled', value: 'three' },
        { key: 3, status: 'fulfilled', value: 'four' },
        { key: 4, status: 'fulfilled', value: 'five' }
      ])
    )
  }).catch(result => {
    setResult(result, false)
  })
})

runTest([ 'list', 'resolve all', 'yes', '2 thread' ], setResult => {
  runSequentialPromises(getPromiseList(), { abortOnFail: true, threadsNumber: 2 }).then(list => {
    setResult(
      list,
      is.deepEqual(list, [
        { key: 0, status: 'fulfilled', value: 'one' },
        { key: 1, status: 'fulfilled', value: 'two' },
        { key: 2, status: 'fulfilled', value: 'three' },
        { key: 3, status: 'fulfilled', value: 'four' },
        { key: 4, status: 'fulfilled', value: 'five' }
      ])
    )
  }).catch(result => {
    setResult(result, false)
  })
})

runTest([ 'list', 'resolve all', '-', '2 thread' ], setResult => {
  runSequentialPromises(getPromiseList(), { abortOnFail: false, threadsNumber: 2 }).then(list => {
    setResult(
      list,
      is.deepEqual(list, [
        { key: 0, status: 'fulfilled', value: 'one' },
        { key: 1, status: 'fulfilled', value: 'two' },
        { key: 2, status: 'fulfilled', value: 'three' },
        { key: 3, status: 'fulfilled', value: 'four' },
        { key: 4, status: 'fulfilled', value: 'five' }
      ])
    )
  }).catch(result => {
    setResult(result, false)
  })
})

runTest([ 'list', 'reject 2nd', 'yes', '1 thread' ], setResult => {
  runSequentialPromises(getPromiseList(true), { abortOnFail: true }).then(list => {
    setResult(list, false)
  }).catch(result => {
    setResult(
      result,
      is.deepEqual(result, {
        key: 1, status: 'rejected', reason: 'cannot settle promise 2',
        resultAggregator: [
          { key: 0, status: 'fulfilled', value: 'one' },
          { key: 1, status: 'rejected', reason: 'cannot settle promise 2' },
          null,
          null,
          null
        ]
      })
    )
  })
})

runTest([ 'list', 'reject 2nd', '-', '1 thread' ], setResult => {
  runSequentialPromises(getPromiseList(true), { abortOnFail: false }).then(list => {
    setResult(
      list,
      is.deepEqual(list, [
        { key: 0, status: 'fulfilled', value: 'one' },
        { key: 1, status: 'rejected', reason: 'cannot settle promise 2' },
        { key: 2, status: 'fulfilled', value: 'three' },
        { key: 3, status: 'fulfilled', value: 'four' },
        { key: 4, status: 'fulfilled', value: 'five' }
      ])
    )
  }).catch(result => {
    setResult(result, false)
  })
})

runTest([ 'list', 'reject 2nd', 'yes', '2 threads' ], setResult => {
  runSequentialPromises(getPromiseList(true), { abortOnFail: true, threadsNumber: 2 }).then(list => {
    setResult(list, false)
  }).catch(result => {
    setResult(
      result,
      is.deepEqual(result, {
        key: 1, status: 'rejected', reason: 'cannot settle promise 2',
        resultAggregator: [
          { key: 0, status: 'fulfilled', value: 'one' },
          { key: 1, status: 'rejected', reason: 'cannot settle promise 2' },
          null,
          null,
          null
        ]
      })
    )
  })
})

runTest([ 'list', 'reject 2nd', '-', '2 threads' ], setResult => {
  runSequentialPromises(getPromiseList(true), { abortOnFail: false, threadsNumber: 2 }).then(list => {
    setResult(
      list,
      is.deepEqual(list, [
        { key: 0, status: 'fulfilled', value: 'one' },
        { key: 1, status: 'rejected', reason: 'cannot settle promise 2' },
        { key: 2, status: 'fulfilled', value: 'three' },
        { key: 3, status: 'fulfilled', value: 'four' },
        { key: 4, status: 'fulfilled', value: 'five' }
      ])
    )
  }).catch(result => {
    setResult(result, false)
  })
})

function getPromiseMap (fail) {
  return {
    one: resultAggregator => new Promise((resolve, reject) => {
      if (Object.keys(resultAggregator).length !== 5) {
        reject('resultAggregator is NOT a 5 element mapping')
      }
      else {
        setTimeout(() => { resolve('one') }, Math.random() * 1000)
      }
    }),

    two: () => new Promise((resolve, reject) => {
      setTimeout(() => {
        if (fail) { reject('cannot settle promise 2') }
        else { resolve('two') }
      }, Math.random() * 1000)
    }),

    three: () => new Promise(resolve => {
      setTimeout(() => { resolve('three') }, Math.random() * 1000)
    }),

    four: resultAggregator => new Promise((resolve, reject) => {
      if (Array.isArray(resultAggregator) === true || Object(resultAggregator) !== resultAggregator) {
        reject('resultAggregator is NOT a mapped object')
      }
      else {
        setTimeout(() => { resolve('four') }, Math.random() * 1000)
      }
    }),

    five: resultAggregator => new Promise((resolve, reject) => {
      if (resultAggregator.one.status !== 'fulfilled') {
        reject('resultAggregator does NOT have result of first promise')
      }
      else if (resultAggregator.one.value !== 'one') {
        reject('resultAggregator does NOT have correct value for first promise')
      }
      else {
        setTimeout(() => { resolve('five') }, Math.random() * 1000)
      }
    })
  }
}

runTest([ 'map', 'resolve all', 'yes', '1 thread' ], setResult => {
  runSequentialPromises(getPromiseMap(), { abortOnFail: true }).then(resultAggregator => {
    setResult(
      resultAggregator,
      is.deepEqual(resultAggregator, {
        one: { key: 'one', status: 'fulfilled', value: 'one' },
        two: { key: 'two', status: 'fulfilled', value: 'two' },
        three: { key: 'three', status: 'fulfilled', value: 'three' },
        four: { key: 'four', status: 'fulfilled', value: 'four' },
        five: { key: 'five', status: 'fulfilled', value: 'five' }
      })
    )
  }).catch(result => {
    setResult(result, false)
  })
})

runTest([ 'map', 'resolve all', '-', '1 thread' ], setResult => {
  runSequentialPromises(getPromiseMap(), { abortOnFail: false }).then(resultAggregator => {
    setResult(
      resultAggregator,
      is.deepEqual(resultAggregator, {
        one: { key: 'one', status: 'fulfilled', value: 'one' },
        two: { key: 'two', status: 'fulfilled', value: 'two' },
        three: { key: 'three', status: 'fulfilled', value: 'three' },
        four: { key: 'four', status: 'fulfilled', value: 'four' },
        five: { key: 'five', status: 'fulfilled', value: 'five' }
      })
    )
  }).catch(result => {
    setResult(result, false)
  })
})

runTest([ 'map', 'resolve all', 'yes', '2 thread' ], setResult => {
  runSequentialPromises(getPromiseMap(), { abortOnFail: true, threadsNumber: 2 }).then(resultAggregator => {
    setResult(
      resultAggregator,
      is.deepEqual(resultAggregator, {
        one: { key: 'one', status: 'fulfilled', value: 'one' },
        two: { key: 'two', status: 'fulfilled', value: 'two' },
        three: { key: 'three', status: 'fulfilled', value: 'three' },
        four: { key: 'four', status: 'fulfilled', value: 'four' },
        five: { key: 'five', status: 'fulfilled', value: 'five' }
      })
    )
  }).catch(result => {
    setResult(result, false)
  })
})

runTest([ 'map', 'resolve all', '-', '2 thread' ], setResult => {
  runSequentialPromises(getPromiseMap(), { abortOnFail: false, threadsNumber: 2 }).then(resultAggregator => {
    setResult(
      resultAggregator,
      is.deepEqual(resultAggregator, {
        one: { key: 'one', status: 'fulfilled', value: 'one' },
        two: { key: 'two', status: 'fulfilled', value: 'two' },
        three: { key: 'three', status: 'fulfilled', value: 'three' },
        four: { key: 'four', status: 'fulfilled', value: 'four' },
        five: { key: 'five', status: 'fulfilled', value: 'five' }
      })
    )
  }).catch(result => {
    setResult(result, false)
  })
})

runTest([ 'map', 'reject 2nd', 'yes', '1 thread' ], setResult => {
  runSequentialPromises(getPromiseMap(true), { abortOnFail: true }).then(resultAggregator => {
    setResult(resultAggregator, false)
  }).catch(result => {
    setResult(
      result,
      is.deepEqual(result, {
        key: 'two', status: 'rejected', reason: 'cannot settle promise 2',
        resultAggregator: {
          one: { key: 'one', status: 'fulfilled', value: 'one' },
          two: { key: 'two', status: 'rejected', reason: 'cannot settle promise 2' },
          three: null,
          four: null,
          five: null
        }
      })
    )
  })
})

runTest([ 'map', 'reject 2nd', '-', '1 thread' ], setResult => {
  runSequentialPromises(getPromiseMap(true), { abortOnFail: false }).then(resultAggregator => {
    setResult(
      resultAggregator,
      is.deepEqual(resultAggregator, {
        one: { key: 'one', status: 'fulfilled', value: 'one' },
        two: { key: 'two', status: 'rejected', reason: 'cannot settle promise 2' },
        three: { key: 'three', status: 'fulfilled', value: 'three' },
        four: { key: 'four', status: 'fulfilled', value: 'four' },
        five: { key: 'five', status: 'fulfilled', value: 'five' }
      })
    )
  }).catch(result => {
    setResult(result, false)
  })
})

runTest([ 'map', 'reject 2nd', 'yes', '2 threads' ], setResult => {
  runSequentialPromises(getPromiseMap(true), { abortOnFail: true, threadsNumber: 2 }).then(resultAggregator => {
    setResult(resultAggregator, false)
  }).catch(result => {
    setResult(
      result,
      is.deepEqual(result, {
        key: 'two', status: 'rejected', reason: 'cannot settle promise 2',
        resultAggregator: {
          one: { key: 'one', status: 'fulfilled', value: 'one' },
          two: { key: 'two', status: 'rejected', reason: 'cannot settle promise 2' },
          three: null,
          four: null,
          five: null
        }
      })
    )
  })
})

runTest([ 'map', 'reject 2nd', '-', '2 threads' ], setResult => {
  runSequentialPromises(getPromiseMap(true), { abortOnFail: false, threadsNumber: 2 }).then(resultAggregator => {
    setResult(
      resultAggregator,
      is.deepEqual(resultAggregator, {
        one: { key: 'one', status: 'fulfilled', value: 'one' },
        two: { key: 'two', status: 'rejected', reason: 'cannot settle promise 2' },
        three: { key: 'three', status: 'fulfilled', value: 'three' },
        four: { key: 'four', status: 'fulfilled', value: 'four' },
        five: { key: 'five', status: 'fulfilled', value: 'five' }
      })
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
    font-size: 9px
</style>
