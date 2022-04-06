<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'CPay Merchant Demo',
  meta: [
    { name: 'description', content: 'CPay Merchant Demo' },
  ],
})
const { locale } = useI18n()


onMounted(() => {
  const lang = window.navigator.language.slice(0, 2)
  if (lang == 'zh') {
    locale.value = 'zh-CN'
  }
  else{
    locale.value = 'en'
  }
})


</script>

<template>
  <router-view />
</template>
