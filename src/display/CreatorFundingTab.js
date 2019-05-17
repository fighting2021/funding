import React, {Component} from 'react';
import {factoryContractInstance, fundingContractInstance} from '../eth/instance'
import {getFundingDetail, createRequest, showRequests, finalizeRequest} from '../eth/interaction'
import web3 from '../utils/InitWeb3'
import CardList from './common/CardList'
import CreateFundingForm from './CreateFundingForm'
import {Segment, Form, Label, Button} from 'semantic-ui-react'
import RequestTable from './common/RequestTable'

class CreatorFundingTab extends Component {

    state = {
        creatorFundingDetail : [],
        currentFundingDetail : '',
        requestDesc : '', // 请求目的
        requestBalance : '', // 请求金额
        requestAddress : '', // 商家地址
        requests : [], // 请求详情
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

    // 回调函数，点击每一个Card时候自动调用
    onCardClick = (currentFundingDetail) => {
        this.setState({
            currentFundingDetail
        })
    }

    // 回调函数，表单数据数据变化时触发
    handleChange = (e, {name, value}) => this.setState({[name]: value})

    // 该函数提交表单触发
    handleCreate = async () => {
        let {creatorFundingDetail, currentFundingDetail, requestDesc, requestBalance, requestAddress} = this.state
        // createRequest(fundingAddress, desc, targetMoney, seller)
        try {
            await createRequest(currentFundingDetail.fundingAddress, requestDesc, requestBalance,requestAddress )
        } catch (e) {
            console.log(e)
        }
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

    // 结束申请
    handleFinalizeRequest = (index) => {
        try {
            let {fundingAddress} = this.state.currentFundingDetail
            finalizeRequest(fundingAddress, index)
        } catch (e) {
            console.log(e)
        }
    }

    render() {
        let {creatorFundingDetail, currentFundingDetail, requestDesc, requestBalance, requestAddress, requests} = this.state

        return (
            <div>
                <CardList details={creatorFundingDetail} onCardClick={this.onCardClick}/>
                <CreateFundingForm/>
                {
                    <div>
                        <h3>发起付款请求</h3>
                        <Segment>
                            <h4>当前项目:{currentFundingDetail.projectName}, 地址: {currentFundingDetail.fundingAddress}</h4>
                            <Form onSubmit={this.handleCreate}>
                                <Form.Input type='text' name='requestDesc' required value={requestDesc}
                                            label='请求描述' placeholder='请求描述' onChange={this.handleChange}/>

                                <Form.Input type='text' name='requestBalance' required value={requestBalance}
                                            label='付款金额' labelPosition='left' placeholder='付款金额'
                                            onChange={this.handleChange}>
                                    <Label basic>￥</Label>
                                    <input/>
                                </Form.Input>

                                <Form.Input type='text' name='requestAddress' required value={requestAddress}
                                            label='商家收款地址' labelPosition='left' placeholder='商家地址'
                                            onChange={this.handleChange}>
                                    <Label basic><span role='img' aria-label='location'>📍</span></Label>
                                    <input/>
                                </Form.Input>

                                <Form.Button primary content='开始请求'/>
                            </Form>
                        </Segment>
                    </div>
                }
                {
                    // 如果currentFundingDetail为空，代表用户还没点击Card，所以不会显示后面的div
                    // 如果currentFundingDetail不为空，代表用户已经点击Card，所以就会输出div
                    currentFundingDetail && <div>
                        <Button onClick={this.onRequestDetailClick}>申请详情</Button>
                        <RequestTable requests={requests} tabNo={2}  handleFinalizeRequest={this.handleFinalizeRequest} investorCount={currentFundingDetail.investorCount}/>
                    </div>
                }
            </div>
        )
    }
}

export default CreatorFundingTab