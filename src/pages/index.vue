<script lang="ts" setup>
import { Dialog } from 'vant'
import ImageSrc from '@/assets/images/iphone.png'
import { generateOrder, parseAmount } from '@/utils/index'
import { SubmitOrder } from '@/logic/placeOrder'
import { ApiHref, ChecksSiteHref, USDT } from '@/const/index'
import { SignOrder, Recover } from '@/utils/sign.js'
const show = ref(false)
const VanDialog = Dialog.Component
const amount = ref('0.2')
const isEdit = ref(false)
const inputEl = ref()
const privateKey = ref('f78494eb224f875d7e352a2b017304e11e6a3ce94af57b373ae82a73b3496cdd')

nextTick(() => {
  setTimeout(() => {
    show.value = true
  }, 2000)
})
const onClose = async () => {
  if (!privateKey.value)
    return

  const orderInfo = {
    out_order_no: `${Date.now()}`,
    pay_chain: 'tron',
    pay_token: USDT,
    pay_amount: amount.value,
  }
  const signature = await SignOrder(Object.values(orderInfo), privateKey.value)
  console.log(signature)

  // const orderInfo = await generateOrder(amount.value)
  // console.log(orderInfo)
  const { data } = await SubmitOrder(Object.assign({ signature }, orderInfo))
  const params = new URLSearchParams()
  params.append('pay_token', data.pay_token)
  params.append('deadline', data.deadline)
  params.append('pay_amount', data.pay_amount)
  params.append('rec_address', data.rec_address)
  params.append('rec_chain', data.rec_chain)
  params.append('uuid', data.uuid)
  params.append('out_order_no', data.out_order_no)
  window.open(`${ChecksSiteHref}/?${params.toString()}`, '_blank')
  return false
}
const doEdit = () => {
  isEdit.value = true
  nextTick(() => {
    inputEl.value.focus()
  })
}
</script>
<template>
  <div>
    <VanDialog
      v-model:show="show"
      confirm-button-color="#1989fa"
      :before-close="onClose"
      confirm-button-text="Place Order"
    >
      <div class="flex p-2 md:p-4">
        <van-image width="150" :src="ImageSrc" />
        <div class="ml-3 flex flex-col">
          <p class="mb-3">Apple iPhone 13 Mini, 128GB, Pink - Unlocked (Renewed)</p>
        </div>
      </div>
      <div class="px-2">
        <p class="flex items-center">
          <span class="w-100px flex-shrink-0"> Price: </span>
          <input
            ref="inputEl"
            v-model="amount"
            class="w-full px-2 border rounded-md"
            type="text"
            @blur="isEdit = false"
          /> USDT
        </p>
      </div>
      <p class="flex items-center justify-between px-2 mt-4 mb-2">
        <span class="w-100px flex-shrink-0">Private key:</span>
        <input v-model="privateKey" class="w-full px-2 border rounded-md" type="text" @blur="isEdit = false" />
      </p>
    </VanDialog>
  </div>
</template>
<style lang="scss"></style>
