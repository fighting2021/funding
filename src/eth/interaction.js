import {factoryContractInstance, getFundingContractInstance} from "./instance";
import web3 from '../utils/InitWeb3'

// 获取我发起合约的详情
// 该函数返回一个Promise对象，该Promise对象包含了所有的合约详情
let getFundingDetail = (fundings) => {
    let details = fundings.map(async function(fundingAddress) {
        let fundingContractInstance = getFundingContractInstance()
        // 1.把Funding实例拿过来,并且为实例填充地址
        fundingContractInstance.options.address = fundingAddress
        console.log("fundingAddress = ",fundingAddress)
        // 2.调用方法获取Funding实例的详情
        let manager = await fundingContractInstance.methods.manager().call()
        let projectName = await fundingContractInstance.methods.projectName().call()
        let targetMoney = await fundingContractInstance.methods.targetMoney().call()
        let supportMoney = await fundingContractInstance.methods.supportMoney().call()
        let leftTime = await fundingContractInstance.methods.getLeftTime().call()
        let balance = await fundingContractInstance.methods.getBalance().call()
        let investorCount = await fundingContractInstance.methods.getInvestorCount().call()
        // 3.创建结构体对象
        let detail = {
            fundingAddress,
            manager,
            projectName,
            targetMoney,
            supportMoney,
            leftTime,
            balance,
            investorCount}
        return detail
    })

    // 把多个Promise处理成一个Promise
    let detailsPromise = Promise.all(details)
    return detailsPromise
}

// 创建合约
let createFunding = (projectName, targetMoney, supportMoney, duration) => {

    return new Promise(async (resolve, reject) => {
        try { // 调用创建方法
            let accounts = await web3.eth.getAccounts()
            let res = await factoryContractInstance.methods.createFunding(projectName, targetMoney, supportMoney, duration).send({
                from: accounts[0],
            })
            resolve(res)
        } catch (e) {
            reject(e)
        }
    })
}

// 创建花费请求
let createRequest = (fundingAddress, desc, targetMoney, seller) => {
    return new Promise(async (resolve, reject) => {
        try { // 调用创建方法
            let accounts = await web3.eth.getAccounts()
            let fundingInstance = getFundingContractInstance()
            fundingInstance.options.address = fundingAddress
            // function createRequest(string _purpose, uint256 _cost, address _seller) onlyManager public {
            let res = await fundingInstance.methods.createRequest(desc, targetMoney, seller).send({
                from: accounts[0],
            })
            resolve(res)
        } catch (e) {
            reject(e)
        }
    })
}

// 参与众筹
let handleInvestFunc = async (fundingAddress, supportMoney) => {
    // 获取合约实例
    let fundingContractInstance = getFundingContractInstance()
    // 设置地址
    fundingContractInstance.options.address = fundingAddress
    // 获取账户
    let accounts = await web3.eth.getAccounts()
    // 调用合约的invest方法
    let res = await fundingContractInstance.methods.invest().send({
        from: accounts[0],
        value: supportMoney,
    })
    return res
}

// 获取所有花费请求申请
let showRequests = (fundingAddress) => {
    return new Promise(async (resolve, reject) => {
        try {
            // 获取Funding合约实例
            let fundingInstance = getFundingContractInstance()
            fundingInstance.options.address = fundingAddress
            // 调用合约方法获取请求总数
            let requestCount = await fundingInstance.methods.getRequestCount().call()
            // 定义一个数组，保存所有请求申请
            let requestDetails = []
            for (let i = 0; i < requestCount; i++) {
                // 调用合约方法，根据索引查询请求申请
                let requestDetail = await fundingInstance.methods.getRequest(i).call()
                // 把结果添加到数组中
                requestDetails.push(requestDetail)
            }
            resolve(requestDetails)
        } catch (e) {
            reject(e)
        }
    })
}

// 批准
const approveRequest = (fundingAddress, index) => {
    return new Promise(async(resolve, reject) => {
        try {
            let accounts = await web3.eth.getAccounts()
            // 创建合约实例
            let fundingContractInstance = getFundingContractInstance()
            fundingContractInstance.options.address = fundingAddress
            // 调用合约的方法
            let res = await fundingContractInstance.methods.approveRequest(index).send({
                from : accounts[0]
            })
            resolve(res)
        } catch (e) {
            reject(e)
        }
    })
}

// 终止申请
const finalizeRequest = (fundingAddress, index) => {
    return new Promise(async(resolve, reject) => {
        try {
            let accounts = await web3.eth.getAccounts()
            // 创建合约实例
            let fundingContractInstance = getFundingContractInstance()
            fundingContractInstance.options.address = fundingAddress
            // 调用合约的方法
            let res = await fundingContractInstance.methods.finalizeRequest(index).send({
                from : accounts[0]
            })
            resolve(res)
        } catch (e) {
            reject(e)
        }
    })
}


export {
    getFundingDetail,
    createFunding,
    handleInvestFunc,
    createRequest,
    showRequests,
    approveRequest,
    finalizeRequest,
}