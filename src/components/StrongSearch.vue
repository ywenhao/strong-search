<template>
  <div ref="searchRef" @click="active = true" class="strong-search" :class="{ active }">
    <TagGroup v-model="searchValue" />
    <ElPopover
      :teleported="false"
      :show-arrow="false"
      :visible="popoverVisible"
      placement="bottom-start"
    >
      <template #reference>
        <ElInput
          v-model="inputValue"
          class="search-input"
          :placeholder="placeholder"
          @click="handleInputClick"
          @keydown="handleInputKeyDown"
        >
          <template #prefix v-if="prefix">{{ prefix }}:</template>
          <template #suffix>
            <ElIcon v-if="closeBtnVisible" @click="handleClear"><CircleClose /></ElIcon>
            <ElIcon @click="handleSearch"><Search /></ElIcon>
          </template>
        </ElInput>
      </template>

      <FilterList ref="filterListRef" @click="handleFilterClick" :options="filterOptions" />
    </ElPopover>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Search, CircleClose } from '@element-plus/icons-vue'
import { ElIcon, ElInput, ElPopover } from 'element-plus'
import TagGroup from './TagGroup.vue'
import FilterList from './FilterList.vue'
import type { FilterItem, SearchValue } from '@/types'
import { useDomIsContainsClick } from '@/hooks/useDomIsContains'

const props = defineProps<{
  filterList: FilterItem[]
}>()

const emit = defineEmits<{
  search: [value: SearchValue[]]
}>()

const searchRef = ref<HTMLDivElement>()
const filterListRef = ref<InstanceType<typeof FilterList>>()

const active = ref(false)

const prefix = ref('')

const activeFilterItem = computed(() => props.filterList.find((v) => v.name === prefix.value))

// 默认列表第一个type
const type = computed(() => activeFilterItem.value?.type)
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

const placeholder = computed(() => (prefix.value ? '添加筛选条件' : '默认按照站点搜索'))
const closeBtnVisible = computed(
  () => !!prefix.value || !!searchValue.value.length || !!inputValue.value
)

const popoverShow = ref(false)

// 没有选择filterItem时 列表不为空 显示
const filterListVisible = computed(() => !prefix.value && !!filterOptions.value.length)
const popoverVisible = computed(() => {
  if (!popoverShow.value) return false
  if (activeFilterItem.value?.popover) return true
  if (filterListVisible.value) return true

  return false
})

// 空值显示列表
watch(inputValue, (val) => {
  if (!val.trim() && !prefix.value && filterOptions.value.length) {
    popoverShow.value = true
  }
})

// 是否区域内点击
useDomIsContainsClick(searchRef, (val) => {
  active.value = val
  if (!val) popoverShow.value = val
})

function handleClear() {
  inputValue.value = ''
  prefix.value = ''
  searchValue.value = []
  popoverShow.value = false

  handleSearch()
}

function handleInputKeyDown(e: KeyboardEvent | Event) {
  const event = e as KeyboardEvent
  if (prefix.value && event.key === 'Backspace') {
    prefix.value = ''
  }

  // filter列表上下
  if (popoverVisible.value && filterListVisible.value) {
    event.key === 'ArrowUp' && filterListRef.value?.activeUp()
    event.key === 'ArrowDown' && filterListRef.value?.activeDown()
    event.key === 'Enter' && filterListRef.value?.activeEnter()
  }

  // 确认
  const val = inputValue.value.trim()
  if (
    !popoverVisible.value &&
    props.filterList.length &&
    val &&
    event.key === 'Enter' &&
    !activeFilterItem.value?.popover
  ) {
    const firstItem = props.filterList.at(0)!
    searchValue.value.push({
      name: prefix.value || firstItem.name,
      type: type.value || firstItem.type,
      value: [val]
    })

    prefix.value = ''
    inputValue.value = ''

    handleSearch()
  }
}

function handleInputClick() {
  popoverShow.value = true
}

function handleFilterClick(item: FilterItem) {
  prefix.value = item.name
  popoverShow.value = false
  active.value = true
}

function handleSearch() {
  emit('search', searchValue.value)
}
</script>

<style lang="scss">
@import '../style.scss';
</style>
