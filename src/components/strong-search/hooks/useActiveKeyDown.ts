import { computed, toRaw, type Ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * 简化active 按键操作
 * @param options 数据源
 * @param active 激活状态
 * @param emit
 * @param activeKey
 * @returns
 */
export function useActiveKeyDown<
  P extends object | string,
  T extends P[K] | P | undefined,
  K extends keyof P,
  EnterFn extends (value: P) => void
>(active: Ref<T>, options: Ref<P[]>, enterFn?: EnterFn, activeKey?: K) {
  const getActive = (item: P) => (activeKey ? item[activeKey] : toRaw(item)) as T

  const activeItem = computed(() => {
    if (!options.value.length || !active.value) return
    return options.value.find((v) => getActive(v) === toRaw(active.value))
  })

  const activeIndex = computed(() =>
    activeItem.value ? options.value.findIndex((v) => v === toRaw(activeItem.value)) : -1
  )

  const activeUp = () => {
    if (options.value.length === 1) return
    if (activeIndex.value < 0) {
      active.value = getActive(options.value[0])
      return
    }

    const idx = activeIndex.value ? activeIndex.value - 1 : options.value.length - 1
    active.value = getActive(options.value[idx])
  }

  const activeDown = () => {
    if (options.value.length === 1) return
    if (activeIndex.value < 0) {
      active.value = getActive(options.value[0])
      return
    }

    const idx = activeIndex.value !== options.value.length - 1 ? activeIndex.value + 1 : 0
    active.value = getActive(options.value[idx])
  }

  const activeEnter = () => {
    activeItem.value && enterFn && enterFn(activeItem.value)
  }

  function onKeyDown(e: KeyboardEvent) {
    e.key === 'ArrowUp' && activeUp()
    e.key === 'ArrowDown' && activeDown()
    e.key === 'Enter' && activeEnter()
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeyDown, true)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeyDown, true)
  })

  return { activeUp, activeDown, activeEnter, activeItem }
}
