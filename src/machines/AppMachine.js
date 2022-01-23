import { assign, createMachine, send, spawn } from "xstate";
import { ProductMachine } from "./ProductMachine";
import { PartyMachine } from "./PartyMachine";
import { NullMachine } from "./NullMachine";


export const AppMachine = createMachine({
    states: {
        start: {
            entry: send({ type: "NAV_HOME" })
        },
        home: {},
        product: {},
        category: {},
        partner: {},
        rateplan: {},
        party: {},
    },
    on: {
        "NAV_HOME": { target: "home", actions: ["assignHomeActor"] },
        "NAV_PRODUCT": { target: "product", actions: ["assignProductActor"] },
        "NAV_CATEGORY": { target: "category" },
        "NAV_PARTNER": { target: "partner" },
        "NAV_RATEPLAN": { target: "rateplan" },
        "NAV_PARTY": { target: "party", actions: ["assignPartyActor"] },
    },
    context: {
        actors: []
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
    }
});
