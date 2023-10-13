<template>
  <div class="search-check">
    <div
      class="check-option"
      v-for="item in options"
      :key="item.label"
      :class="{ active: active === item.value }"
      @click.stop="handleClick(item.value)"
      @mouseover="active = item.value"
      :title="item.label"
    >
      <span class="check-label">{{ item.label }}</span>
      <img v-if="check.includes(item.value)" class="check-icon" :src="CheckSvg" alt="" />
    </div>
    <div class="search-popover-footer">
      <ElButton @click="handleCancel" size="small">取消</ElButton>
      <ElButton @click="handleOk" type="primary" size="small" :disabled="!check.length"
        >确定</ElButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { useActive } from '../hooks/useActive'
import type { LabelValue } from '../types'
import { ElButton } from 'element-plus'
import CheckSvg from '../icons/check.svg'
import { computed, ref, watchEffect } from 'vue'

const props = defineProps<{
  options: LabelValue[]
}>()

const emit = defineEmits<{
  ok: [value: LabelValue[]]
  cancel: []
}>()

type Value = LabelValue['value']

const actives = computed(() => props.options.map((v) => v.value))

const active = ref<Value>(actives.value[0])

const check = ref<Value[]>([])

const checks = computed(() => props.options.filter((v) => check.value.includes(v.value)))

watchEffect(() => {
  onClear()
})

function handleClick(val: Value) {
  const idx = check.value.findIndex((v) => v === val)
  idx > -1 ? check.value.splice(idx, 1) : check.value.push(val)
}

function handleOk() {
  emit('ok', checks.value)
  onClear()
}

function handleCancel() {
  emit('cancel')
  onClear()
}

function onClear() {
  active.value = actives.value[0]
  check.value = []
}

const { activeUp, activeDown } = useActive(active, actives)

defineExpose({
  activeUp,
  activeDown,
  activeEnter() {
    if (!props.options.length || !active.value) return
    handleClick(active.value)
  }
})
</script>
