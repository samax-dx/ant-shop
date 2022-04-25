import './App.less';

import { useActor } from '@xstate/react';

import { AppLayout } from "./components/AppLayout";
import { Home } from './components/Home';
import { Product } from './components/Product';
import { Partner } from './components/Partner';
import { Category } from './components/Category';
import { Rateplan } from './components/Rateplan';
import { PaymentList } from './components/PaymentList';
import { Login } from './components/Login';
import { capitalize } from "./Util.js"
import { Parties } from './components/Parties';
import { Payments } from './components/Payments';
import { Prefix } from './components/Prefix';
import { DialPlan } from './components/DialPlan';
import { Route } from './components/Route';
import { Package } from './components/Package';


export const App = ({ actor }) => {
    const [current, send] = useActor(actor);
    const component = capitalize(current.value);

    return (
        <AppLayout render={{ Home, Product, Category, Partner, Rateplan, Parties, Payments, PaymentList, Prefix, Route, DialPlan, Package, Login }[component]} actor={actor} />
    );
};
