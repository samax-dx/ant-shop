import './App.less';

import { PageLayout } from "./components/PageLayout";
import { Home } from './components/Home';
import { Product } from './components/Product';
import { Partner } from './components/Partner';
import { Category } from './components/Category';

import { useActor } from '@xstate/react';
import { menuMachine } from './machines/menuMachine';

import { capitalize } from "./util"


const App = () => {
    const [current, send] = useActor(menuMachine);
    const component = capitalize(current.value);

    return (
        <PageLayout render={{ Home, Product, Partner, Category }[component]} />
    );
};
export default App;