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
import {SenderIdManager} from "./components/SenderIdManager";
import { BrowserRouter as Router, Route as ReactRoute } from "react-router-dom";
import {Fragment, useRef, useState} from "react";
import {Topup} from "./components/Topup";
import {NewPrefix} from "./components/NewPrefix";
import {NewRoute} from "./components/NewRoute";
import {NewDialPlan} from "./components/NewDialPlan";
import {NewPackage} from "./components/NewPackage";

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
                <ReactRoute path="/sender" element={createRouteComponent(<SenderIdManager />)} />
                <ReactRoute path="/payment" element={createRouteComponent(<Topup />)} />
                <ReactRoute path="/prefix" element={createRouteComponent(<NewPrefix />)} />
                <ReactRoute path="/route" element={createRouteComponent(<NewRoute />)} />
                <ReactRoute path="/dialplan" element={createRouteComponent(<NewDialPlan />)} />
                <ReactRoute path="/package-prefix" element={createRouteComponent(<NewPackage />)} />
            </Routes>
        </BrowserRouter>
    </>);
};
