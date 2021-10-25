import React from 'react';
import { Col, Row, Layout, Breadcrumb } from 'antd';

import { TopMenu } from "./TopMenu";
import { MainMenu } from './MainMenu';

const { Header, Sider } = Layout;


export const AppLayout = ({ render: PageContent }) => {
    return <Layout>
        <Header className="header">
            <Row>
                <Col xs={10} sm={4} className="logo">SMS Portal</Col>
                <Col xs={14} sm={20}><TopMenu /></Col>
            </Row>
        </Header>
        <Layout>
            <Sider width={240} className="site-layout-background">
                <MainMenu />
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
