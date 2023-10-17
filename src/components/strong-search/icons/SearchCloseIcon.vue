<template>
  <i class="search-close-icon" @mouseover="active = true" @mouseout="active = false">
    <img :src="active ? SearchActive : Search" alt="" />
  </i>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Search from './search-close.svg'
import SearchActive from './search-close-active.svg'

const active = ref(false)
</script>
