import React from 'react';
import { Layout, Breadcrumb } from 'antd';
import './App.less';
import MainMenu from './MainMenu';
import { CategoryList } from './CategoryList';
import PageLayout from "./Page";
const { Header, Footer, Sider, Content } = Layout;

const PageContent = ({ menu }) => {console.log(menu);
    return (
        <Content
            className="site-layout-background"
            style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
            }}
        >
            {menu.current === "HOME" && "Home Page"}
            {menu.current === "PRODUCT" && "Product List"}
            {menu.current === "CATEGORY" && "Category List"}
        </Content>
    );
}
function App() {
    return (
        <PageLayout render={({ menu }) => <PageContent menu={menu} />} />
    );
}

export default App;
