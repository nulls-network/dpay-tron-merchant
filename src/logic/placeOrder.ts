import { ApiHref } from '@/const'
import axios from 'axios'
const axiosIns = axios.create({
    baseURL:ApiHref
})


export const SubmitOrder = async function (data) {
    return axiosIns({
        url: '/addOrder',
        method: 'post',
        data
    }).then(res => res.data)
}