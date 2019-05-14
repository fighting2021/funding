import React from 'react'
import { Tab } from 'semantic-ui-react'
import AllFundingTab from "./AllFundingTab";
import SupportorFundingTab from "./SupportorFundingTab";
import CreatorFundingTab from "./CreatorFundingTab";

const panes = [
    { menuItem: '所有的', render: () => <Tab.Pane><AllFundingTab/></Tab.Pane> },
    { menuItem: '我发起的', render: () => <Tab.Pane><CreatorFundingTab/></Tab.Pane> },
    { menuItem: '我参与的', render: () => <Tab.Pane><SupportorFundingTab/></Tab.Pane> },
]

const TabCenter = () => <Tab panes={panes} />

export default TabCenter