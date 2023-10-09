import { onMounted, ref, onBeforeUnmount, type Ref } from 'vue'

type El = HTMLElement | undefined

/**
 * 判断是否在dom范围内点击
 * @param el
 * @param cb
 * @returns
 */
export function useDomIsContainsClick<T extends El>(el: Ref<T>, cb?: (val: boolean) => void) {
  const val = ref(false)

  let fn: ReturnType<typeof createDomIsContains>

  onMounted(() => {
    fn = createDomIsContains(el.value, val, cb)
    document.addEventListener('click', fn)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('click', fn)
  })

  return val
}

function createDomIsContains<T extends El>(el: T, val: Ref<boolean>, cb?: (val: boolean) => void) {
  return (e: MouseEvent) => {
    if (!el || !e.target) return
    val.value = el.contains(e.target as Node)
    cb?.(val.value)
  }
}
