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
import { useActive } from '../hooks/useActive'
import type { LabelValue } from '../types'
import { ref, toRef, watchEffect } from 'vue'

const props = defineProps<{
  options: LabelValue[]
}>()

const emit = defineEmits<{
  change: [value: LabelValue]
}>()

const active = ref<LabelValue>()

watchEffect(() => {
  active.value = props.options[0]
})

const { activeUp, activeDown, activeEnter } = useActive(
  active,
  toRef(() => props.options),
  (item) => emit('change', item)
)

defineExpose({ activeUp, activeDown, activeEnter })
</script>
