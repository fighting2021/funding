import React, {Component} from 'react';
import {factoryContractInstance, fundingContractInstance} from '../eth/instance'
import {getFundingDetail, handleInvestFunc} from '../eth/interaction'
import web3 from '../utils/InitWeb3'
import CardList from './common/CardList'
import {Dimmer, Form, Label, Loader, Segment} from 'semantic-ui-react'

class AllFundingTab extends Component {

    state = {
        allFundingDetail : [],
        active : false,
        currentFundingDetail : ''
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

    // 回调函数，点击每一个Card时候自动调用
    onCardClick = (currentFundingDetail) => {

        this.setState({
            currentFundingDetail
        })

    }

    handleInvest = async () => {
        // 对detail进行解构
        let detail = this.state.currentFundingDetail
        const {fundingAddress, manager, projectName, targetMoney, supportMoney, leftTime, balance, investorCount} = detail
        this.setState({active : true})
        try {
            // 调用方法发起参与
            await handleInvestFunc(fundingAddress, supportMoney)
            alert('参与成功')
        } catch (e) {
            console.log(e)
        }
        this.setState({active : false})
    }

    render() {
        let detail = this.state.currentFundingDetail
        let {fundingAddress, manager, projectName, targetMoney, supportMoney, leftTime, balance, investorCount} = detail
        return (
            <div>
                <CardList details={this.state.allFundingDetail} onCardClick={this.onCardClick}/>
                <Dimmer.Dimmable as={Segment} dimmed={this.state.active}>
                    <Dimmer active={this.state.active} inverted>
                        <Loader>支持中</Loader>
                    </Dimmer>
                    <Form onSubmit={this.handleInvest}>
                        <Form.Input type='text' value={projectName || ''} label='项目名称:'/>
                        <Form.Input type='text' value={fundingAddress || ''} label='项目地址:'/>
                        <Form.Input type='text' value={supportMoney || ''} label='支持金额:'
                                    labelPosition='left'>
                            <Label basic>￥</Label>
                            <input/>
                        </Form.Input>

                        <Form.Button primary content='参与众筹'/>
                    </Form>
                </Dimmer.Dimmable>
            </div>
        )
    }
}

export default AllFundingTab