<template>
  <div class="filter-list">
    <slot name="title"><div class="filter-title">请选择筛选条件</div></slot>
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
import { useActiveKeyDown } from '../hooks/useActiveKeyDown'
import type { FilterItem } from '../types'
import { ref, toRef, watchEffect } from 'vue'

const props = defineProps<{
  isActive: boolean
  options: FilterItem[]
}>()

const emit = defineEmits<{
  change: [value: FilterItem]
}>()

defineSlots<{
  title(): any
}>()

const active = ref<FilterItem>()

useActiveKeyDown({
  active,
  isActive: toRef(() => props.isActive),
  options: toRef(() => props.options),
  enterFn: (item) => emit('change', item)
})

watchEffect(() => {
  active.value = props.options[0]
})
</script>
