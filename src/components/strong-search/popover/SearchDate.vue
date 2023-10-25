<template>
  <div class="search-date">
    <slot name="title"><div class="date-title">请至少选择一个日期</div></slot>
    <div class="date-content">
      <div class="date-start">
        <div class="tip-title">开始日期</div>
        <ElDatePicker
          clearable
          value-format="X"
          v-model="start"
          type="date"
          :disabled-date="startDisabledDateFn"
          placeholder="请选择日期"
        />
      </div>
      <div class="date-end">
        <div class="tip-title">结束日期</div>
        <ElDatePicker
          clearable
          type="date"
          value-format="X"
          :model-value="end"
          @update:model-value="onUpdateEnd"
          :disabled-date="endDisabledDateFn"
          placeholder="请选择日期"
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
</template>

<script setup lang="ts">
import { ElDatePicker, ElButton, dayjs } from 'element-plus'
import { ref } from 'vue'

const props = defineProps<{
  startDisabledDate?: Function
  endDisabledDate?: Function
}>()

const emit = defineEmits<{
  ok: [value: number[]]
  cancel: []
}>()

defineSlots<{
  title(): any
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

function startDisabledDateFn(value: Date) {
  if (end.value) {
    const endDate = dayjs.unix(end.value)
    const startDate = dayjs(value)
    return !startDate.isBefore(endDate.add(1, 'day')) || props.startDisabledDate?.(value)
  }
  return props.startDisabledDate?.(value)
}

function endDisabledDateFn(value: Date) {
  if (start.value) {
    const startDate = dayjs.unix(start.value)
    const endDate = dayjs(value)
    return !endDate.isAfter(startDate.subtract(1, 'day')) || props.endDisabledDate?.(value)
  }
  return props.endDisabledDate?.(value)
}

function onUpdateEnd(val: string) {
  end.value = !val ? val : String(+val + 86399)
}

function handleOk() {
  emit('ok', [start.value, end.value])
  onClear()
}
</script>
