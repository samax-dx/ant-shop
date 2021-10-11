import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import { Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
// import { useMachine } from '@xstate/react';
// import { MenuMachine } from './machines/MenuMachine';

const { SubMenu } = Menu;
const { Header, Sider } = Layout;

function PageLayout({ render: PageContent/*|renderWithState|renderables*/ }) {
    const [menu, setMenu] = useState("home");
    // const [menuState, sendMenuEvent] = useMachine(MenuMachine);

    return <Layout>
        <Header className="header">
            <div className="logo"/>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["home"]} onClick={ev => setMenu(ev.key)}>
                <Menu.Item key="home" /*onClick={_ => sendMenuEvent({ type: "SHOW_HOME" })}*/>Home</Menu.Item>
                <Menu.Item key="product" /*onClick={_ => sendMenuEvent({ type: "SHOW_PRODUCT" })}*/>Products</Menu.Item>
                <Menu.Item key="category" /*onClick={_ => sendMenuEvent({ type: "SHOW_CATEGORY" })}*/>Categories</Menu.Item>
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
                { PageContent }
                {/* { renderWithState({ menu: { current: menu } }) } */}
                {/* { renderWithState({ menu: { current: menuState } }) } */}
                {/* { renderables.find(([key]) => menuState.matches(key))[1]() } */}
            </Layout>
        </Layout>
    </Layout>;
}

export default PageLayout;
