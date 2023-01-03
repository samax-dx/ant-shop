import React, {useRef} from 'react';
import { Col, Row, Layout, Breadcrumb, Space, Button,Avatar } from 'antd';
import { TopMenu } from "./TopMenu";
import { MainMenu } from './MainMenu';
import getAllConfig from '../config/main';
import {Link} from "react-router-dom";

const { Header, Sider } = Layout;


export const AppLayout = ({ render: PageContent, actor, routeComponent }) => {
    const [appState, sendApp] = [actor.getSnapshot(), actor.send];

    return <Layout>
        {appState.matches("login") || <Header className="header" style={{paddingLeft:'7px', paddingRight:'5px'}}>
            <Row style={{marginBottom:10}}>
                <Col xs={10} sm={12} className="logo">
                    <Link to='/'><img src={getAllConfig.logo}/></Link>
                    &nbsp;
                    <Link to='/' style={{color:"white"}}>SMS-Portal Admin</Link>
                </Col>
                <Col xs={14} sm={12} className="menu"><TopMenu actor={actor} /></Col>
            </Row>
        </Header>}
        <Layout>
            {appState.matches("login") || <Sider width={240} className="site-layout-background">
                <MainMenu actor={actor} />
            </Sider>}
            <Layout style={{ padding: "2px" }}>
                <PageContent actor={appState.context.actor} />
                {routeComponent}
            </Layout>
        </Layout>
    </Layout>;
};
