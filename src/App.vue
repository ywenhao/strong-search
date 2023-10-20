<script setup lang="ts">
import { ref } from 'vue'
import { formatValue, StrongSearch, type SearchValue } from './components/strong-search'
import { filterList } from './state'

// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { ElConfigProvider } from 'element-plus'

const searchValue = ref<SearchValue[]>([])

function handleSearch(item: SearchValue[]) {
  console.log('SearchValue', item)
  console.log('formatValue', formatValue(item))
}
</script>

<template>
  <!-- 项目里面配置了这个中文的就不用倒入这个了 -->
  <ElConfigProvider :locale="zhCn">
    <StrongSearch
      v-model="searchValue"
      :filterList="filterList"
      @search="handleSearch"
      placeholder="默认按照站点搜索"
    />
  </ElConfigProvider>
</template>
