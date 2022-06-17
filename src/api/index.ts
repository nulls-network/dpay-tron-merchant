import axios from 'axios'
import { ApiHref } from '@/const'
const axiosIns = axios.create({
  // baseURL: ApiHref
  withCredentials: true
})

export const SubmitOrder = async function(data) {
  return axiosIns({
    url: '/api/v1/order/create',
    method: 'post',
    data,
  }).then(res => res.data)
}

export const SubmitSignMessageOrder = async function(data) {
  return axiosIns({
    url: '/api/v2/order',
    method: 'post',
    data,
  }).then(res => res.data)
}

export const QueryOrderStatus = async function(data) {
  return axiosIns({
    url: `/api/v1/order/${data}`,
    method: 'get',
    data,
  }).then(res => res.data)
}

export const queryMerchantBalance = async function(data) {
  return axiosIns({
    url: `/api/v1/merchant/balanceOf`,
    method: 'post',
    data,
  }).then(res => res.data)
}

export const doWithdraw = async function(data) {
  return axiosIns({
    url: `/api/v1/merchant/doWithdraw`,
    method: 'post',
    data,
  }).then(res => res.data)
}

export const doWithdrawNew = async function(data) {
  return axiosIns({
    url: `/api/v1/merchant/withdrawAndNotify`,
    method: 'post',
    data,
  }).then(res => res.data)
}

export const queryWithdrawResult = async function(data) {
  return axiosIns({
    url: `/api/v1/withdraw/${data}`,
    method: 'get',
    data,
  }).then(res => res.data)
}

export const bindUserAddress = async function(data) {
  return axiosIns({
    url: `/api/v1/bing/merchantBingAddress`,
    method: 'post',
    data,
  }).then(res => res.data)
}

export const queryExchangeFee = async function() {
  return axiosIns({
    url: `/api/v1/rate`,
    method: 'get',
  }).then(res => res.data)
}
