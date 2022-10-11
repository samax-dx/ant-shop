import * as React from "react";
import {BrowserRouter,Routes} from "react-router-dom";
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
import { Route } from "./components/Route";
import { DialPlan } from './components/DialPlan';
import { Package } from './components/Package';
import { BrowserRouter as Router, Route as ReactRoute } from "react-router-dom";
import {Topup} from "./components/Topup";
import {DialPlanNew} from "./components/DialPlanNew";
import {RouteNew} from "./components/RouteNew";
import {PrefixNew} from "./components/PrefixNew";
import {PackageNew} from "./components/PackageNew";
import {SenderId} from "./components/SenderId";
import {PartiesNew} from "./components/PartiesNew";

export const App = ({ actor }) => {
    const [current, send] = useActor(actor);
    const component = capitalize(current.value);

    const createRouteComponent = rc => <AppLayout
        render={{
            Home, Product, Category, Partner, Rateplan, Parties,
            Payments, PaymentList, Prefix, Route, DialPlan, Package, Login
        }[component]}
        actor={actor}
        routeComponent={rc}
    />;

    return (<>
        <BrowserRouter>
            <Routes>
                <ReactRoute path="/" element={createRouteComponent(null)} />
                <ReactRoute path="/PartyManagement/parties" element={createRouteComponent(<PartiesNew/>)} />
                <ReactRoute path="/PartyManagement/senderId" element={createRouteComponent(<SenderId />)} />
                <ReactRoute path="/Accounting/payment" element={createRouteComponent(<Topup />)} />
                <ReactRoute path="/Settings/prefix" element={createRouteComponent(<PrefixNew />)} />
                <ReactRoute path="/Settings/route" element={createRouteComponent(<RouteNew />)} />
                <ReactRoute path="/Settings/dialplan" element={createRouteComponent(<DialPlanNew />)} />
                <ReactRoute path="/Settings/packagePrefix" element={createRouteComponent(<PackageNew />)} />
            </Routes>
        </BrowserRouter>
    </>);
};
