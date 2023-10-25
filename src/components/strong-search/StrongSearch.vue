<template>
  <div ref="searchRef" class="strong-search" :class="{ active }">
    <i class="filter-icon">
      <img :src="FilterSvg" alt="" />
    </i>
    <ElScrollbar ref="scrollbarRef" class="search-scrollbar">
      <TagGroup @delete="handleSearch" v-model="searchValue" @tag-click="popoverShow = false" />
      <ElPopover
        :width="180"
        :teleported="false"
        :visible="popoverVisible"
        placement="bottom-start"
        popper-class="search-popover"
      >
        <template #reference>
          <ElInput
            ref="inputRef"
            v-model="inputValue"
            class="search-input"
            :maxlength="maxLength"
            :placeholder="placeholder"
            @focus="handleInputFocus"
            @blur="handleInputBlur"
            @keydown="handleInputKeyDown"
          >
            <template #prefix v-if="prefix">{{ prefix }}:</template>
            <template #suffix>
              <SearchCloseIcon class="e-icon" v-if="closeBtnVisible" @click="handleClear" />
              <SearchIcon class="e-icon" @click="handleClickSearch" />
            </template>
          </ElInput>
        </template>

        <FilterList
          v-if="filterOptions.length && popoverType === 'filterList'"
          @change="handleFilterChange"
          :options="filterOptions"
        >
          <template #title>
            <slot name="filterListTitle" />
          </template>
        </FilterList>
        <SearchSelect
          @change="handleSelectChange"
          :options="selectOptions"
          v-else-if="popoverType === 'select'"
        />
        <SearchCheck
          @ok="handleCheckOk"
          @cancel="handleCheckCancel"
          :options="checkOptions"
          v-else-if="popoverType === 'check'"
        />
        <SearchDate
          @ok="handleDateOk"
          @cancel="handleDateCancel"
          v-else-if="popoverType === 'date'"
          :start-disabled-date="dateProps.startDisabledDate"
          :end-disabled-date="dateProps.endDisabledDate"
        >
          <template #title>
            <slot name="filterListTitle" />
          </template>
        </SearchDate>
      </ElPopover>
    </ElScrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch, watchEffect, type ComputedRef } from 'vue'
import {
  ElScrollbar,
  ElInput,
  ElPopover,
  type InputInstance,
  type ScrollbarInstance
} from 'element-plus'
import TagGroup from './tag/TagGroup.vue'
import FilterList from './popover/FilterList.vue'
import type { FilterItem, LabelValue, PopoverOption, PopoverType, SearchValue } from './types'
import SearchSelect from './popover/SearchSelect.vue'
import SearchCheck from './popover/SearchCheck.vue'
import SearchDate from './popover/SearchDate.vue'
import FilterSvg from './icons/filter.svg'
import SearchIcon from './icons/SearchIcon.vue'
import SearchCloseIcon from './icons/SearchCloseIcon.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: SearchValue[]
    filterList: FilterItem[]
    placeholder?: string
    isFilter?: boolean
  }>(),
  {
    isFilter: true,
    modelValue: () => []
  }
)

const emit = defineEmits<{
  search: [value: SearchValue[]]
  'update:modelValue': [value: SearchValue[]]
}>()

defineSlots<{
  filterListTitle(): any
  dateTitle(): any
}>()

const searchRef = ref<HTMLDivElement>()
const inputRef = ref<InputInstance>()
const scrollbarRef = ref<ScrollbarInstance>()

const active = ref(false)

const prefix = ref('')

const activeFilterItem = computed(() => props.filterList.find((v) => v.name === prefix.value))
const maxLength = computed(
  () => activeFilterItem.value?.maxLength ?? props.filterList[0]?.maxLength
)

// 默认列表第一个type
const type = computed(() => activeFilterItem.value?.type)
const popoverType = computed<PopoverType | null>(() =>
  !prefix.value ? 'filterList' : activeFilterItem.value?.popover || null
)
const inputValue = ref('')
const searchValue = ref<SearchValue[]>([...props.modelValue])

watch(
  () => props.modelValue,
  () => {
    searchValue.value = [...props.modelValue]
  },
  { deep: true }
)

// 搜索、过滤
const filterOptions = computed(() =>
  props.filterList.filter((v) => {
    const val = inputValue.value.trim()
    if (props.isFilter)
      return (
        !searchValue.value.some((item) => item.type === v.type) && (!val || v.name.includes(val))
      )
    return !val || v.name.includes(val)
  })
)

const selectOptions = computed(() => {
  const val = inputValue.value.trim()
  const list = activeFilterItem.value?.popoverOption?.select || []
  return list.filter((v) => !val || v.label.includes(val))
})

