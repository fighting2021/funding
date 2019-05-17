import React, {Component} from 'react';
import {factoryContractInstance, getFundingContractInstance} from '../eth/instance'
import {getFundingDetail, showRequests, approveRequest} from '../eth/interaction'
import web3 from '../utils/InitWeb3'
import CardList from './common/CardList'
import {Button} from "semantic-ui-react";
import RequestTable from "./common/RequestTable";

class SupportorFundingTab extends Component {

    state = {
        supportorFundingDetail : [],
        currentFundingDetail : '',
        requests : [],
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

    // 回调函数，点击每一个Card时候自动调用
    onCardClick = (currentFundingDetail) => {
        this.setState({
            currentFundingDetail
        })
    }

    // 申请详情按钮事件
    onRequestDetailClick = async () => {
        try {
            let {currentFundingDetail} = this.state
            let requests = await showRequests(currentFundingDetail.fundingAddress)
            this.setState({"requests": requests})
        } catch (e) {
            console.log(e)
        }
    }

    // 处理批准
    // 参数一：Funding合约地址
    // 参数二：第几个合约,从0开始
    handleApprove = (index) => {
        try {
            let {fundingAddress} = this.state.currentFundingDetail
            approveRequest(fundingAddress, index)
        } catch (e) {
            console.log(e)
        }
    }

    render() {
        let {currentFundingDetail, requests} = this.state
        return (
            <div>
                <CardList details={this.state.supportorFundingDetail} onCardClick={this.onCardClick}/>
                {
                    // 如果currentFundingDetail为空，代表用户还没点击Card，所以不会显示后面的div
                    // 如果currentFundingDetail不为空，代表用户已经点击Card，所以就会输出div
                    currentFundingDetail && <div>
                        <Button onClick={this.onRequestDetailClick}>申请详情</Button>
                        <RequestTable requests={requests} tabNo={3} handleApprove={this.handleApprove} investorCount={currentFundingDetail.investorCount}/>
                    </div>
                }
            </div>
        )
    }
}

export default SupportorFundingTab