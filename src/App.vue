<script setup lang="ts">
import StrongSearch from './components/StrongSearch.vue'
import type { SearchValue } from './types'
import { filterList } from './utils'

function handleSearch(item: SearchValue[]) {
  console.log(item)
}
</script>

<template>
  <StrongSearch :filterList="filterList" @search="handleSearch" placeholder="默认按照站点搜索" />
</template>
