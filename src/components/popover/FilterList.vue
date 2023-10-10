<template>
  <div class="filter-list">
    <div class="filter-title">请选择筛选条件</div>
    <div class="filter-content">
      <div
        v-for="item in options"
        :key="item.type"
        class="filter-item"
        :class="{ active: active === item.type }"
        @click.stop="emit('click', item)"
        @mouseover="active = item.type"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FilterItem } from '@/types'
import { computed, ref, watchEffect } from 'vue'

const props = defineProps<{
  options: FilterItem[]
}>()

const emit = defineEmits<{
  click: [value: FilterItem]
}>()

const active = ref('')

const activeItem = computed(() => {
  if (!props.options.length || !active.value) return
  return props.options.find((v) => v.type === active.value)
})

const activeIndex = computed(() =>
  activeItem.value ? props.options.findIndex((v) => v === activeItem.value) : -1
)

watchEffect(() => {
  active.value = props.options.at(0)?.type || ''
})

defineExpose({
  activeUp: () => {
    if (activeIndex.value < 0 || props.options.length === 1) return
    const idx = activeIndex.value ? activeIndex.value - 1 : props.options.length - 1
    active.value = props.options[idx].type
  },
  activeDown: () => {
    if (activeIndex.value < 0 || props.options.length === 1) return
    const idx = activeIndex.value !== props.options.length - 1 ? activeIndex.value + 1 : 0
    active.value = props.options[idx].type
  },
  activeEnter: () => {
    activeItem.value && emit('click', activeItem.value)
  }
})
</script>
