import { ethers } from 'ethers'

const { concat, keccak256, toUtf8Bytes, SigningKey, joinSignature } = ethers.utils

export async function Recover(messageDigest, signature) {
  try {
    const sig = ethers.utils.splitSignature(signature)
    const recovered = ethers.utils.recoverAddress(messageDigest, sig)
    return recovered
  }
  catch (e) {
    return null
  }
}
function toBytes(...params) {
  if (typeof (params[0]) === 'object') params = params[0]
  const v = []
  for (const p of params) {
    if (typeof (p) === 'string')
      v.push(toUtf8Bytes(p))

    else
      v.push(toUtf8Bytes(String(p)))
  }
  return keccak256(concat(v))
}

// const privateKey = 'f78494eb224f875d7e352a2b017304e11e6a3ce94af57b373ae82a73b3496cdd'

export async function SignOrder(orderInfo = [], privateKey) {
  try {
    const bytesData = toBytes(orderInfo)

    console.log(bytesData)

    const signer = new SigningKey(`0x${privateKey}`)

    const signature = signer.signDigest(bytesData)

    return joinSignature(signature)
  }
  catch (error) {
    console.log(error)
  }
}

/*
  const pubkey = await Recover('0x2f4229f14ade324301ec4c6eb6674472106403de6d33675f2cad6f531b723570','0x25b1bfad5408341240c220bd691d21b582395e9ac23a463fde0d1e0a668ef95b64b0fdfea773548126223a2fad7ab147ba2512ceb38d1d86683f75f7fcbffab21c')
  console.log(pubkey,111)
*/
