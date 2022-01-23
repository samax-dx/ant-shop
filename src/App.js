import './App.less';

import { useActor } from '@xstate/react';

import { AppLayout } from "./components/AppLayout";
import { Home } from './components/Home';
import { Product } from './components/Product';
import { Partner } from './components/Partner';
import { Category } from './components/Category';
import { Rateplan } from './components/Rateplan';
import { Party } from './components/Party';
import { capitalize } from "./util"


export const App = ({ actor }) => {
    const [current, send] = useActor(actor);
    const component = capitalize(current.value);

    return (
        <AppLayout render={{ Home, Product, Category, Partner, Rateplan, Party }[component]} actor={actor} />
    );
};
