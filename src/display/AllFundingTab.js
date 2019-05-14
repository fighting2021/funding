import React, {Component} from 'react';
import {contractInstance} from "../eth/instance";

class AllFundingTab extends Component {

    state = {
        allFundings : [],
    }

    async componentWillMount() {
        let allFundings = await contractInstance.methods.getAllFundings().call()
        this.setState({
            allFundings
        })
    }

    render() {
        return (
            <p>{this.state.allFundings}</p>
        )
    }
}

export default AllFundingTab