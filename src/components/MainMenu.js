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
import {Link, NavLink, useLocation } from "react-router-dom";

export const MainMenu = ({ actor }) => {
    const [appState, sendApp] = [actor.getSnapshot(), actor.send];
    const location = useLocation();
    const paths = location.pathname.split("/").slice(1);
    return (
        <Menu
            mode="inline"
            defaultOpenKeys={[paths[0]]}
            style={{ height: "100%", borderRight: 0 }}
            selectedKeys={[paths[1]]}
        >
            {/*<Menu.SubMenu key="accounting" icon={<BankOutlined />} title="Accounting">*/}
            {/*    <Menu.Item key="payments" icon={<WalletTwoTone />} onClick={() => sendApp({ type: "NAV_PAYMENTS" })}>TopUp / Payments</Menu.Item>*/}
            {/*    /!* <Menu.Item key="paymentList" onClick={() => sendApp({ type: "NAV_PAYMENT_LIST" })}>Payment Applications</Menu.Item> *!/*/}
            {/*</Menu.SubMenu>*/}
            {/*/!*<Menu.Item><Link to="/send">Send</Link></Menu.Item>*!/*/}
            {/*<Menu.SubMenu key="partymenu" icon={<ProfileOutlined />} title="Party Management">*/}
            {/*    <Menu.Item key="parties" icon={<IdcardTwoTone />} onClick={() => sendApp({ type: 'NAV_PARTIES' })}>Parties</Menu.Item>*/}
            {/*    <Menu.Item key="senderIdManager" icon={<IdcardOutlined />} onClick={() => sendApp({ type: 'NAV_SENDER_ID_MANAGER' })}>Serder-ID</Menu.Item>*/}
            {/*</Menu.SubMenu>*/}
            {/*<Menu.SubMenu key="settings" icon={<SettingOutlined />} title="Settings">*/}
            {/*    <Menu.Item key="prefix" icon={<InteractionTwoTone />} onClick={() => sendApp({ type: 'NAV_PREFIX' })}>Prefix</Menu.Item>*/}
            {/*    <Menu.Item key="route" icon={<InteractionTwoTone />} onClick={() => sendApp({ type: 'NAV_ROUTE' })}>Route</Menu.Item>*/}
            {/*    <Menu.Item key="dialPlan" icon={<InteractionTwoTone />} onClick={() => sendApp({ type: 'NAV_DIAL_PLAN' })}>Dial Plan</Menu.Item>*/}
            {/*</Menu.SubMenu>*/}
            {/*<Menu.SubMenu key="sub5" icon={<UserOutlined />} title="..." disabled>*/}
            {/*    <Menu.Item key="partners">Partners</Menu.Item>*/}
            {/*    <Menu.Item key="accounts">Account Details</Menu.Item>*/}
            {/*    <Menu.Item key="importroutes">Import Routes</Menu.Item>*/}
            {/*    <Menu.Item key="bridgeroutes">Bridge Routes</Menu.Item>*/}
            {/*    <Menu.Item key="viewroutes">View Routes</Menu.Item>*/}
            {/*    <Menu.Item key="rateplan" onClick={() => sendApp({ type: 'NAV_RATEPLAN' })}>Rate Plan</Menu.Item>*/}
            {/*    <Menu.Item key="rates">Rates</Menu.Item>*/}
            {/*    <Menu.Item key="lcr">LCR</Menu.Item>*/}
            {/*</Menu.SubMenu>*/}

        {/*    My Menu  */}
            <Menu.SubMenu key="Accounting" icon={<BankOutlined />} title="Accounting">
                <Menu.Item key="payment" icon={<WalletTwoTone/>}><NavLink to="/Accounting/payment" >TopUp / Payments</NavLink></Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="PartyManagement" icon={<ProfileOutlined />} title="Party Management">
                <Menu.Item key="parties" icon={<IdcardTwoTone />}><Link to="/PartyManagement/parties">Parties</Link></Menu.Item>
                <Menu.Item key="senderId" icon={<IdcardOutlined />}><Link to="/PartyManagement/senderId">Sender-ID</Link></Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="Package" icon={<SettingOutlined />} title="Package">
                <Menu.Item key="ratePlanAssignments" icon={<InteractionTwoTone />} ><Link to="/Package/ratePlanAssignments">Rate-Plan Assignment</Link></Menu.Item>
                <Menu.Item key="rateplans" icon={<InteractionTwoTone />} ><Link to="/Package/rateplans">Rate-Plan</Link></Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="Settings" icon={<SettingOutlined />} title="Settings">
                <Menu.Item key="prefix" icon={<InteractionTwoTone />} ><Link to="/Settings/prefix">Prefix</Link></Menu.Item>
                <Menu.Item key="route" icon={<InteractionTwoTone />}><Link to="/Settings/route">Route</Link></Menu.Item>
                <Menu.Item key="dialplan" icon={<InteractionTwoTone />} ><Link to="/Settings/dialplan">Dial Plan</Link></Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="sub5" icon={<UserOutlined />} title="..." disabled>
                <Menu.Item ><Link to="partners">Partners</Link></Menu.Item>
                <Menu.Item ><Link to="account-details">Account Details</Link></Menu.Item>
                <Menu.Item ><Link to="import-routes">Import Routes</Link></Menu.Item>
                <Menu.Item ><Link to="bridge-routes">Bridge Routes</Link></Menu.Item>
                <Menu.Item ><Link to="view-routes">View Routes</Link></Menu.Item>
                <Menu.Item ><Link to="rate-plan">Rate Plan</Link></Menu.Item>
                <Menu.Item ><Link to="rates">Rates</Link></Menu.Item>
                <Menu.Item ><Link to="lcr">LCR</Link></Menu.Item>
            </Menu.SubMenu>
        </Menu>
    );
};
