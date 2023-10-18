<script setup lang="ts">
import { ref } from 'vue'
import { formatValue, StrongSearch, type SearchValue } from './components/strong-search'
import { filterList } from './state'

const searchValue = ref<SearchValue[]>([])

function handleSearch(item: SearchValue[]) {
  console.log('SearchValue', item)
  console.log('formatValue', formatValue(item))
}
</script>

<template>
  <StrongSearch
    v-model="searchValue"
    :filterList="filterList"
    @search="handleSearch"
    placeholder="默认按照站点搜索"
  />
</template>
