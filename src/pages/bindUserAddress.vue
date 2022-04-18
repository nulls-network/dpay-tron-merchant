<template>
    <h3 class="text-center mb-10 text-lg font-bold">{{ $t('common.bindUserAddress') }}</h3>
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
        :size="formSize"
    >
        <el-form-item :label="$t('bindUserAddress.merchant_address')" prop="merchant_address">
            <el-input v-model="ruleForm.merchant_address"></el-input>
        </el-form-item>

        <el-form-item :label="$t('bindUserAddress.userId')" prop="user_id">
            <el-input v-model="ruleForm.user_id"></el-input>
        </el-form-item>

        <el-form-item :label="$t('bindUserAddress.notify')" prop="notify">
            <el-input v-model="ruleForm.notify" placeholder="localhost"></el-input>
        </el-form-item>

        <el-form-item :label="$t('bindUserAddress.chain_name')" prop="chain_name">
            <el-input v-model="ruleForm.chain_name" ></el-input>
        </el-form-item>

        <el-form-item :label="$t('withdraw.signature')" prop="signature">
            <div class="flex">
                <el-input v-model="ruleForm.signature"></el-input>
                <el-button type="primary" @click="generateSign">{{ $t('orderTool.generate') }}</el-button>
            </div>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)">{{ $t('common.confirm') }}</el-button>
            <el-button @click="resetForm(ruleFormRef)">{{ $t('orderTool.reset') }}</el-button>
        </el-form-item>
    </el-form>

    <sign-dialog v-model:showModal="showModal" :sign-content="signContent" @result="getSignResult" />

    <Json :data="response" />
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { bindUserAddress } from '@/api/index'
import { ElMessage, ElLoading } from 'element-plus';

const showModal = ref(false)

const $t = useI18n().t;
const loading = ref(false)
const formSize = ref('default')
const ruleFormRef = ref()
const ruleForm = reactive({
    merchant_address: ``,
    user_id: ``,
    notify: ``,
    chain_name: `tron`,
    signature: ``,
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
    merchant_address: [
        { required: true, message: $t('bindUserAddress.tip_1'), trigger: 'blur' },
    ],
    user_id: [
        { required: true, message: $t('bindUserAddress.tip_2'), trigger: 'blur' },
    ],
    notify: [
        { required: true, message: $t('bindUserAddress.tip_3'), trigger: 'blur' },
    ],
    chain_name: [
        { required: true, message: $t('bindUserAddress.tip_4'), trigger: 'blur' },
    ],
    signature: [
        { required: true, message: $t('withdraw.tip_5'), trigger: 'blur' },
    ],
})


const signContent = ref('')
const generateSign = async function () {
    let checks = await checkSignFields()
    if (checks) {
        signContent.value = [
            ruleForm.merchant_address,
            ruleForm.user_id,
            ruleForm.notify,
            ruleForm.chain_name,
        ].join('\r')
        showModal.value = true
    }
}

const getSignResult = function (value) {
    ruleForm.signature = value
    ruleFormRef.value.validateField(['signature'])
}

const checkSignFields = function () {
    return new Promise(resolve => {
        let res: Array<any> = []
        let t = 0
        ruleFormRef.value.validateField(['merchant_address', 'user_id', 'notify', 'chain_name'], (vaild: string) => {
            t++
            res.push(vaild)
            if (t === 4) {
                resolve(res.every(v => v === ''))
            }
        })
    })
}

const submitForm = async (formEl) => {
    if (!formEl) return
    if (loading.value) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            try {
                loading.value = true

                const res = await bindUserAddress(ruleForm)
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
