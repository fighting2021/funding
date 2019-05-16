import {factoryContractInstance, getFundingContractInstance} from "./instance";

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

export {
    getFundingDetail
}