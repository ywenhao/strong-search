<template>
  <div class="search-date">
    <div class="date-title">请至少选择一个日期</div>
    <div class="date-content">
      <div class="date-start">
        <div class="tip-title">开始日期</div>
        <ElDatePicker
          clearable
          value-format="X"
          v-model="start"
          type="date"
          :disabled-date="starDisabledDate"
          placeholder="请选择日期"
          size="small"
        />
      </div>
      <div class="date-end">
        <div class="tip-title">结束日期</div>
        <ElDatePicker
          clearable
          value-format="X"
          v-model="end"
          type="date"
          :disabled-date="endDisabledDate"
          placeholder="请选择日期"
          size="small"
        />
      </div>
    </div>
    <div class="search-popover-footer">
      <ElButton @click="handleCancel" size="small">取消</ElButton>
      <ElButton @click="handleOk" type="primary" size="small" :disabled="!start && !end"
        >确定</ElButton
      >
    </div>
  </div>
  <slot />
</template>

<script setup lang="ts">
import { ElDatePicker, ElButton } from 'element-plus'
import { ref } from 'vue'

defineProps<{
  starDisabledDate?: Function
  endDisabledDate?: Function
}>()

const emit = defineEmits<{
  ok: [value: number[]]
  cancel: []
}>()

const start = ref()
const end = ref()

function onClear() {
  start.value = undefined
  end.value = undefined
}

function handleCancel() {
  emit('cancel')
  onClear()
}

function handleOk() {
  emit('ok', [start.value, end.value])
  onClear()
}
</script>
