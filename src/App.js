import React from 'react';
import { Layout, Breadcrumb } from 'antd';
import './App.less';
import MainMenu from './MainMenu';
import { CategoryList } from './CategoryList';
import PageLayout from "./Page";
const { Header, Footer, Sider, Content } = Layout;

const PageContent = props => {
    return (
        <Content
            className="site-layout-background"
            style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
            }}
        >Content</Content>
    );
}
function App() {
    return (
        <PageLayout render={<PageContent/>} />
    );
}

export default App;
