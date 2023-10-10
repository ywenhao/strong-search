<template>
  <div ref="searchRef" @click="active = true" class="strong-search" :class="{ active }">
    <ElScrollbar ref="scrollbarRef" class="search-scrollbar">
      <TagGroup v-model="searchValue" @tag-click="popoverShow = false" />
      <ElPopover
        :teleported="false"
        :show-arrow="false"
        :visible="popoverVisible"
        placement="bottom-start"
      >
        <template #reference>
          <ElInput
            ref="inputRef"
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

        <FilterList
          ref="filterListRef"
          v-if="popoverType === 'filterList'"
          @click="handleFilterClick"
          :options="filterOptions"
        />
        <SearchSelect />
      </ElPopover>
    </ElScrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
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
import type { FilterItem, PopoverType, SearchValue } from '@/types'
import { useDomIsContainsClick } from '@/hooks/useDomIsContains'
import SearchSelect from './popover/SearchSelect.vue'

const props = defineProps<{
  filterList: FilterItem[]
}>()

const emit = defineEmits<{
  search: [value: SearchValue[]]
}>()

const searchRef = ref<HTMLDivElement>()
const inputRef = ref<InputInstance>()
const scrollbarRef = ref<ScrollbarInstance>()
const filterListRef = ref<InstanceType<typeof FilterList>>()

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

  // 删除
  if (event.key === 'Backspace' && !inputValue.value) {
    if (prefix.value) prefix.value = ''
    else if (searchValue.value.length) {
      searchValue.value.splice(searchValue.value.length - 1, 1)
    }
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
    val &&
    !popoverVisible.value &&
    props.filterList.length &&
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

    nextTick(() => setScrollBottom())
  }
}

function setScrollBottom() {
  const warpRef = scrollbarRef.value?.wrapRef!
  const val = warpRef.scrollHeight - warpRef.clientHeight
  val && scrollbarRef.value?.setScrollTop(val)
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
