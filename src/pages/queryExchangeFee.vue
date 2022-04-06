<template>
    <h3 class="text-center mb-10 text-lg font-bold">{{ $t('common.queryExchangeFee') }}</h3>
    <div class="flex justify-center my-5">
        <el-button type="primary" @click="submitForm">{{ $t('common.query') }}</el-button>
    </div>
    <Json :data="response" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { queryExchangeFee } from '@/api/index'
import { ElMessage, ElLoading } from 'element-plus';


const $t = useI18n().t;
const loading = ref(false)


const response = ref('')
const loadingIns = ref()
watch(loading, (val) => {
    if (val) {
        loadingIns.value = ElLoading.service({ fullscreen: true, background: 'rgba(255,255,255,0.3)' })
    }
    else {
        loadingIns.value?.close()
    }
})


const submitForm = async () => {
    if (loading.value) return
    try {
        loading.value = true

        const res = await queryExchangeFee()
        loading.value = false
        response.value = res
        if (res.code == 0) {
        }
        else {
            ElMessage({ message: res.message, type: 'error' })
        }

    } catch (error) {
        loading.value = false
    }

}

</script>

<style lang="scss">
</style>
