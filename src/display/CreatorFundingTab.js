import React, {Component} from 'react';
import {contractInstance} from '../eth/instance'
import web3 from '../utils/InitWeb3'

class CreatorFundingTab extends Component {

    state = {
        creatorFundings : [],
    }

    async componentWillMount() {
        let accounts = await web3.eth.getAccounts()
        let creatorFundings = await contractInstance.methods.getCreatorFunding().call({
            from : accounts[0]
        })
        this.setState({
            creatorFundings
        })
    }

    render() {
        return (
            <p>{this.state.creatorFundings}</p>
        )
    }
}

export default CreatorFundingTab