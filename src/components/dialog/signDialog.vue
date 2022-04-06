<template>
    <el-dialog
        :destroy-on-close="true"
        custom-class="cus-dialog"
        v-model="showModal"
        @close="doClose"
        :title="$t('dialog.signTitle')"
    >
        <h3 class="text-lg my-2">{{ $t('dialog.signContent') }}:</h3>
        <el-input
            v-model="signContent"
            :rows="6"
            type="textarea"
            :placeholder="$t('dialog.inputContent')"
        />
        <h3 class="text-lg my-2">{{ $t('dialog.privatekey') }}:</h3>
        <el-input type="text" v-model="privateKey" />
        <h3 class="text-lg my-2" v-show="notAutoClose">{{ $t('dialog.result') }}:</h3>
        <el-input type="text" v-show="notAutoClose" v-model="result" />
        <div class="flex justify-end">
            <el-button-group class="mt-4">
                <el-button type="default" @click="doClose">{{ $t('common.cancel') }}</el-button>
                <el-button type="primary" @click="doSign">{{ $t('common.confirm') }}</el-button>
            </el-button-group>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { SignCommon } from '@/utils/sign'

const props = defineProps(['showModal', 'signContent', 'notAutoClose'])
const emits = defineEmits(['update:showModal', 'result'])

const doClose = function () {
    result.value = ""
    privateKey.value = ''
    emits('update:showModal', false)
}


const privateKey = ref('')
const result = ref('')
const doSign = async function () {
    try {
        const info = props.signContent.split(/[\r\n]/)
        console.log(info)
        result.value = await SignCommon(info, privateKey.value)
        emits('result', result.value)

        if (!props.notAutoClose) {
            doClose()
        }
    } catch (error: any) {
    }
}
</script>

<style lang="scss" scoped>
</style>