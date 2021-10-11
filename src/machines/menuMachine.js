import { createMachine, interpret } from "xstate";

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
    states: {
        home: {},
        product: {},
        category: {}
    },
    on: {
        "NAV_HOME": { target: "home" },
        "NAV_PRODUCT": { target: "product" },
        "NAV_CATEGORY": { target: "category" }
    },
    initial: "home"
});

const menuMachine = interpret(MenuMachine);

menuMachine.start();
export { menuMachine };
