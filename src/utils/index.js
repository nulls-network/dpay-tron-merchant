// import TronWeb from 'tronweb/dist/TronWeb.js'
import { ethers, utils } from 'ethers'

export function getImg(name) {
  const path = `/src/assets/${name}`
  const modules = import.meta.globEager('/src/assets/*.(png|jpg|svg)')
  return modules[path].default
}

async function getTronWeb() {
  if (window) {
    var TronWeb = (await import('tronweb/dist/TronWeb.js')).default
    console.log(TronWeb)
  }
  // const rpc = 'https://api.trongrid.io';//production
  const rpc = 'https://nile.trongrid.io'
  const HttpProvider = TronWeb.providers.HttpProvider
  const fullNode = new HttpProvider(rpc)
  const solidityNode = new HttpProvider(rpc)
  const eventServer = new HttpProvider(rpc)
  const tronWeb = new TronWeb(fullNode, solidityNode, eventServer)
  tronWeb.setAddress('TLjg42ZBsEU161bBYorRR9yfve8EKTcZL9')// caller address for query token info
  // tronWeb.setHeader({ 'TRON-PRO-API-KEY': 'ce2d4035-a3cc-487e-90d5-c575b892f2d4' });
  return tronWeb
}

async function getTokenDecimal(tokenAdderss) {
  const tronWeb =await getTronWeb()
  const instance = await tronWeb.contract().at(tokenAdderss)
  return await instance.decimals().call()
}

export async function generateOrder(originAmount) {
  try {
    const tronWeb =await getTronWeb()
    const USDT = 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj'
    const orderNo = (new Date().getTime()).toString()
    const token = USDT
    let amount = ''
    const to = 'TD16YPGYRRzg8SGxehi1Xb5DSuAKGjT22r'


    const decimals = await getTokenDecimal(token)
    console.log('decimals: ', decimals)


    let _amount = (+((+originAmount).toFixed(decimals))).toString();
    if (Number.isNaN(_amount)) {
      throw new Error('invaild amount')
    }
    let _decimals = decimals
    const dLen = _amount.split('.')[1]?.length || 0
    if (dLen > 0) {
      _decimals -= dLen
      _amount = _amount.replace('.', '')
      console.log('decimal amount: ', _amount, dLen)
    }
    console.log(_amount.toString())


    amount = utils.parseUnits(_amount, _decimals).toString()
    console.log('parsed amount: ', amount)


    const abiCoder = new ethers.utils.AbiCoder()
    const bytesData = abiCoder.encode(
      ['bytes32', 'string', 'uint256', 'string'],
      [ethers.utils.formatBytes32String(orderNo), token, amount, to],
    )
    const strHash = ethers.utils.keccak256(bytesData).replace(/^0x/, '')
    // merchant private key
    const sign = await tronWeb.trx.sign(strHash, 'f78494eb224f875d7e352a2b017304e11e6a3ce94af57b373ae82a73b3496cdd')
    return { orderNo, token, amount, to, sign }
  } catch (error) {
    console.log(error)
  }
}
