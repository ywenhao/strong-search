<template>
  <div class="tag-item">
    <div class="tag-content" :title="`${modelValue.name}：${value}`">
      <span class="tag-prefix" v-if="modelValue.name">{{ `${modelValue.name}:` }}</span>
      <span class="tag-value">{{ value }}</span>
    </div>
    <i class="close-btn" @click="emit('delete', modelValue)">
      <TagClose />
    </i>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SearchValue } from '../types'
import { dayjs } from 'element-plus'
import TagClose from '../icons/TagClose.vue'

const props = defineProps<{
  modelValue: SearchValue
}>()

const emit = defineEmits<{
  'update:modelValue': [value: SearchValue]
  delete: [value: SearchValue]
}>()

const value = computed(() => {
  const isDate = props.modelValue.isDate
  if (isDate) {
    const val = props.modelValue.value.map((v) => (v ? dayjs.unix(+v).format('YYYY/MM/DD') : v))
    if (val.filter(Boolean).length > 1) return val.join('-')
    if (val[0]) return `≥${val[0]}`
    if (val[1]) return `≤${val[1]}`
  }
  return props.modelValue.value.join(',')
})
</script>
