<template>
  <div class="tag-item" :class="{ input: inputVisible }">
    <span class="tag-prefix" v-if="modelValue.name">{{ `${modelValue.name}:` }}</span>
    <span class="tag-value">{{ modelValue.value.join(' | ') }}</span>
    <ElIcon class="close-btn" @click="emit('delete', modelValue)">
      <CircleCloseFilled />
    </ElIcon>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { SearchValue } from '@/types'
import { ElIcon } from 'element-plus'
import { CircleCloseFilled } from '@element-plus/icons-vue'

defineProps<{
  modelValue: SearchValue
}>()

const emit = defineEmits<{
  'update:modelValue': [value: SearchValue]
  delete: [value: SearchValue]
}>()

const inputVisible = ref(false)
</script>
