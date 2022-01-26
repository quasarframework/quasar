import { inject, provide, reactive } from 'vue'
import { docStoreKey } from './symbols.js'

export function useDocStore () {
  return inject(docStoreKey)
}

export function provideDocStore () {
  const store = {
    toc: []
  }

  provide(
    docStoreKey,
    process.env.SERVER === true ? store : reactive(store)
  )
}
