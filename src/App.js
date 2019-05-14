import React, {Component} from 'react';
import web3 from './utils/InitWeb3'
import TabCenter from './display/TabCenter'
import {contractInstance} from "./eth/instance";

class App extends Component {
    constructor() {
        super()
        this.state = {
            currentAccount: '',
        }
    }

    async componentWillMount() {
        // 获取合约的所有账户
        let accounts = await web3.eth.getAccounts()
        console.log("current account : ", accounts[0])
        // console.log("currentAccount : ", accounts[0])
        // 获取平台管理员
        // let platformManager = contractInstance.methods.platformManager().call()
        // console.log('platformManager : ', platformManager)


        this.setState({
            currentAccount: accounts[0],
        })
    }

    render() {
        return (
            <div>
                <h1>人人众筹</h1>
                <p>当前账户：{this.state.currentAccount}</p>
                <TabCenter/>
            </div>
        )
    }

}

export default App;
