<template>
  <div class="search-check">
    <ElCheckbox
      size="small"
      v-model="checkAll"
      :class="{ active: active === 'all' }"
      @change="handleCheckAllChange($event as boolean)"
      @mouseover="active = 'all'"
      >全选</ElCheckbox
    >
    <ElCheckboxGroup size="small" v-model="item" @change="handleChange($event as Value[])">
      <ElCheckbox
        v-for="item in options"
        :key="item.label"
        :label="item.value"
        :class="{ active: active === item.value }"
        @mouseover="active = item.value"
        >{{ item.label }}</ElCheckbox
      >
    </ElCheckboxGroup>
    <div class="search-popover-footer">
      <ElButton @click="handleCancel" size="small">取消</ElButton>
      <ElButton @click="handleOk" type="primary" size="small" :disabled="!items.length"
        >确定</ElButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { useActive } from '@/hooks/useActive'
import type { LabelValue } from '@/types'
import { ElButton, ElCheckbox, ElCheckboxGroup } from 'element-plus'
import { computed, ref, watchEffect } from 'vue'

const props = defineProps<{
  options: LabelValue[]
}>()

const emit = defineEmits<{
  ok: [value: LabelValue[]]
  cancel: []
}>()

type Value = LabelValue['value']

const checkAll = ref(false)
const actives = computed(() => ['all', ...props.options.map((v) => v.value)])

const active = ref<Value | 'all'>(actives.value[0])

const item = ref<Value[]>([])

const items = computed(() => props.options.filter((v) => item.value.includes(v.value)))

watchEffect(() => {
  onClear()
})

const handleCheckAllChange = (val: boolean) => {
  item.value = val ? props.options.map((v) => v.value) : []
}

function handleChange(value: Value[]) {
  checkAll.value = value.length === props.options.length
}

function onClear() {
  active.value = actives.value[0]
  checkAll.value = false
  item.value = []
}

function handleCancel() {
  emit('cancel')
  onClear()
}

function handleOk() {
  emit('ok', items.value)
  onClear()
}

const { activeUp, activeDown } = useActive(active, actives)

defineExpose({
  activeUp,
  activeDown,
  activeEnter() {
    if (!props.options.length || !active.value) return
    if (active.value === 'all') {
      checkAll.value = !checkAll.value
      handleCheckAllChange(checkAll.value)
    } else {
      const idx = item.value.findIndex((v) => v === active.value)
      idx > -1 ? item.value.splice(idx, 1) : item.value.push(active.value)
      handleChange(item.value)
    }
  }
})
</script>
