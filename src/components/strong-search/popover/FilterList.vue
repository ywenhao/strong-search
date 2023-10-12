<template>
  <div class="filter-list">
    <div class="filter-title">请选择筛选条件</div>
    <div class="filter-content">
      <div
        v-for="item in options"
        :key="item.type"
        class="filter-item"
        :class="{ active: active?.type === item.type }"
        @click="emit('change', item)"
        @mouseover="active = item"
        :title="item.name"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useActive } from '../hooks/useActive'
import type { FilterItem } from '../types'
import { ref, toRef, watchEffect } from 'vue'

const props = defineProps<{
  options: FilterItem[]
}>()

const emit = defineEmits<{
  change: [value: FilterItem]
}>()

const active = ref<FilterItem>()

const { activeUp, activeDown, activeEnter } = useActive(
  active,
  toRef(() => props.options),
  (item) => emit('change', item)
)

watchEffect(() => {
  active.value = props.options[0]
})

defineExpose({ activeUp, activeDown, activeEnter })
</script>
