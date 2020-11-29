import { ref, computed, watch, nextTick } from 'vue'
import { useDocStore } from 'assets/doc-store'

function updateActiveToc (position, tocList, activeToc) {
  let last

  for (const i in tocList.value) {
    const section = tocList.value[ i ]
    const item = document.getElementById(section.id)

    if (item === null) {
      continue
    }

    if (item.offsetTop >= position + 155) {
      if (last === void 0) {
        last = section.id
      }
      break
    }
    else {
      last = section.id
    }
  }

  if (last !== void 0) {
    activeToc.value = last
  }
}

export default function useToc (scope, $route) {
  const $store = useDocStore()
  const activeToc = ref(null)

  const tocList = computed(() => {
    return $store.toc.length > 0
      ? [
          { id: 'Introduction', title: 'Introduction' },
          ...$store.toc
        ]
      : $store.toc
  })

  function setActiveToc (pos) {
    updateActiveToc(pos, tocList, activeToc)
  }

  watch(() => $route.path, () => {
    nextTick(() => {
      setActiveToc(document.documentElement.scrollTop || document.body.scrollTop)
    })
  })

  Object.assign(scope, {
    tocList,
    activeToc,
    setActiveToc
  })
}
