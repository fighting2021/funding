import React, {Component} from 'react';
import {factoryContractInstance, fundingContractInstance} from '../eth/instance'
import {getFundingDetail} from '../eth/interaction'
import web3 from '../utils/InitWeb3'
import CardList from './common/CardList'

class CreatorFundingTab extends Component {

    state = {
        // creatorFundings : [],
        creatorFundingDetail : []
    }

    async componentWillMount() {
        // 获取当前用户地址
        let accounts = await web3.eth.getAccounts()
        // 调用合约的getCreatorFunding方法，获取我发起的众筹合约，该方法返回一个合约数组
        let creatorFundings = await factoryContractInstance.methods.getCreatorFunding().call({
            from : accounts[0]
        })
        // 获取合约详情的Promise
        let creatorFundingDetail = await getFundingDetail(creatorFundings)
        this.setState({
            // creatorFundings
            creatorFundingDetail
        })

        /*creatorFundingDetail.then(detail => {
            console.table(detail)
        })*/

    }

    render() {
        return (
            <div>
                <CardList details={this.state.creatorFundingDetail}/>
            </div>
        )
    }
}

export default CreatorFundingTab