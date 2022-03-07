<script lang="ts" setup>
import { Dialog } from 'vant'
import ImageSrc from '@/assets/images/iphone.png'
import { generateOrder } from '@/utils/index'
import { SubmitOrder } from '@/logic/placeOrder';
const show = ref(false)
const VanDialog = Dialog.Component
const amount = ref('1')
const isEdit = ref(false)
const inputEl = ref()
nextTick(() => {
  setTimeout(() => {
    show.value = true
  }, 2000)
})
const onClose = async () => {
  const orderInfo = await generateOrder(amount.value)
  console.log(orderInfo)
  const result = await SubmitOrder(orderInfo)
  window.open(`http://192.168.10.12:7001/index/${result.data.id}`)
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
          <p v-show="!isEdit" class="flex items-center" @click="doEdit">
            Price: {{ amount }} USDT
            <carbon-edit class="text-sm ml-1"></carbon-edit>
          </p>
          <p v-show="isEdit" class="flex items-center">
            Price:
            <input
              ref="inputEl"
              v-model="amount"
              class="w-50px px-2"
              type="text"
              @blur="isEdit = false"
            /> USDT
          </p>
        </div>
      </div>
    </VanDialog>
  </div>
</template>
<style lang="scss"></style>
