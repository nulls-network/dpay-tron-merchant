<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
const title = useTitle()
const { locale } = useI18n()
const isLoad = ref(false)

onMounted(() => {
  const lang = window.navigator.language.slice(0, 2)
  if (lang == 'zh') {
    title.value = "Cpay支付系统测试工具"
  }
  else {
    title.value = "Cpay system testing tools"
  }

  const l = lang == 'en' ? 'en' : 'zh-CN'
  locale.value = l
  isLoad.value = true
})


</script>

<template>
  <router-view v-show="isLoad" />
</template>
