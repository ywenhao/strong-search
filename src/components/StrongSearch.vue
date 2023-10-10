<template>
  <div ref="searchRef" class="strong-search" :class="{ active }">
    <ElScrollbar ref="scrollbarRef" class="search-scrollbar">
      <TagGroup v-model="searchValue" @tag-click="popoverShow = false" />
      <ElPopover
        :teleported="false"
        :show-arrow="false"
        :visible="popoverVisible"
        placement="bottom-start"
        popper-class="search-popover"
      >
        <template #reference>
          <ElInput
            ref="inputRef"
            v-model="inputValue"
            class="search-input"
            :placeholder="placeholder"
            @focus="handleInputFocus"
            @blur="handleInputBlur"
            @keydown="handleInputKeyDown"
          >
            <template #prefix v-if="prefix">{{ prefix }}:</template>
            <template #suffix>
              <ElIcon v-if="closeBtnVisible" @click="handleClear"><CircleClose /></ElIcon>
              <ElIcon @click="handleSearch"><Search /></ElIcon>
            </template>
          </ElInput>
        </template>

        <FilterList
          ref="filterListRef"
          v-if="popoverType === 'filterList'"
          @click="handleFilterClick"
          :options="filterOptions"
        />
        <SearchSelect
          ref="selectRef"
          @click="handleSelectClick"
          :options="selectOptions"
          v-else-if="popoverType === 'select'"
        />
        <SearchCheck
          ref="checkRef"
          @ok="handleCheckOk"
          @cancel="handleCheckCancel"
          :options="checkOptions"
          v-else-if="popoverType === 'check'"
        />
        <SearchDate
          @ok="handleDateOk"
          @cancel="handleDateCancel"
          v-else-if="popoverType === 'date'"
          :star-disabled-date="dateProps.starDisabledDate"
          :end-disabled-date="dateProps.endDisabledDate"
        />
      </ElPopover>
    </ElScrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch, watchEffect } from 'vue'
import { Search, CircleClose } from '@element-plus/icons-vue'
import {
  ElScrollbar,
  ElIcon,
  ElInput,
  ElPopover,
  type InputInstance,
  type ScrollbarInstance
} from 'element-plus'
import TagGroup from './tag/TagGroup.vue'
import FilterList from './popover/FilterList.vue'
import type { FilterItem, LabelValue, PopoverType, SearchValue } from '@/types'
import SearchSelect from './popover/SearchSelect.vue'
import SearchCheck from './popover/SearchCheck.vue'
import SearchDate from './popover/SearchDate.vue'

const props = withDefaults(
  defineProps<{
    filterList: FilterItem[]
    filterPlaceholder?: string
    placeholder?: string
  }>(),
  {
    filterPlaceholder: '添加筛选条件',
    placeholder: '请输入搜索内容'
  }
)

const emit = defineEmits<{
  search: [value: SearchValue[]]
}>()

const searchRef = ref<HTMLDivElement>()
const inputRef = ref<InputInstance>()
const scrollbarRef = ref<ScrollbarInstance>()
const filterListRef = ref<InstanceType<typeof FilterList>>()
const selectRef = ref<InstanceType<typeof SearchSelect>>()
const checkRef = ref<InstanceType<typeof SearchCheck>>()

const active = ref(false)

const prefix = ref('')

const activeFilterItem = computed(() => props.filterList.find((v) => v.name === prefix.value))

// 默认列表第一个type
const type = computed(() => activeFilterItem.value?.type)
const popoverType = computed<PopoverType | null>(() =>
  !prefix.value ? 'filterList' : activeFilterItem.value?.popover || null
)
const inputValue = ref('')
const searchValue = ref<SearchValue[]>([])

// 搜索、过滤
const filterOptions = computed(() =>
  props.filterList.filter((v) => {
    const val = inputValue.value.trim()
    return !searchValue.value.some((item) => item.type === v.type) && !val
      ? true
      : v.name.includes(val)
  })
)

const selectOptions = computed(() => {
  const val = inputValue.value.trim()
  const list = activeFilterItem.value?.popoverOption?.select || []
  return list.filter((v) => (val ? v.label.includes(val) : true))
})

const checkOptions = computed(() => {
  const val = inputValue.value.trim()
  const list = activeFilterItem.value?.popoverOption?.check || []
  return list.filter((v) => (val ? v.label.includes(val) : true))
})

const dateProps = computed(() => activeFilterItem.value?.popoverOption?.dateProps || {})

