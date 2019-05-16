import React, {Component} from 'react';
import {Dimmer, Form, Label, Loader, Segment} from 'semantic-ui-react'
import {createFunding} from "../eth/interaction";

class CreateFundingForm extends Component {
    // 定义状态变量
    state = {
        active: false,
        projectName: '',
        supportMoney: '',
        targetMoney: '',
        duration: '',
    }

    // 回调函数，表单数据数据变化时触发
    handleChange = (e, {name, value}) => this.setState({[name]: value})

    // 该函数提交表单触发
    handleCreate = async () => {
        // 把状态变量的数据解构出来
        let {active, projectName, targetMoney, supportMoney, duration} = this.state
        //  显示遮挡层
        this.setState({active: true})

        // 通过web3创建合约
        try {
            let res = await createFunding(projectName, targetMoney, supportMoney, duration)
            alert(`创建合约成功!\n`)
        } catch (e) {
            console.log(e)
        }
        // 隐藏遮挡层
        this.setState({active: false})
    }

    render() {
        let {active, projectName, targetMoney, supportMoney, duration} = this.state

        return (
            <div>
                <Dimmer.Dimmable as={Segment} dimmed={active}>
                    <Dimmer active={active} inverted>
                        <Loader>Loading</Loader>
                    </Dimmer>
                    <Form onSubmit={this.handleCreate}>
                        <Form.Input required type='text' placeholder='项目名称' name='projectName'
                                    value={projectName} label='项目名称:'
                                    onChange={this.handleChange}/>

                        <Form.Input required type='text' placeholder='支持金额' name='supportMoney'
                                    value={supportMoney} label='支持金额:'
                                    labelPosition='left'
                                    onChange={this.handleChange}>
                            <Label basic>￥</Label>
                            <input/>
                        </Form.Input>

                        <Form.Input required type='text' placeholder='目标金额' name='targetMoney' value={targetMoney}
                                    label='目标金额:'
                                    labelPosition='left'
                                    onChange={this.handleChange}>
                            <Label basic>￥</Label>
                            <input/>
                        </Form.Input>
                        <Form.Input required type='text' placeholder='众筹时间' name='duration' value={duration}
                                    label='众筹时间:'
                                    labelPosition='left'
                                    onChange={this.handleChange}>
                            <Label basic>S</Label>
                            <input/>
                        </Form.Input>
                        <Form.Button primary content='创建众筹'/>
                    </Form>
                </Dimmer.Dimmable>
            </div>
        )
    }
}

export default CreateFundingForm
