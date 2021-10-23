import React, { useState } from 'react';
import { Breadcrumb, Col, Layout, Menu, Row } from 'antd';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';

import 'antd/dist/antd.css';
import './index.css';

import { TopMenu } from "./TopMenu";

const { SubMenu } = Menu;
const { Header, Sider } = Layout;

function PageLayout({ render: PageContent }) {
    return <Layout>
        <Header className="header">
            <Row>
                <Col xs={10} sm={4} className="logo">SMS Portal</Col>
                <Col xs={14} sm={20}><TopMenu /></Col>
            </Row>
        </Header>
        <Layout>
            <Sider width={200} className="site-layout-background">
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
            </Sider>
            <Layout style={{ padding: "0 24px 24px" }}>
                {/* <Breadcrumb style={{ margin: "16px 0" }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>List</Breadcrumb.Item>
                    <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb> */}
                <PageContent />
            </Layout>
        </Layout>
    </Layout>;
}

export default PageLayout;
