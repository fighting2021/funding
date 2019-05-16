import React from 'react'
import {Card, Image, Icon, List, Progress} from 'semantic-ui-react'

const src = '/images/elliot.jpg'

const CardList = (props) => {
    // 遍历众筹合约
    let details = props.details
    let cards = details.map(detail => {
        // 获取合约信息，并且设置到Card组件中
        return <CardExampleCard key={detail.fundingAddress} detail={detail}/>
    })
    return (
        <Card.Group itemsPerRow={4}>
            {cards}
        </Card.Group>
    )
}

const CardExampleCard = (props) => {
    // 解构出props.detail中的数据
    let detail = props.detail
    const {contractAddress, manager, projectName, targetMoney, supportMoney, leftTime, balance, investorCount} = detail;
    // 计算已筹金额的百分比
    let percentage = (parseFloat(balance) / parseFloat(targetMoney)).toFixed(2) * 100
    // 把balance单位转换成eth
    let accountBalance = parseFloat(balance) / 10**18
    return (
        <div>
            <Card>
                <Image src='/images/elliot.jpg'/>
                <Card.Content>
                    <Card.Header>{projectName}</Card.Header>
                    <Card.Meta>
                        <span>剩余时间:{leftTime}秒</span>
                        <Progress indicating percent={percentage} size='small' progress/>
                    </Card.Meta>
                    <Card.Description>不容错过</Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <List divided horizontal style={{display: 'flex', justifyContent: 'space-around'}}>
                        <List.Item>
                            <List.Content>
                                <List.Header>已筹</List.Header>
                                <List.Description>{accountBalance}eth</List.Description>
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Content>
                                <List.Header>已达</List.Header>
                                <List.Description>{percentage}%</List.Description>
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Content>
                                <List.Header>参与人数</List.Header>
                                <List.Description>{investorCount}人</List.Description>
                            </List.Content>
                        </List.Item>
                    </List>
                </Card.Content>
            </Card>
        </div>
    )
}

export default CardList