<template>
  <div class="tag-group">
    <TagItem
      v-for="(item, index) in modelValue"
      :key="index"
      :model-value="item"
      @delete="handleDelete"
      @click="$emit('click')"
    />
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { SearchValue } from '@/types'
import TagItem from './TagItem.vue'

const props = defineProps<{
  modelValue: SearchValue[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: SearchValue[]]
  click: []
}>()

function handleDelete(value: SearchValue) {
  const item = props.modelValue.filter((v) => v !== value)
  emit('update:modelValue', item)
}
</script>
