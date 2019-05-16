import React, {Component} from 'react';
import {factoryContractInstance, fundingContractInstance} from '../eth/instance'
import {getFundingDetail} from '../eth/interaction'
import web3 from '../utils/InitWeb3'
import CardList from './common/CardList'

class AllFundingTab extends Component {

    state = {
        allFundingDetail : []
    }

    async componentWillMount() {
        // 获取当前用户地址
        let accounts = await web3.eth.getAccounts()
        // 调用合约方法，获取所有的众筹合约，该方法返回一个合约数组
        let allFundings = await factoryContractInstance.methods.getAllFundings().call({
            from : accounts[0]
        })
        // 获取合约详情的Promise
        let allFundingDetail = await getFundingDetail(allFundings)
        this.setState({
            allFundingDetail
        })
    }

    render() {
        return (
            <div>
                <CardList details={this.state.allFundingDetail}/>
            </div>
        )
    }
}

export default AllFundingTab