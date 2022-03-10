import { ethers, utils } from 'ethers'

const { concat, keccak256, toUtf8Bytes } = utils

async function recover(messageDigest, signature) {
    try {
        const sig = ethers.utils.splitSignature(signature)
        const recovered = ethers.utils.recoverAddress(messageDigest, sig)
        return recovered
    } catch (e) {
        return null
    }
}
function toBytes(...params) {
    const v = []
    for (const p of params) {
        if (typeof (p) === 'string') {
            v.push(toUtf8Bytes(p))
        } else {
            v.push(toUtf8Bytes(String(p)))
        }
    }
    return keccak256(concat(v))
}

const privateKey = 'f78494eb224f875d7e352a2b017304e11e6a3ce94af57b373ae82a73b3496cdd'

export async function SignOrder(orderInfo = [],privateKey) {

    const bytesData = toBytes(orderInfo)

    const signer = new ethers.Wallet(privateKey)

    return signer.signMessage(bytesData)

}