export type PopoverType = 'filterList' | 'date' | 'select' | 'check'
export type FilterPopover = Exclude<PopoverType, 'filterList'>

export type LabelValue = {
  label: string
  value: string
}

export type PopoverOption = {
  select?: LabelValue[]
  check?: LabelValue[]
  dateProps?: {
    starDisabledDate?: Function
    endDisabledDate?: Function
  }
}

export type FilterItem = {
  name: string
  type: string
  popover?: FilterPopover
  popoverOption?: PopoverOption
}

export type SearchValue = {
  name: string
  type: string
  isDate?: boolean
  value: string[]
}
