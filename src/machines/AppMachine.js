import { assign, createMachine, send, spawn } from "xstate";
import { ProductMachine } from "./ProductMachine";
import { PartyMachine } from "./PartyMachine";
import { NullMachine } from "./NullMachine";
import { LoginMachine } from "./LoginMachine";
import { LogoutMachine } from "./LogoutMachine";

import { Accounting } from "../services/Accounting";
import { FetchMachine } from "./FetchMachine";


export const AppMachine = createMachine({
    id: "app",
    states: {
        start: {
            entry: send({ type: "LOGIN" })
        },
        home: {},
        product: {},
        category: {},
        partner: {},
        rateplan: {},
        party: {},
        paymentList: {},
        login: {},
        logout: {},
    },
    on: {
        "NAV_HOME": { target: "home", actions: ["assignHomeActor"] },
        "NAV_PRODUCT": { target: "product", actions: ["assignProductActor"] },
        "NAV_CATEGORY": { target: "category" },
        "NAV_PARTNER": { target: "partner" },
        "NAV_RATEPLAN": { target: "rateplan" },
        "NAV_PARTY": { target: "party", actions: ["assignPartyActor"] },
        "NAV_PAYMENT_LIST": { target: "paymentList", actions: ["assignPaymentListActor"] },
        "LOGIN": { target: "login", actions: ["assignLoginActor"] },
        "LOGOUT": { target: "logout", actions: ["assignLogoutActor"] },
    },
    context: {
        actor: null
    },
    initial: "start"
}, {
    actions: {
        assignHomeActor: assign((ctx, ev) => ({
            actor: spawn(NullMachine)
        })),
        assignProductActor: assign((ctx, ev) => ({
            actor: spawn(ProductMachine)
        })),
        assignPartyActor: assign((ctx, ev) => ({
            actor: spawn(PartyMachine)
        })),
        assignPaymentListActor: assign((ctx, ev) => {
            const actor = [
                spawn(FetchMachine.withConfig(
                    {
                        services: { doFetch: Accounting.fetchBalanceRequests }
                    },
                    {
                        payload: { data: { page: 1, limit: 10 } },
                        error: { message: "Waiting for Payment Search" }
                    }
                )),
                spawn(FetchMachine.withConfig(
                    {
                        services: { doFetch: Accounting.handleBalanceRequest }
                    }
                ))
            ];
            return { actor };
        }),
        assignLoginActor: assign((ctx, ev) => ({
            actor: spawn(LoginMachine)
        })),
        assignLogoutActor: assign((ctx, ev) => ({
            actor: spawn(LogoutMachine)
        })),
    }
});
