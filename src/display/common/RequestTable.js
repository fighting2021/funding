import React from 'react'
import { Icon, Label, Menu, Table, Button } from 'semantic-ui-react'

const RequestTable = (props) => {
    let {requests, handleApprove, tabNo, handleFinalizeRequest, investorCount} = props
    // 遍历requestDetails，每一个RequestDetail都生成一个Table.Row。
    let rows = requests.map((request, i) => {
        return <RowInfo key={i} request={request} handleApprove={handleApprove} index={i} tabNo={tabNo} handleFinalizeRequest={handleFinalizeRequest} investorCount={investorCount} />
    })
    return (
        <Table celled>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>花费描述</Table.HeaderCell>
                    <Table.HeaderCell>花费金额</Table.HeaderCell>
                    <Table.HeaderCell>商家地址</Table.HeaderCell>
                    <Table.HeaderCell>当前赞成人数/参与人数</Table.HeaderCell>
                    <Table.HeaderCell>当前状态</Table.HeaderCell>
                    <Table.HeaderCell>操作</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {
                    rows
                }
            </Table.Body>
        </Table>
    )
}

let RowInfo = (props) => {
    let {request, handleApprove, index, tabNo, handleFinalizeRequest, investorCount} = props
    let {0:purpose, 1:cost, 2:seller, 3:approveCount, 4:status} = request

    let statusInfo = ''
    if (status == '0') {
        statusInfo = '投票中'
    } else if (status == '1') {
        statusInfo = '已投票'
    } else if (status == '2') {
        statusInfo = '已结束'
    }

    console.log("tabNo = ", tabNo)

    return (
        <Table.Row>
            <Table.Cell>
                <Label ribbon>{purpose}</Label>
            </Table.Cell>
            <Table.Cell>{cost}</Table.Cell>
            <Table.Cell>{seller}</Table.Cell>
            <Table.Cell>{approveCount}/{investorCount}</Table.Cell>
            <Table.Cell>{statusInfo}</Table.Cell>
            <Table.Cell>
                {
                    // 根据tabNo显示不同按钮
                    tabNo == 2 ?  <Button onClick={() => handleFinalizeRequest(index)}>支付</Button> : <Button onClick={() => handleApprove(index)}>批准</Button>
                }
            </Table.Cell>
        </Table.Row>
    )
}
export default RequestTable
