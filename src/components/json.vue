<template>
    <h3 class="mb-4" v-show="data">{{$t('common.response')}}：</h3>
    <pre id="json" class="json-container"></pre>
</template>

<script lang="ts" setup>

const prop = defineProps(['data'])

watch(()=>prop.data,(value)=>{
    const elem = document.getElementById('json');
    elem.innerHTML = prettyPrintJson.toHtml(value);
})
</script>