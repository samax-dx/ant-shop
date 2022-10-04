import React from 'react';
import { useActor } from '@xstate/react';
import { Menu } from 'antd';

import {
    UserOutlined,
    SettingOutlined,
    ProfileOutlined,
    BankOutlined,
    WalletTwoTone,
    IdcardTwoTone,
    InteractionTwoTone,
    IdcardOutlined
} from '@ant-design/icons';
import {Link} from "react-router-dom";

export const MainMenu = ({ actor }) => {
    const [appState, sendApp] = [actor.getSnapshot(), actor.send];

    return (
        <Menu
            mode="inline"
            defaultOpenKeys={["accounting"]}
            style={{ height: "100%", borderRight: 0 }}
            selectedKeys={[appState.value]}
        >
            <Menu.SubMenu key="accounting" icon={<BankOutlined />} title="Accounting">
                <Menu.Item key="payments" icon={<WalletTwoTone />} onClick={() => sendApp({ type: "NAV_PAYMENTS" })}>TopUp / Payments</Menu.Item>
                {/* <Menu.Item key="paymentList" onClick={() => sendApp({ type: "NAV_PAYMENT_LIST" })}>Payment Applications</Menu.Item> */}
            </Menu.SubMenu>
            {/*<Menu.Item><Link to="/send">Send</Link></Menu.Item>*/}
            <Menu.SubMenu key="partymenu" icon={<ProfileOutlined />} title="Party Management">
                <Menu.Item key="parties" icon={<IdcardTwoTone />} onClick={() => sendApp({ type: 'NAV_PARTIES' })}>Parties</Menu.Item>
                <Menu.Item key="senderIdManager" icon={<IdcardOutlined />} onClick={() => sendApp({ type: 'NAV_SENDER_ID_MANAGER' })}>Serder-ID</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="settings" icon={<SettingOutlined />} title="Settings">
                <Menu.Item key="prefix" icon={<InteractionTwoTone />} onClick={() => sendApp({ type: 'NAV_PREFIX' })}>Prefix</Menu.Item>
                <Menu.Item key="route" icon={<InteractionTwoTone />} onClick={() => sendApp({ type: 'NAV_ROUTE' })}>Route</Menu.Item>
                <Menu.Item key="dialPlan" icon={<InteractionTwoTone />} onClick={() => sendApp({ type: 'NAV_DIAL_PLAN' })}>Dial Plan</Menu.Item>
                <Menu.Item key="package" icon={<InteractionTwoTone />} onClick={() => sendApp({ type: 'NAV_PACKAGE' })}>Package Prefix</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="sub5" icon={<UserOutlined />} title="..." disabled>
                <Menu.Item key="partners">Partners</Menu.Item>
                <Menu.Item key="accounts">Account Details</Menu.Item>
                <Menu.Item key="importroutes">Import Routes</Menu.Item>
                <Menu.Item key="bridgeroutes">Bridge Routes</Menu.Item>
                <Menu.Item key="viewroutes">View Routes</Menu.Item>
                <Menu.Item key="rateplan" onClick={() => sendApp({ type: 'NAV_RATEPLAN' })}>Rate Plan</Menu.Item>
                <Menu.Item key="rates">Rates</Menu.Item>
                <Menu.Item key="lcr">LCR</Menu.Item>
            </Menu.SubMenu>
        </Menu>
    );
};
