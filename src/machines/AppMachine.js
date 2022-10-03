import { assign, createMachine, send, spawn } from "xstate";
import { ProductMachine } from "./ProductMachine";
import { NullMachine } from "./NullMachine";
import { LoginMachine } from "./LoginMachine";
import { LogoutMachine } from "./LogoutMachine";

import { FetchMachine, spawnFetcher } from "./FetchMachine";
import { XAuth } from "../services/XAuth";
import { Accounting } from "../services/Accounting";
import { Party } from "../services/Party";
import { Prefix } from "../services/Prefix";
import { DialPlan } from "../services/DialPlan";
import { Route } from "../services/Route";
import { Package } from "../services/Package";
import {SenderIdManagerService} from "../services/SenderIdManagerService";


export const AppMachine = createMachine({
    id: "app",
    states: {
        start: {
            entry: [
                "assignStartAction",
                send((ctx, ev) => ({ type: ctx.__start_action }))
            ],
        },
        home: {},
        product: {},
        category: {},
        partner: {},
        rateplan: {},
        parties: {},
        payments: {},
        paymentList: {},
        prefix: {},
        route: {},
        dialPlan: {},
        senderIdManager: {},
        package: {},
        login: {},
        logout: {},
    },
    on: {
        "NAV_HOME": { target: "home", actions: ["assignHomeActor"] },
        "NAV_PRODUCT": { target: "product", actions: ["assignProductActor"] },
        "NAV_CATEGORY": { target: "category" },
        "NAV_PARTNER": { target: "partner" },
        "NAV_RATEPLAN": { target: "rateplan" },
        "NAV_PARTIES": { target: "parties", actions: ["assignPartiesActor"] },
        "NAV_PAYMENTS": { target: "payments", actions: ["assignPaymentsActor"] },
        "NAV_PAYMENT_LIST": { target: "paymentList", actions: ["assignPaymentListActor"] },
        "NAV_PREFIX": { target: "prefix", actions: ["assignPrefixActor"] },
        "NAV_ROUTE": { target: "route", actions: ["assignRouteActor"] },
        "NAV_DIAL_PLAN": { target: "dialPlan", actions: ["assignDialPlanActor"] },
        "NAV_PACKAGE": { target: "package", actions: ["assignPackageActor"] },
        "NAV_SENDER_ID_MANAGER": { target: "senderIdManager", actions: ["assignSenderIdManagerActor"] },
        "LOGIN": { target: "login", actions: ["assignLoginActor"] },
        "LOGOUT": { target: "logout", actions: ["assignLogoutActor"] },
    },
    context: {
        __start_action: null,
        actor: null
    },
    initial: "start"
}, {
    actions: {
        assignStartAction: assign((ctx, ev) => ({
            __start_action: XAuth.token() ? "NAV_HOME" : "LOGIN"
        })),
        assignHomeActor: assign((ctx, ev) => ({
            actor: spawn(NullMachine)
        })),
        assignProductActor: assign((ctx, ev) => ({
            actor: spawn(ProductMachine)
        })),
        assignPartiesActor: assign((ctx, ev) => ({
            actor: [
                spawnFetcher(
                    Party.fetchParties,
                    { data: { page: 1, limit: 10 } },
                    { parties: [], count: 0 },
                    { message: "Waiting for Party Search" }
                ),
                spawnFetcher(
                    Party.createParty,
                    { data: {} },
                    { partyId: null },
                    { message: "Waiting for Registration Request" }
                )
            ]
        })),
        assignPaymentsActor: assign((ctx, ev) => ({
            actor: [
                spawnFetcher(
                    Accounting.fetchBalanceRequests,
                    { data: { page: 1, limit: 10 } },
                    { payments: [], count: 0 },
                    { message: "Waiting for TopUp / Payment Search" }
                ),
                spawnFetcher(
                    Accounting.addPartyBalance,
                    { data: {} },
                    { paymentId: null },
                    { message: "Waiting for Payment Request" }
                ),
                spawnFetcher(
                    Party.fetchParties,
                    { data: { page: 1, limit: 10 } },
                    { parties: [], count: 0 },
                    { message: "Waiting for Party Search" }
                )
            ]
        })),
        assignPaymentListActor: assign((ctx, ev) => ({
            actor: [
                spawnFetcher(
                    Accounting.fetchBalanceRequests,
                    { data: { page: 1, limit: 10 } },
                    { payments: [], count: 0 },
                    { message: "Waiting for TopUp / Payment Search" }
                ),
                spawnFetcher(
                    Accounting.handleBalanceRequest,
                    { data: {} },
                    { paymentId: null },
                    { message: "Waiting for Payment Request" }
                )
            ]
        })),
        assignPrefixActor: assign((ctx, ev) => ({
            actor: [
                spawnFetcher(
                    Prefix.fetchRecords,
                    { data: { page: 1, limit: 10 } },
                    { prefixes: [], count: 0 },
                    { message: "Waiting for Prefix Search" }
                ),
                spawnFetcher(
                    Prefix.saveRecord,
                    { data: {} },
                    { prefixId: null },
                    { message: "Waiting for Prefix Save" }
                )
            ]
        })),
        assignRouteActor: assign((ctx, ev) => ({
            actor: [
                spawnFetcher(
                    Route.fetchRecords,
                    { data: { page: 1, limit: 10 } },
                    { routes: [], count: 0 },
                    { message: "Waiting for Route Search" }
                ),
                spawnFetcher(
                    Route.saveRecord,
                    { data: {} },
                    { routeId: null },
                    { message: "Waiting for Route Save" }
                )
            ]
        })),
        assignDialPlanActor: assign((ctx, ev) => ({
            actor: [
                spawnFetcher(
                    DialPlan.fetchRecords,
                    { data: { page: 1, limit: 10 } },
                    { dialPlans: [], count: 0 },
                    { message: "Waiting for DialPlan Search" }
                ),
                spawnFetcher(
                    DialPlan.saveRecord,
                    { data: {} },
                    { dialPlanId: null },
                    { message: "Waiting for DialPlan Save" }
                )
            ]
        })),
        assignSenderIdManagerActor: assign((ctx, ev) => ({
            actor: null
        })),
        assignPackageActor: assign((ctx, ev) => ({
            actor: [
                spawnFetcher(
                    Package.fetchRecords,
                    { data: { page: 1, limit: 10 } },
                    { packages: [], count: 0 },
                    { message: "Waiting for PackagePrefix Search" }
                ),
                spawnFetcher(
                    Package.saveRecord,
                    { data: {} },
                    { packageId: null },
                    { message: "Waiting for PackagePrefix Save" }
                )
            ]
        })),
        assignLoginActor: assign((ctx, ev) => ({
            actor: spawn(LoginMachine)
        })),
        assignLogoutActor: assign((ctx, ev) => ({
            actor: spawn(LogoutMachine)
        })),
    }
});
