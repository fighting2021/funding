import web3 from '../utils/InitWeb3'

// ABI接口
let abi = [ { "constant": true, "inputs": [], "name": "platformManager", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_name", "type": "string" }, { "name": "_targetMoney", "type": "uint256" }, { "name": "_supportMoney", "type": "uint256" }, { "name": "_duration", "type": "uint256" } ], "name": "createFunding", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getAllFundings", "outputs": [ { "name": "", "type": "address[]" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getCreatorFunding", "outputs": [ { "name": "", "type": "address[]" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getSupportorFunding", "outputs": [ { "name": "", "type": "address[]" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" } ]

// 合约地址
let address = '0xb63e02e9dc3b86bee285e2ee8ad1431926845719'

// 获取合约实例
let contractInstance = new web3.eth.Contract(abi, address)
// console.log("contract address : ", contractInstance.options.address)

// 导出合约实例
export {
    contractInstance
}