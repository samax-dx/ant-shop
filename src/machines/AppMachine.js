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
import {EditorMachineLite} from "./EditorMachineLite";
import {Campaign} from "../services/Campaign";


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
        sendSMS: {},
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
        package: {},
        login: {},
        logout: {},
        campaign: {},
        campaignTaskReport: {},
        users:{},
    },
    on: {
        "NAV_HOME": { target: "home", actions: ["assignHomeActor"] },
        "NAV_SEND_SMS": { target: "sendSMS", actions: ["assignSendSmsActor"] },
        "NAV_PRODUCT": { target: "product", actions: ["assignProductActor"] },
        "NAV_CATEGORY": { target: "category" },
        "NAV_PARTNER": { target: "partner" },
        "NAV_RATEPLAN": { target: "rateplan" },
        "NAV_PARTIES": { target: "parties", actions: ["assignPartiesActor"] },
        "NAV_USERS": { target: "users", actions: ["assignUsersActor"] },
        "NAV_PAYMENTS": { target: "payments", actions: ["assignPaymentsActor"] },
        "NAV_PAYMENT_LIST": { target: "paymentList", actions: ["assignPaymentListActor"] },
        "NAV_PREFIX": { target: "prefix", actions: ["assignPrefixActor"] },
        "NAV_ROUTE": { target: "route", actions: ["assignRouteActor"] },
        "NAV_DIAL_PLAN": { target: "dialPlan", actions: ["assignDialPlanActor"] },
        "NAV_PACKAGE": { target: "package", actions: ["assignPackageActor"] },
        "LOGIN": { target: "login", actions: ["assignLoginActor"] },
        "LOGOUT": { target: "logout", actions: ["assignLogoutActor"] },
        "NAV_CAMPAIGN": { target: "campaign", actions: ["assignCampaignActor"] },
        "NAV_CAMPAIGN_TASK_REPORT": { target: "campaignTaskReport", actions: ["assignCampaignTaskReportActor"] },
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
        assignSendSmsActor: assign((ctx, ev) => ({
            actor: spawn(EditorMachineLite)
        })),
        assignHomeActor: assign((ctx, ev) => ({
            actor: spawn(NullMachine)
        })),
        assignProductActor: assign((ctx, ev) => ({
            actor: spawn(ProductMachine)
        })),
        assignCampaignActor: assign((ctx, ev) => ({
            actor: [
                spawnFetcher(
                    Campaign.fetchCampigns,
                    { data: { page: 1, limit: 10 } },
                    { campaigns: [], count: 0 },
                    { message: "Waiting for Campaign Search" }
                ),
                spawnFetcher(
                    Campaign.saveCampaign,
                    { data: {} },
                    { campaignId: null },
                    { message: "Waiting for Campaign Save" }
                ),
                spawnFetcher(
                    Campaign.fetchCampaignTasks,
                    { data: { page: 1, limit: 10 } },
                    { campaign: {}, tasks: [], count: 0 },
                    { message: "Waiting for Campaign-Task Search" }
                )
            ]
        })),
        assignCampaignTaskReportActor: assign((ctx, ev) => ({
            actor: [
                spawnFetcher(
                    Campaign.fetchCampaignTaskReports,
                    { data: { page: 1, limit: 10 } },
                    { campaigns: [], count: 0 },
                    { message: "Waiting for Campaign-Task Search" }
                )
            ]
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
        assignUsersActor: assign((ctx, ev) => ({
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
