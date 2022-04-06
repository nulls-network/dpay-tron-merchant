<template>
  <Nav />
  <div class="container mx-auto px-4 pb-12">
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import Nav from '../components/nav.vue'
</script>
