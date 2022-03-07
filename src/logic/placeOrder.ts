import axios from 'axios'
const baseURL = 'http://localhost:7001'
const axiosIns = axios.create({
    baseURL
})


export const SubmitOrder = async function (data) {
    return axiosIns({
        url: '/addOrder',
        method: 'post',
        data
    }).then(res => res.data)
}