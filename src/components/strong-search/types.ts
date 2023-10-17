export type PopoverType = 'filterList' | 'date' | 'select' | 'check'
export type FilterPopover = Exclude<PopoverType, 'filterList'>

export type LabelValue = {
  label: string
  value: string | number
}

export type PopoverOption = {
  select?: LabelValue[]
  check?: LabelValue[]
  dateProps?: {
    startKey: string
    endKey: string
    starDisabledDate?: Function
    endDisabledDate?: Function
  }
}

export type FilterItem = {
  name: string
  type: string
  maxLength?: number
  popover?: FilterPopover
  popoverOption?: PopoverOption
}

export type SearchValue = {
  name: string
  type: string
  isDate?: boolean
  dateStartKey?: string
  dateEndKey?: string
  value: string[]
  options: LabelValue[]
}
