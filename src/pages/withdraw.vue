<template>
    <h3 class="text-center mb-10 text-lg font-bold">{{ $t('common.withdraw') }}</h3>
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
        :size="formSize"
    >
        <el-form-item :label="$t('withdraw.to')" prop="to">
            <el-input v-model="ruleForm.to"></el-input>
        </el-form-item>

        <el-form-item :label="$t('withdraw.token')" prop="token">
            <el-input v-model="ruleForm.token"></el-input>
        </el-form-item>

        <el-form-item prop="amount" class="cus-form-item">
            <template v-slot:label>
                {{ $t('withdraw.amount') }}
                <el-tooltip
                    class="box-item"
                    :content="$t('withdraw.tip_amount_precision')"
                    placement="top"
                >
                    <icon-mdi-help-circle-outline />
                </el-tooltip>
            </template>
            <el-input v-model="ruleForm.amount"></el-input>
        </el-form-item>

        <el-form-item :label="$t('withdraw.fromChain')" prop="fromChain">
            <el-input v-model="ruleForm.fromChain"></el-input>
        </el-form-item>

        <el-form-item :label="$t('withdraw.toChain')" prop="toChain">
            <el-input v-model="ruleForm.toChain"></el-input>
        </el-form-item>

        <el-form-item :label="$t('withdraw.uuid')" prop="uuid">
            <div class="flex">
                <el-input v-model="ruleForm.uuid"></el-input>
                <el-button type="primary" @click="generateRandom">{{ $t('orderTool.generate') }}</el-button>
            </div>
        </el-form-item>

        <el-form-item :label="$t('withdraw.signature')" prop="signature">
            <div class="flex">
                <el-input v-model="ruleForm.signature"></el-input>
                <el-button type="primary" @click="generateSign">{{ $t('orderTool.generate') }}</el-button>
            </div>
        </el-form-item>

        <el-form-item :label="$t('withdraw.from')" prop="from">
            <el-input v-model="ruleForm.from"></el-input>
        </el-form-item>

        <el-form-item label="isPayment" prop="isPayment">
            <el-switch
                v-model="ruleForm.isPayment"
                active-color="#13ce66"
                inactive-color="#ff4949">
            </el-switch>
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
import { doWithdraw } from '@/api/index'
import { ElMessage, ElLoading } from 'element-plus';
import moment from 'moment'

const showModal = ref(false)

const $t = useI18n().t;
const loading = ref(false)
const formSize = ref('default')
const ruleFormRef = ref()
const ruleForm = reactive({
    to: ``,
    token: `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`,
    amount: ``,
    fromChain: `tron`,
    toChain: `tron`,
    uuid: ``,
    signature: ``,
    from: ``,
    isPayment: undefined
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
    to: [
        { required: true, message: $t('withdraw.tip_inputTo'), trigger: 'blur' },
    ],
    token: [
        { required: true, message: $t('withdraw.tip_inputToken'), trigger: 'blur' },
    ],
    amount: [
        { required: true, message: $t('withdraw.tip_inputAmount'), trigger: 'blur' },
    ],
    fromChain: [
        { required: true, message: $t('withdraw.tip_inputChain'), trigger: 'blur' },
    ],
    toChain: [
        { required: true, message: $t('withdraw.tip_inputChain'), trigger: 'blur' },
    ],
    uuid: [
        { required: true, message: $t('withdraw.tip_inputuuid'), trigger: 'blur' },
    ],
    signature: [
        { required: true, message: $t('withdraw.tip_inputSign'), trigger: 'blur' },
    ],
    from: [
        { required: true, message: $t('withdraw.tip_inputFrom'), trigger: 'blur' },
    ],
})

const generateRandom = () => {
    ruleForm.uuid = moment(Date.now()).format('YYYYMMDDHHmmss');
    ruleFormRef.value.validateField(['uuid'])
}

const signContent = ref('')
const generateSign = async function () {
    let checks = await checkSignFields()
    if (checks) {
        signContent.value = [
            ruleForm.to,
            ruleForm.token,
            ruleForm.amount,
            ruleForm.fromChain,
            ruleForm.toChain,
            ruleForm.uuid,
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
        ruleFormRef.value.validateField(['to', 'token', 'amount', 'fromChain', 'toChain', 'uuid'], (vaild: string) => {
            t++
            res.push(vaild)
            if (t === 6) {
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

                const res = await doWithdraw(ruleForm)
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
