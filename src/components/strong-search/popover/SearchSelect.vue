<template>
  <div class="search-select">
    <div
      class="search-option"
      v-for="item in options"
      :key="item.label"
      :class="{ active: active?.value === item.value }"
      @click="emit('change', item)"
      @mouseover="active = item"
      :title="item.label"
    >
      {{ item.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useActiveKeyDown } from '../hooks/useActiveKeyDown'
import type { LabelValue } from '../types'
import { ref, toRef, watchEffect } from 'vue'

const props = defineProps<{
  isActive: boolean
  options: LabelValue[]
}>()

const emit = defineEmits<{
  change: [value: LabelValue]
}>()

const active = ref<LabelValue>()

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
