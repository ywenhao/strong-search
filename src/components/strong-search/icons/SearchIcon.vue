<template>
  <i class="search-icon" @mouseover="active = true" @mouseout="active = false">
    <img :src="active ? SearchActive : Search" alt="" />
  </i>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Search from './search.svg'
import SearchActive from './search-active.svg'

const active = ref(false)
</script>
