import React, { useEffect } from 'react';
import { Layout } from 'antd';
import PageLayout from "./Page";
import { useMachine } from '@xstate/react';
import { MenuMachine } from './machines/MenuMachine';

import { Home } from './components/Home';
import { Product } from './components/Product';
import { Category } from './components/Category';

import './App.less';

function App() {
    return (
        <PageLayout render={({ menu }) => {
            if (menu.current.matches("home")) return <Home />;
            if (menu.current.matches("product")) return <Product />;
            if (menu.current.matches("category")) return <Category />;
            return null;
        }} />
    );
}

// const { Content } = Layout;

// const PageContent = ({ menu }) => {
//     const [menuState, sendMenuEvent] = useMachine(MenuMachine, {
//         actions: {
//             "activateMenu": (ctx, ev) => {
//                 ctx.data = {
//                     home: props => <Home {...props} />,
//                     product: props => <Product {...props} />,
//                     category: props => <Category {...props} />
//                 }[ev.key];
//             }
//         }
//     });

//     useEffect(() => {
//         sendMenuEvent({ type: "ACTIVATE", key: menu.current });
//     }, [menu, sendMenuEvent]);

//     return (
//         <Content
//             className="site-layout-background"
//             style={{
//                 padding: 24,
//                 margin: 0,
//                 minHeight: 280,
//             }}
//         >
//             {menuState.context.data}
//         </Content>
//     );
// }

export default App;
