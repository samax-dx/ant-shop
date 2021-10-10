import React from 'react';
import { Layout, Breadcrumb } from 'antd';
import './App.less';
import MainMenu from './MainMenu';
import { CategoryList } from './CategoryList';
import PageLayout from "./Page";
const { Header, Footer, Sider, Content } = Layout;


function App() {
    return (
        <PageLayout/>

    );
}

export default App;
