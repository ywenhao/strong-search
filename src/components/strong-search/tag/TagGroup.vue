<template>
  <TagItem
    v-for="(item, index) in modelValue"
    :key="index"
    :model-value="item"
    @delete="handleDelete"
    @click="$emit('tag-click')"
  />
</template>

<script setup lang="ts">
import { nextTick } from 'vue'
import type { SearchValue } from '../types'
import TagItem from './TagItem.vue'

const props = defineProps<{
  modelValue: SearchValue[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: SearchValue[]]
  'tag-click': []
  delete: []
}>()

async function handleDelete(value: SearchValue) {
  const item = props.modelValue.filter((v) => v !== value)
  emit('update:modelValue', item)
  await nextTick()
  emit('delete')
}
</script>
