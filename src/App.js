import React, { useEffect } from 'react';
import { Layout } from 'antd';
import PageLayout from "./Page";
import { useMachine } from '@xstate/react';
import { MenuMachine } from './machines/MenuMachine';

import './App.less';

const { Content } = Layout;

const PageContent = ({ menu }) => {
    const [menuState, sendMenuEvent] = useMachine(MenuMachine, {
        actions: {
            "activateMenu": (ctx, ev) => {
                ctx.data = {
                    home: "Home Page",
                    product: "Product List",
                    category: "Category List"
                }[ev.key];
            }
        }
    });

    useEffect(() => {
        sendMenuEvent({ type: "ACTIVATE", key: menu.current });
    }, [menu, sendMenuEvent]);

    return (
        <Content
            className="site-layout-background"
            style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
            }}
        >
            {menuState.context.data}
        </Content>
    );
}
function App() {
    return (
        <PageLayout render={({ menu }) => <PageContent menu={menu} />} />
    );
}

export default App;
