import './App.less';

import { AppLayout } from "./components/AppLayout";
import { Home } from './components/Home';
import { Product } from './components/Product';
import { Partner } from './components/Partner';
import { Category } from './components/Category';
import { Rateplan } from './components/Rateplan';
import { Party } from './components/Party';

import { useActor } from '@xstate/react';
import { menuMachine } from './machines/menuMachine';

import { capitalize } from "./util"


const App = () => {
    const [current, send] = useActor(menuMachine);
    const component = capitalize(current.value);

    return (
        <AppLayout render={{ Home, Product, Category, Partner, Rateplan, Party }[component]} />
    );
};
export default App;