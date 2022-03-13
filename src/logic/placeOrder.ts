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
