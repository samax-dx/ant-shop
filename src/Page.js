import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import { Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;
const { Header, Sider } = Layout;

function PageLayout({ render: renderWithState }) {
    const [menu, setMenu] = useState("home");

    return <Layout>
        <Header className="header">
            <div className="logo"/>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]} onClick={ev => setMenu(ev.key)}>
                <Menu.Item key="home">Home</Menu.Item>
                <Menu.Item key="product">Products</Menu.Item>
                <Menu.Item key="category">Categories</Menu.Item>
            </Menu>
        </Header>
        <Layout>
            <Sider width={200} className="site-layout-background">
                <Menu
                    mode="inline"
                    defaultSelectedKeys={["1"]}
                    defaultOpenKeys={["sub1"]}
                    style={{height: "100%", borderRight: 0}}
                >
                    <SubMenu key="sub1" icon={<UserOutlined/>} title="subnav 1">
                        <Menu.Item key="1">option1</Menu.Item>
                        <Menu.Item key="2">option2</Menu.Item>
                        <Menu.Item key="3">option3</Menu.Item>
                        <Menu.Item key="4">option4</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" icon={<LaptopOutlined/>} title="subnav 2">
                        <Menu.Item key="5">option5</Menu.Item>
                        <Menu.Item key="6">option6</Menu.Item>
                        <Menu.Item key="7">option7</Menu.Item>
                        <Menu.Item key="8">option8</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub3" icon={<NotificationOutlined/>} title="subnav 3">
                        <Menu.Item key="9">option9</Menu.Item>
                        <Menu.Item key="10">option10</Menu.Item>
                        <Menu.Item key="11">option11</Menu.Item>
                        <Menu.Item key="12">option12</Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
            <Layout style={{padding: "0 24px 24px"}}>
                <Breadcrumb style={{margin: "16px 0"}}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>List</Breadcrumb.Item>
                    <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
                { renderWithState({ menu: { current: menu } }) }
            </Layout>
        </Layout>
    </Layout>;
}

export default PageLayout;
