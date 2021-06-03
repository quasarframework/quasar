import { ref, computed } from 'vue'
import { useDocStore } from 'assets/doc-store'

function updateActiveToc (position, tocList, activeToc) {
  if (position === void 0) {
    position = document.documentElement.scrollTop || document.body.scrollTop
  }

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
    const tocEl = document.getElementById('toc--' + last)
    if (tocEl) {
      tocEl.scrollIntoView({ block: 'nearest' })
    }
  }
}

export default function useToc (scope, $route) {
  const $store = useDocStore()
  const activeToc = ref($route.hash.length > 1
    ? $route.hash.substring(1)
    : null
  )

  const tocList = computed(() => {
    return $store.toc.length > 0
      ? [
          { id: 'introduction', title: 'Introduction' },
          ...$store.toc
        ]
      : $store.toc
  })

  function setActiveToc (pos) {
    updateActiveToc(pos, tocList, activeToc)
  }

  Object.assign(scope, {
    tocList,
    activeToc,
    setActiveToc
  })
}
