import { isEqual } from 'lodash-es'
import { watch, type Ref } from 'vue'
import type { FilterItem, LabelValue, PopoverOption, SearchValue } from '../types'

/**
 * 设置searchValue
 */
export function useSetValueByState<T extends FilterItem[], S extends object>({
  filterList,
  filterKeys,
  state,
  searchValue
}: {
  filterList: T
  filterKeys: string[]
  state: S
  searchValue: Ref<SearchValue[]>
}) {
  const getSateSource = () => filterKeys.map((key) => () => state[key as keyof typeof state])

  watch(getSateSource(), (states, oldStates) => {
    const diffIdx = states
      .map((v, i) => v !== oldStates[i] && i)
      .filter((v) => typeof v === 'number') as number[]

    const arr = diffIdx.map((i) => ({ key: filterKeys[i], value: states[i] }))
    if (!arr.length) return

    // 目前这里业务上只有单选的
    arr.forEach(({ key, value }) => {
      const item = filterList.find((v) => v.type === key)!
      const opts =
        item.popoverOption && item.popover
          ? item.popoverOption[item.popover as keyof PopoverOption]!
          : []

      const options = (opts as LabelValue[]).filter((v) => String(v.value) === String(value))

      const val = {
        name: item.name,
        type: key,
        options,
        value: [value]
      } as unknown as SearchValue

      const searchItem = searchValue.value.find((v) => v.type === key)
      if ((!searchItem && !value) || (searchItem && isEqual(searchItem.value, val.value))) return
      const delIdx = searchValue.value.findIndex((v) => v.type === key)
      delIdx > -1
        ? value
          ? searchValue.value.splice(delIdx, 1, val)
          : searchValue.value.splice(delIdx, 1)
        : searchValue.value.push(val)
    })
  })
}
