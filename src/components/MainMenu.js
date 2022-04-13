import React from 'react';
import { useActor } from '@xstate/react';
import { Menu } from 'antd';

import { UserOutlined, LaptopOutlined, NotificationOutlined, ProfileOutlined, DollarOutlined, BankOutlined } from '@ant-design/icons';

export const MainMenu = ({ actor }) => {
    const [appState, sendApp] = useActor(actor);

    return (
        <Menu
            mode="inline"
            defaultOpenKeys={["accounting"]}
            style={{ height: "100%", borderRight: 0 }}
            selectedKeys={[appState.value]}
        >
            <Menu.SubMenu key="accounting" icon={<BankOutlined />} title="Accounting">
                <Menu.Item key="payments" onClick={() => sendApp({ type: "NAV_PAYMENTS" })}>TopUp / Payments</Menu.Item>
                {/* <Menu.Item key="paymentList" onClick={() => sendApp({ type: "NAV_PAYMENT_LIST" })}>Payment Applications</Menu.Item> */}
            </Menu.SubMenu>
            <Menu.SubMenu key="partymenu" icon={<ProfileOutlined />} title="Party Management">
                <Menu.Item key="parties" onClick={() => sendApp({ type: 'NAV_PARTIES' })}>Parties</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="sub5" icon={<UserOutlined />} title="Settings" disabled>
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
