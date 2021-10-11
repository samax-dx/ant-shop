import React from 'react';

import PageLayout from "./Page";
import { Home } from './components/Home';
import { Product } from './components/Product';
import { Category } from './components/Category';

import { useMachine } from '@xstate/react';
import { MenuMachine } from './machines/MenuMachine';

import './App.less';

function App() {
    const [current, send] = useMachine(MenuMachine);

    let componentToRender = null;

    switch (current.value) {
        case "home":
            componentToRender = Home;
            break;
        case "product":
            componentToRender = Product;
            break;
        case "category":
            componentToRender = Category;
            break;
        default:
            break;
    }

    return (
        <PageLayout render={componentToRender} />
    );
}

export default App;
