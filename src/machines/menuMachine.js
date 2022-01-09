import { assign, createMachine, interpret, spawn } from "xstate";
import { PartyFetchMachine } from "./PartyFetchMachine";
import { ProductMachine } from "./ProductMachine";

const MenuMachine = createMachine({
    context: {
        actor: null
    },
    states: {
        home: {},
        product: {},
        category: {},
        partner: {},
        rateplan: {},
        party: {},
    },
    on: {
        "NAV_HOME": { target: "home" },
        "NAV_PRODUCT": { target: "product", actions: ["assignProductActor"] },
        "NAV_CATEGORY": { target: "category" },
        "NAV_PARTNER": { target: "partner" },
        "NAV_RATEPLAN": { target: "rateplan" },
        "NAV_PARTY": { target: "party", actions: ["assignPartyActor"] },
    },
    initial: "home"
}, {
    actions: {
        assignProductActor: assign((ctx, ev) => ({
            actor: spawn(ProductMachine)
        })),
        assignPartyActor: assign((ctx, ev) => ({
            actor: spawn(PartyFetchMachine)
        }))
    }
});

const menuMachine = interpret(MenuMachine);

menuMachine.start();
export { menuMachine };
