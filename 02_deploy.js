let {bytecode, interface} = require('./01_compile')
let hdWalletProvider = require('truffle-hdwallet-provider')
let Web3 = require('web3')

// 2.创建web3实例
let web3 = new Web3()

// Ropsten测试环境
let mnemonic = 'letter debris ready dog window mountain front truth project bottom merit valley'
let providerUrl = 'https://ropsten.infura.io/v3/3d30b778a38b41df8f502d8b8e3ee37b'

// 本地环境
// let mnemonic = 'age shine public hybrid sugar refuse marble top deal wage decline prize'
// let providerUrl = 'http://127.0.0.1:7545'

// 创建HDWalletProvider对象
let provider = new hdWalletProvider(mnemonic, providerUrl)

// 指定服务提供商
web3.setProvider(provider)

// 通过abi接口创建合约实例
let contract = new web3.eth.Contract(JSON.parse(interface))

// 部署合约
let deploy = async () => {
    // 获取账户，调用该方法每次只会返回一个帐号
    let accounts = await web3.eth.getAccounts()
    console.log("contract creator : ", accounts[0])
    // 创建合约实例
    let contractInstance = await contract.deploy({
        data : bytecode,
    }).send({
        from : accounts[0],
        gas : '3000000',
    })
    console.log("contract instance address : ", contractInstance.options.address)
}

deploy()