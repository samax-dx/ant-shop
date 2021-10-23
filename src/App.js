import React from 'react';

import PageLayout from "./Page";
import { Home } from './components/Home';
import { Product } from './components/Product';
import { Partner } from './components/Partner';
import { Category } from './components/Category';

import { useActor } from '@xstate/react';
import { menuMachine } from './machines/menuMachine';

import { capitalize } from "./util"

import './App.less';

function App() {
    const [current, send] = useActor(menuMachine);

    const componentToRender = { Home, Product, Partner, Category }[capitalize(current.value)];

    return (
        <PageLayout render={componentToRender} />
    );
}

export default App;
