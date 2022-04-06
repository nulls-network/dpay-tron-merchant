<template>
    <h3 class="text-center mb-10 text-lg font-bold">{{ $t('common.queryMerchantBalance') }}</h3>
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
        :size="formSize"
    >
        <el-form-item :label="$t('queryMerchantBalance.merchant')" prop="merchant">
            <el-input v-model="ruleForm.merchant"></el-input>
        </el-form-item>

        <el-form-item :label="$t('queryMerchantBalance.chain')" prop="chain">
            <el-input v-model="ruleForm.chain"></el-input>
        </el-form-item>

        <el-form-item :label="$t('queryMerchantBalance.token')" prop="token">
            <el-input v-model="ruleForm.token"></el-input>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)">{{ $t('common.query') }}</el-button>
            <el-button @click="resetForm(ruleFormRef)">{{ $t('orderTool.reset') }}</el-button>
        </el-form-item>
    </el-form>
    <Json :data="response" />
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { queryMerchantBalance } from '@/api/index'
import { ElMessage, ElLoading } from 'element-plus';


const $t = useI18n().t;
const loading = ref(false)
const formSize = ref('default')
const ruleFormRef = ref()
const ruleForm = reactive({
    merchant: ``,
    chain: `tron`,
    token: `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`,
})

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

const rules = reactive({
    merchant: [
        { required: true, message: $t('queryMerchantBalance.tip_inputMerchant'), trigger: 'blur' },
    ],
    chain: [
        { required: true, message: $t('queryMerchantBalance.tip_inputChain'), trigger: 'blur' },
    ],
    token: [
        { required: true, message: $t('queryMerchantBalance.tip_inputToken'), trigger: 'blur' },
    ],
})

const submitForm = async (formEl) => {
    if (!formEl) return
    if (loading.value) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            try {
                loading.value = true

                const res = await queryMerchantBalance(ruleForm)
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

        } else {
            console.log('error submit!', fields)
        }
    })
}

const resetForm = (formEl) => {
    if (!formEl) return
    formEl.resetFields()
}

</script>

<style lang="scss">
</style>
