import React from 'react';

import PageLayout from "./Page";
import { Home } from './components/Home';
import { Product } from './components/Product';
import { Category } from './components/Category';

import { useActor } from '@xstate/react';
import { menuMachine } from './machines/menuMachine';

import './App.less';

function App() {
    const [current, send] = useActor(menuMachine);

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
