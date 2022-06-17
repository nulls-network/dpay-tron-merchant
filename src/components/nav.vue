<template>
    <el-menu
        :default-active="activeIndex"
        class="el-menu-demo mb-5"
        mode="horizontal"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        @select="handleSelect"
    >
        <el-menu-item class="!mr-7">
            <img src="/logo.png" class="h-32px" />
            <span class="text-white text-lg ml-2">
                CPay
                <em class="text-xs not-italic">(Prod)</em>
            </span>
        </el-menu-item>
        <el-menu-item index="/">{{ $t('common.orderTool') }}</el-menu-item>
        <!-- <el-menu-item index="/indexNew">{{ $t('common.orderTool1') }}</el-menu-item> -->
        <el-menu-item index="/withdraw">{{ $t('common.withdraw') }}</el-menu-item>
        <el-menu-item index="/withdrawNew">{{ $t('common.withdrawNew') }}</el-menu-item>
        <el-menu-item index="/bindUserAddress">{{ $t('common.bindUserAddress') }}</el-menu-item>
        <el-sub-menu index="/query">
            <template #title>{{$t('common.query')}}</template>
            <el-menu-item index="/queryOrderStatus">{{ $t('common.queryOrderStatu') }}</el-menu-item>
            <el-menu-item index="/queryMerchantBalance">{{ $t('common.queryMerchantBalance') }}</el-menu-item>
            <el-menu-item index="/queryWithdrawResult">{{ $t('common.queryWithdrawResult') }}</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="/tools">
            <template #title>{{$t('common.tool')}}</template>
            <el-menu-item index="/signMessage">{{ $t('common.signMessage') }}</el-menu-item>
            <el-menu-item index="/queryExchangeFee">{{ $t('common.exchangeFee') }}</el-menu-item>
        </el-sub-menu>
    </el-menu>
    <sign-dialog v-model:showModal="showModal" :notAutoClose="true" :sign-content="''"/>

</template>

<script lang="ts" setup>
import { ref } from 'vue'

const router = useRouter()
const route = useRoute()

const showModal = ref(false)


const activeIndex = ref(route.path)
const handleSelect = (key: string, keyPath: string[]) => {
    if(key === '/signMessage'){
        showModal.value = true
    }
    else{
        router.push(key)
    }
}




</script>
