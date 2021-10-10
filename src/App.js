import { Layout, Breadcrumb } from 'antd';
import './App.less';

import { CategoryList } from './CategoryList';

const { Header, Footer, Sider, Content } = Layout;


function App() {
    return (
        /*<Layout>
            <Header></Header>
            <Layout style={{ margin: "15px auto" }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item><button className="App-home-link">Home</button></Breadcrumb.Item>
                </Breadcrumb>
                <Content
                    style={{
                        backgroundColor: "#fff",
                        minWidth: "50vw",
                        minHeight: "40vh"
                    }}
                    children={<CategoryList />}
                />
            </Layout>
            <Footer></Footer>
        </Layout>*/
        <Layout>
            <Sider>Sider</Sider>
            <Layout>
                <Header>Header</Header>
                <Content>Content</Content>
                <Footer>Footer</Footer>
            </Layout>
        </Layout>
    );
}

export default App;
