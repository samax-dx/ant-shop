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
import { BrowserRouter as Router, Route as ReactRoute } from "react-router-dom";
import {Topup} from "./components/Topup";
import {DialPlanNew} from "./components/DialPlanNew";
import {RouteNew} from "./components/RouteNew";
import {PrefixNew} from "./components/PrefixNew";
import {SenderId} from "./components/SenderId";
import {PartiesNew} from "./components/PartiesNew";
import {RatePlans} from "./components/RatePlans";
import {PackageRate} from "./components/PackageRate";
import {RatePlanAssignment} from "./components/RatePlanAssign";
import {SmsHistory} from "./components/SmsHistory";
import {HomeNew} from "./components/HomeNew";
import getAllConfig from "../src/config/main";
import {ForbiddenWords} from "./components/ForbiddenWords";
import {SmsRouteDetails} from "./components/SmsRouteDetails";
import {Reports} from "./components/Reports";

function setFavicon (){
    return document.getElementById("favicon");
}

export const App = ({ actor }) => {

    (function(){
        const favicon = setFavicon();
        favicon.href = getAllConfig.ficon;
    })();

    const [current, send] = useActor(actor);
    const component = capitalize(current.value);

    const createRouteComponent = rc => <AppLayout
        render={{
            Home, Product, Category, Partner, Rateplan, Parties,
            Payments, PaymentList, Prefix, Route, DialPlan, Login
        }[component]}
        actor={actor}
        routeComponent={rc}
    />;

    return (<>
        <BrowserRouter>
            <Routes>
                <ReactRoute path="/" element={createRouteComponent(<HomeNew/> )} />
                <ReactRoute path="/PartyManagement/parties" element={createRouteComponent(<PartiesNew/>)} />
                <ReactRoute path="/Accounting/payment" element={createRouteComponent(<Topup />)} />
                <ReactRoute path="/Package/rateplans" element={createRouteComponent(<RatePlans />)} />
                <ReactRoute path="/Package/ratePlanAssignments" element={createRouteComponent(<RatePlanAssignment />)} />
                <ReactRoute path="/Package/rates/:ratePlanId" element={createRouteComponent(<PackageRate />)} />
                <ReactRoute path="/Settings/prefix" element={createRouteComponent(<PrefixNew />)} />
                <ReactRoute path="/Settings/route" element={createRouteComponent(<RouteNew />)} />
                <ReactRoute path="/Settings/dialplan" element={createRouteComponent(<DialPlanNew />)} />
                <ReactRoute path="/Settings/senderId" element={createRouteComponent(<SenderId />)} />
                <ReactRoute path="/Settings/forbiddenWords" element={createRouteComponent(< ForbiddenWords/>)} />
                <ReactRoute path="/SmsTask/SmsHistory" element={createRouteComponent(<SmsHistory />)} />
                <ReactRoute path="/SmsTask/Reports" element={createRouteComponent(<Reports />)} />
            </Routes>
        </BrowserRouter>
    </>);
};
