import React from 'react';
import { Menu } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;

export const MainMenu = () => {
    return (
        <Menu
            mode="inline"
            defaultOpenKeys={["sub1"]}
            style={{ height: "100%", borderRight: 0 }}
        >
            <SubMenu key="sub1" icon={<UserOutlined />} title="Cofiguration">
                <Menu.Item key="1">Partners</Menu.Item>
                <Menu.Item key="2">Account Details</Menu.Item>
                <Menu.Item key="3">Route Import</Menu.Item>
                <Menu.Item key="4">Bridge Routes</Menu.Item>
                <Menu.Item key="5">Rate Plan</Menu.Item>
                <Menu.Item key="6">Rate Plan Assignment</Menu.Item>
                <Menu.Item key="7">Rates</Menu.Item>
                <Menu.Item key="8">LCR</Menu.Item>
                <Menu.Item key="9">View Routes</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<LaptopOutlined />} title="Billing">
            </SubMenu>
            <SubMenu key="sub3" icon={<NotificationOutlined />} title="Reports">
            </SubMenu>
            <SubMenu key="sub4" icon={<NotificationOutlined />} title="Mediation">
            </SubMenu>
            <SubMenu key="sub5" icon={<NotificationOutlined />} title="Settings">
            </SubMenu>
        </Menu>
    );
};