const checkOptions = computed(() => {
  const val = inputValue.value.trim()
  const list = activeFilterItem.value?.popoverOption?.check || []
  return list.filter((v) => !val || v.label.includes(val))
})

const dateProps = computed(
  () => activeFilterItem.value?.popoverOption?.dateProps || {}
) as ComputedRef<PopoverOption['dateProps'] & {}>

const filterPlaceholder = computed(() =>
  !activeFilterItem.value?.popover ? `请输入${prefix.value}` : `请选择${prefix.value}`
)

const placeholder = computed(() => (prefix.value ? filterPlaceholder.value : props.placeholder))
const closeBtnVisible = computed(
  () => !!prefix.value || !!searchValue.value.length || !!inputValue.value
)

const popoverShow = ref(false)

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
    if (prefix.value) {
      prefix.value = ''
    } else if (searchValue.value.length) {
      searchValue.value.splice(searchValue.value.length - 1, 1)
      // fix popover 位置
      popoverVisible.value && popoverNextTick()

      handleSearch()
    }
  }

  // 直接输入确认
  const val = inputValue.value.trim()
  if (
    val &&
    !popoverVisible.value &&
    props.filterList.length &&
    event.key === 'Enter' &&
    !activeFilterItem.value?.popover
  ) {
    autoDelFilterItem()
    setSearchValue([{ label: val, value: val }])

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
  // 点击弹窗，不主动关闭
  const noCloseTypes: PopoverType[] = ['date', 'check']
  if (popoverType.value && noCloseTypes.includes(popoverType.value) && popoverVisible.value) {
    noClosePopover.value = true
  }
})

function handleInputBlur() {
  if (noClosePopover.value) return
  active.value = false
  popoverShow.value = false
}

function autoDelFilterItem() {
  const firstType = inputValue.value.trim() && !prefix.value ? props.filterList[0]?.type : null
  const type = activeFilterItem.value?.type || firstType
  if (!props.filterList.length || !type) return

  const idx = searchValue.value.findIndex((v) => v.type === type)
  idx > -1 && searchValue.value.splice(idx, 1)
}

function setSearchValue(options: LabelValue[], isDate?: boolean) {
  const firstItem = props.filterList.at(0)!
  const dateStartKey = dateProps.value.startKey
  const dateEndKey = dateProps.value.endKey
  searchValue.value.push({
    isDate,
    options,
    dateStartKey,
    dateEndKey,
    value: options.map((v) => String(v.value)),
    name: prefix.value || firstItem.name,
    type: type.value || firstItem.type
  })
}

function setScrollBottom() {
  const warpRef = scrollbarRef.value?.wrapRef!
  const val = warpRef.scrollHeight - warpRef.clientHeight
  val && scrollbarRef.value?.setScrollTop(val)
}

function handleFilterChange(item: FilterItem) {
  inputValue.value = ''
  prefix.value = item.name
  if (!popoverType.value) {
    popoverShow.value = false
    inputRef.value?.focus()
  } else popoverNextTick()
}

function handleSelectChange(item: LabelValue) {
  autoDelFilterItem()
  setSearchValue([item])
  prefix.value = ''
  inputValue.value = ''
  handleSearch()
  popoverNextTick()
}

function handleCheckOk(items: LabelValue[]) {
  noClosePopover.value = false
  autoDelFilterItem()
  setSearchValue(items)
  prefix.value = ''
  inputValue.value = ''
  handleSearch()
  popoverNextTick()
}

function handleCheckCancel() {
  noClosePopover.value = false
  prefix.value = ''
  inputValue.value = ''
  popoverNextTick()
}

function handleDateOk(value: number[]) {
  noClosePopover.value = false
  autoDelFilterItem()
  const val = value.map((v) => (v ? String(v) : ''))
  setSearchValue(
    val.map((v) => ({ label: v, value: v })),
    true
  )
  prefix.value = ''
  inputValue.value = ''
  handleSearch()
  popoverNextTick()
}

function handleDateCancel() {
  noClosePopover.value = false
  prefix.value = ''
  inputValue.value = ''
  popoverNextTick()
}

async function handleSearch() {
  await nextTick()
  emit('update:modelValue', [...searchValue.value])
  emit('search', [...searchValue.value])
}

function handleClickSearch() {
  const val = inputValue.value.trim()
  if (val) {
    // 直接输入点击搜索
    if (!popoverVisible.value && props.filterList.length && !activeFilterItem.value?.popover) {
      autoDelFilterItem()
      setSearchValue([{ label: val, value: val }])
    }
    if (prefix.value) prefix.value = ''
    inputValue.value = ''
  }
  handleSearch()
}

onMounted(() => {
  if (!props.filterList.length) {
    console.error('props配置 `filterList` 长度不能为 0')
  }
})
</script>

<style lang="scss">
@import './style.scss';
</style>
