import React, {Component} from 'react';
import {contractInstance} from "../eth/instance";

class SupportorFundingTab extends Component {

    state = {
        supportFundings : [],
    }

    async componentWillMount() {
        let supportFundings = await contractInstance.methods.getSupportorFunding().call()
        this.setState({
            supportFundings
        })
    }

    render() {
        return (
            <p>{this.state.supportFundings}</p>
        )
    }
}

export default SupportorFundingTab