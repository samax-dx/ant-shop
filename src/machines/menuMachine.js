import { assign, createMachine, interpret, spawn } from "xstate";
import { ProductMachine } from "./ProductMachine";

// export const MenuMachine = createMachine({
//     context: {
//         data: ""
//     },
//     states: {
//         home: {},
//         product: {},
//         category: {}
//     },
//     on: {
//         "ACTIVATE": [
//             { target: "home", cond: (ctx, ev) => ev.key === "home", actions: ["activateMenu"] },
//             { target: "product", cond: (ctx, ev) => ev.key === "product", actions: ["activateMenu"] },
//             { target: "category", cond: (ctx, ev) => ev.key === "category", actions: ["activateMenu"] }
//         ]
//     },
//     initial: "home"
// });

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
        "NAV_PARTY": { target: "party" },
    },
    initial: "home"
}, {
    actions: {
        assignProductActor: assign((ctx, ev) => ({
            actor: spawn(ProductMachine)
        }))
    }
});

const menuMachine = interpret(MenuMachine);

menuMachine.start();
export { menuMachine };
