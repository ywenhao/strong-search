<script setup lang="ts">
import { ref } from 'vue'
import StrongSearch from './components/strong-search/StrongSearch.vue'
import type { SearchValue } from './components/strong-search/types'
import { formatValue } from './components/strong-search/utils'
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