const placeholder = computed(() => (prefix.value ? props.filterPlaceholder : props.placeholder))
const closeBtnVisible = computed(
  () => !!prefix.value || !!searchValue.value.length || !!inputValue.value
)

const popoverShow = ref(false)

// 没有选择filterItem时 列表不为空 显示
const filterListVisible = computed(() => !prefix.value && !!filterOptions.value.length)

const popoverVisible = computed(() => {
  if (!popoverShow.value || !popoverType.value) return false
  if (popoverType.value === 'filterList' && !filterOptions.value.length) return false
  if (popoverType.value === 'select' && !selectOptions.value.length) return false
  if (popoverType.value === 'check' && !checkOptions.value.length) return false
  return true
})

// 空值显示列表
watch(inputValue, (val) => {
  if (!val.trim() && !prefix.value && filterOptions.value.length) {
    popoverShow.value = true
  }
})

function handleClear() {
  inputValue.value = ''
  prefix.value = ''
  searchValue.value = []
  popoverShow.value = false

  handleSearch()
}

function popoverNextTick() {
  popoverShow.value = false
  nextTick(() => (popoverShow.value = true))
  inputRef.value?.focus()
}

function handleInputKeyDown(e: KeyboardEvent | Event) {
  const event = e as KeyboardEvent

  // 删除
  if (event.key === 'Backspace' && !inputValue.value) {
    if (prefix.value) prefix.value = ''
    else if (searchValue.value.length) {
      searchValue.value.splice(searchValue.value.length - 1, 1)
      // fix popover 位置
      popoverVisible.value && popoverNextTick()
    }
  }

  // filter列表上下
  if (popoverVisible.value) {
    const condition = [
      [filterListRef.value, filterListVisible.value],
      [selectRef.value, popoverType.value === 'select'],
      [checkRef.value, popoverType.value === 'check']
    ]
    const childRef = condition.find((v) => v[1])?.[0] as any

    event.key === 'ArrowUp' && childRef?.activeUp()
    event.key === 'ArrowDown' && childRef?.activeDown()
    event.key === 'Enter' && childRef?.activeEnter()
  }

  // 确认
  const val = inputValue.value.trim()
  if (
    val &&
    !popoverVisible.value &&
    props.filterList.length &&
    event.key === 'Enter' &&
    !activeFilterItem.value?.popover
  ) {
    setSearchValue(val)

    prefix.value = ''
    inputValue.value = ''

    handleSearch()

    nextTick(() => setScrollBottom())
  }
}

function handleInputFocus() {
  active.value = true
  popoverShow.value = true
}

const noClosePopover = ref(false)

watchEffect(() => {
  if (popoverType.value === 'date' && popoverVisible.value === true) {
    noClosePopover.value = true
  }
})

function handleInputBlur() {
  if (noClosePopover.value) return
  active.value = false
  popoverShow.value = false
}

function setSearchValue(value: string | string[], isDate?: boolean) {
  const firstItem = props.filterList.at(0)!
  searchValue.value.push({
    isDate,
    name: prefix.value || firstItem.name,
    type: type.value || firstItem.type,
    value: Array.isArray(value) ? value : [value]
  })
}

function setScrollBottom() {
  const warpRef = scrollbarRef.value?.wrapRef!
  const val = warpRef.scrollHeight - warpRef.clientHeight
  val && scrollbarRef.value?.setScrollTop(val)
}

function handleFilterClick(item: FilterItem) {
  inputValue.value = ''
  prefix.value = item.name
  if (!popoverType.value) popoverShow.value = false
  else popoverNextTick()
}

function handleSelectClick(item: LabelValue) {
  setSearchValue(item.value)
  prefix.value = ''
  inputValue.value = ''
  popoverNextTick()
}

function handleCheckOk(items: LabelValue[]) {
  setSearchValue(items.map((v) => v.value))
  prefix.value = ''
  inputValue.value = ''
  popoverNextTick()
}

function handleCheckCancel() {
  prefix.value = ''
  inputValue.value = ''
  popoverNextTick()
}

function handleDateOk(value: number[]) {
  noClosePopover.value = false
  const val = value.map((v) => (v ? String(v) : ''))
  setSearchValue(val, true)
  prefix.value = ''
  inputValue.value = ''
  popoverNextTick()
}

function handleDateCancel() {
  noClosePopover.value = false
  prefix.value = ''
  inputValue.value = ''
  popoverNextTick()
}

function handleSearch() {
  emit('search', searchValue.value)
}
</script>

<style lang="scss">
@import '../style.scss';
</style>
