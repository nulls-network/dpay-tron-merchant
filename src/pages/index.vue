<template>
  <div class="container px-4">
    <h3 class="text-center mb-10 text-lg font-bold">{{$t('orderTool.OrderToolTitle')}}</h3>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      :size="formSize"
    >
      <el-form-item :label="$t('orderTool.orderNumber')" prop="out_order_no">
        <div class="flex">
          <el-input v-model="ruleForm.out_order_no"></el-input>
          <el-button type="primary" @click="generateOrderNumber">{{$t('orderTool.generate')}}</el-button>
        </div>
      </el-form-item>
      <el-form-item :label="$t('orderTool.transactionAmount')" prop="pay_amount">
        <el-input v-model="ruleForm.pay_amount"></el-input>
      </el-form-item>
      <el-form-item :label="$t('orderTool.chainName')" prop="pay_chain">
        <el-input v-model="ruleForm.pay_chain"></el-input>
      </el-form-item>
      <el-form-item :label="$t('orderTool.receiveToken')" prop="pay_token">
        <el-input v-model="ruleForm.pay_token"></el-input>
      </el-form-item>
      <el-form-item :label="$t('orderTool.privateKey')" prop="privateKey">
        <el-input v-model="ruleForm.privateKey"></el-input>
      </el-form-item>
      <el-form-item :label="$t('orderTool.publicKey')" prop="pub_key">
        <el-input v-model="ruleForm.pub_key"></el-input>
      </el-form-item>
      <el-form-item :label="$t('orderTool.notifyUrl')" prop="notify">
        <el-input v-model="ruleForm.notify" placeholder="localhost"></el-input>
      </el-form-item>
      <el-form-item :label="$t('orderTool.signMessage')" prop="signature">
        <div class="flex">
          <el-input v-model="ruleForm.signature"></el-input>
          <el-button type="primary" @click="generateSign">{{$t('orderTool.generate')}}</el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">{{$t('orderTool.createorder')}}</el-button>
        <el-button @click="resetForm(ruleFormRef)">{{$t('orderTool.reset')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { USDT, ChecksSiteHref } from '@/const/index'
import { SignOrder, Recover } from '@/utils/sign.js'
import { SubmitOrder } from '@/logic/placeOrder'
import { ElMessage } from 'element-plus';
import moment from 'moment'

const $t = useI18n().t;
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
  pub_key: '',
})

const checkAmount = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error($t('orderTool.tip_inputAmount')))
  }
  setTimeout(() => {
    if (Number.isNaN(+value)) {
      callback(new Error($t('orderTool.tip_inputNumberType')))
    }
    else {
      ruleForm.pay_amount = (+ruleForm.pay_amount).toString()
      callback()
    }
  }, 100)
}

const rules = reactive({
  out_order_no: [
    { required: true, message: $t('orderTool.tip_inputOrderNum'), trigger: 'blur' },
  ],
  pay_chain: [
    { required: true, message: $t('orderTool.tip_inputPayChain'), trigger: 'blur' },
  ],
  pay_token: [
    { required: true, message: $t('orderTool.tip_inputPayToken'), trigger: 'blur' },
  ],
  pay_amount: [
    { required: true, message: $t('orderTool.tip_inputAmount'), trigger: 'blur' },
    { validator: checkAmount, trigger: 'blur' }
  ],
  signature: [
    { required: true, message: $t('orderTool.tip_inputSign'), trigger: 'blur' },
  ],
  privateKey: [
    { required: true, message: $t('orderTool.tip_inputPrivateKey'), trigger: 'blur' },
  ],
  pub_key: [
    { required: true, message: $t('orderTool.tip_inputPubkey'), trigger: 'blur' },
  ],
  notify: [
    { required: true, message: $t('orderTool.tip_inputNotifyUrl'), trigger: 'blur' },
  ],
})

const submitForm = async (formEl) => {
  if (!formEl) return
  if (loading.value) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        loading.value = true
        let orderInfo = Object.assign({}, ruleFormRef.value.model)
        delete orderInfo.privateKey

        const { code, data, message } = await SubmitOrder(orderInfo)
        loading.value = false
        if (code == 0) {
          const params = new URLSearchParams()
          params.append('pay_token', data.pay_token)
          params.append('deadline', data.deadline)
          params.append('pay_amount', data.pay_amount)
          params.append('rec_address', data.rec_address)
          params.append('rec_chain', data.rec_chain)
          params.append('uuid', data.uuid)
          params.append('out_order_no', data.out_order_no)
          window.open(`${ChecksSiteHref}/?${params.toString()}`, '_blank')
        }
        else {
          ElMessage({ message,type:'error' })
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

const checkSignFields = function () {
  return new Promise(resolve => {
    let res: Array<any> = []
    let t = 0
    ruleFormRef.value.validateField(['out_order_no', 'pay_chain', 'pay_token', 'pay_amount', 'notify', 'privateKey'], (vaild: string) => {
      t++
      res.push(vaild)
      if (t === 6) {
        resolve(res.every(v => v === ''))
      }
    })
  })
}

const generateOrderNumber = () => {
  ruleForm.out_order_no = moment(Date.now()).format('YYYYMMDDHHmmss');
  ruleFormRef.value.validateField(['out_order_no'])
}

const generateSign = async () => {
  // console.log(ruleFormRef.value.model)

  let checks = await checkSignFields()
  console.log(checks)

  if (checks) {
    let orderInfo = {
      out_order_no: ruleFormRef.value.model.out_order_no,
      pay_chain: 'tron',
      pay_token: ruleFormRef.value.model.pay_token,
      pay_amount: ruleFormRef.value.model.pay_amount,
      notify: ruleFormRef.value.model.notify,
    }


    const privateKey = ruleFormRef.value.model.privateKey
    const signature = await SignOrder(orderInfo, privateKey)
    console.log(signature)
    ruleForm.signature = signature

    ruleFormRef.value.validateField(['signature'])
  }

}

// onMounted(async () => {
//   const r = await Recover('0xa2597aa1dbb7a70cad7a11592e6bedfd2d79efec0de36f7a7b42872c7a8d0387','0x486ff75bd6a6adc08603489634c3ce9c0000dcb1ce2df54772721c321e9d9402301b0085ec0fe48681211d5c88f11a88e527aa8569a6620bd7292bfdebde1fb51c')
//   console.log(r)
// })

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
