import React from 'react';
import { useActor } from '@xstate/react';
import { Menu } from 'antd';

import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';

export const MainMenu = ({ actor }) => {
    const [appState, sendApp] = useActor(actor);

    return (
        <Menu
            mode="inline"
            defaultOpenKeys={["sub1"]}
            style={{ height: "100%", borderRight: 0 }}
        >
            <Menu.SubMenu key="sub1" icon={<UserOutlined />} title="Cofiguration">
                <Menu.Item key="partners">Partners</Menu.Item>
                <Menu.Item key="accounts">Account Details</Menu.Item>
                <Menu.Item key="importroutes">Import Routes</Menu.Item>
                <Menu.Item key="bridgeroutes">Bridge Routes</Menu.Item>
                <Menu.Item key="viewroutes">View Routes</Menu.Item>
                <Menu.Item key="rateplan" onClick={() => sendApp({ type: 'NAV_RATEPLAN' })}>Rate Plan</Menu.Item>
                <Menu.Item key="rates">Rates</Menu.Item>
                <Menu.Item key="lcr">LCR</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="sub2" icon={<LaptopOutlined />} title="Billing">
            </Menu.SubMenu>
            <Menu.SubMenu key="sub3" icon={<NotificationOutlined />} title="Reports">
            </Menu.SubMenu>
            <Menu.SubMenu key="sub4" icon={<NotificationOutlined />} title="Mediation">
            </Menu.SubMenu>
            <Menu.SubMenu key="sub5" icon={<NotificationOutlined />} title="Settings">
            </Menu.SubMenu>
        </Menu>
    );
};

