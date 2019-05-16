import React, {Component} from 'react';
import {factoryContractInstance, fundingContractInstance} from '../eth/instance'
import {getFundingDetail} from '../eth/interaction'
import web3 from '../utils/InitWeb3'
import CardList from './common/CardList'

class SupportorFundingTab extends Component {

    state = {
        supportorFundingDetail : []
    }

    async componentWillMount() {
        // 获取当前用户地址
        let accounts = await web3.eth.getAccounts()
        // 调用合约方法，获取我支持的众筹合约，该方法返回一个合约数组
        let allFundings = await factoryContractInstance.methods.getSupportorFunding().call({
            from : accounts[0]
        })
        // 获取合约详情的Promise
        let supportorFundingDetail = await getFundingDetail(allFundings)
        this.setState({
            supportorFundingDetail
        })
    }

    render() {
        return (
            <div>
                <CardList details={this.state.supportorFundingDetail}/>
            </div>
        )
    }
}

export default SupportorFundingTab