<template>
  <div class="container px-4">
    <h3 class="text-center mb-10 text-lg font-bold">Dpay 商户订单模拟器</h3>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      :size="formSize"
    >
      <el-form-item label="订单号" prop="orderNumber">
        <div class="flex">
          <el-input v-model="ruleForm.out_order_no"></el-input>
          <el-button type="primary" @click="ruleForm.out_order_no = Date.now() + ''">生成</el-button>
        </div>
      </el-form-item>
      <el-form-item label="交易金额（U）" prop="pay_amount">
        <el-input v-model="ruleForm.pay_amount"></el-input>
      </el-form-item>
      <el-form-item label="收款链名" prop="pay_chain">
        <el-input v-model="ruleForm.pay_chain"></el-input>
      </el-form-item>
      <el-form-item label="收款Token（TRC20，默认USDT）" prop="pay_token">
        <el-input v-model="ruleForm.pay_token"></el-input>
      </el-form-item>
      <el-form-item label="私钥" prop="privateKey">
        <el-input v-model="ruleForm.privateKey"></el-input>
      </el-form-item>
      <el-form-item label="签名信息" prop="signature">
        <div class="flex">
          <el-input v-model="ruleForm.signature"></el-input>
          <el-button type="primary" @click="generateSign">生成</el-button>
        </div>
      </el-form-item>
      <el-form-item label="通知URL" prop="notify">
        <el-input v-model="ruleForm.notify"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">创建订单</el-button>
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { USDT, ChecksSiteHref } from '@/const/index'
import { SignOrder } from '@/utils/sign.js'
import { SubmitOrder } from '@/logic/placeOrder'


const loading = ref(false)
const formSize = ref('default')
const ruleFormRef = ref()
const ruleForm = reactive({
  out_order_no: ``,
  pay_chain: 'tron',
  pay_token: USDT,
  pay_amount: '',
  signature: '',
  privateKey: '',
  notify: '',
})

const checkAmount = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('Please input the amount'))
  }
  setTimeout(() => {
    if (Number.isNaN(+value)) {
      callback(new Error('Please input number type value'))
    }
    else {
      callback()
    }
  }, 100)
}

const rules = reactive({
  out_order_no: [
    { required: true, message: 'Please input order number', trigger: 'blur' },
  ],
  pay_chain: [
    { required: true, message: 'Please input pay chain', trigger: 'blur' },
  ],
  pay_token: [
    { required: true, message: 'Please input pay token', trigger: 'blur' },
  ],
  pay_amount: [
    { required: true, message: 'Please input pay amount', trigger: 'blur' },
    { validator: checkAmount, trigger: 'blur' }
  ],
  signature: [
    { required: true, message: 'Please input signature', trigger: 'blur' },
  ],
  privateKey: [
    { required: true, message: 'Please input privateKey', trigger: 'blur' },
  ],
})

const submitForm = async (formEl) => {
  if (!formEl) return
  if(loading.value) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        loading.value = true
        let orderInfo = Object.assign({}, ruleFormRef.value.model)
        delete orderInfo.privateKey

        const { data } = await SubmitOrder(orderInfo)
        const params = new URLSearchParams()
        params.append('pay_token', data.pay_token)
        params.append('deadline', data.deadline)
        params.append('pay_amount', data.pay_amount)
        params.append('rec_address', data.rec_address)
        params.append('rec_chain', data.rec_chain)
        params.append('uuid', data.uuid)
        params.append('out_order_no', data.out_order_no)
        loading.value = false
        window.open(`${ChecksSiteHref}/?${params.toString()}`, '_blank')
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

const generateSign = async () => {
  console.log(ruleFormRef.value.model)

  let orderInfo = {
    out_order_no: ruleFormRef.value.model.out_order_no,
    pay_chain: 'tron',
    pay_token: ruleFormRef.value.model.pay_token,
    pay_amount: ruleFormRef.value.model.pay_amount,
  }


  const privateKey = ruleFormRef.value.model.privateKey
  const signature = await SignOrder(Object.values(orderInfo), privateKey)
  console.log(signature)
  ruleForm.signature = signature
}

</script>

<style lang="scss">
.container {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 600px;
  transform: translate(-50%, -50%);
}
</style>
