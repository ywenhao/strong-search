import type { SearchValue } from './types'

/**
 * 格式化搜索value
 * @param value
 * @returns
 */
export function formatValue(value: SearchValue[]) {
  return value.reduce(
    (prev, cur) => {
      if (cur.isDate) {
        const start_time = cur.value[0]
        const end_time = cur.value[1]
        prev = { ...prev, start_time, end_time }
      } else {
        prev = { ...prev, [cur.type]: cur.value.join(',') }
      }
      return prev
    },
    {} as Record<string, any>
  )
}
