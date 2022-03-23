import { assign, createMachine, send, spawn } from "xstate";
import { ProductMachine } from "./ProductMachine";
import { PartyMachine } from "./PartyMachine";
import { NullMachine } from "./NullMachine";
import { LoginMachine } from "./LoginMachine";
import { LogoutMachine } from "./LogoutMachine";


export const AppMachine = createMachine({
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
        assignLoginActor: assign((ctx, ev) => ({
            actor: spawn(LoginMachine)
        })),
        assignLogoutActor: assign((ctx, ev) => ({
            actor: spawn(LogoutMachine)
        })),
    }
});
