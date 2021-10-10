import { createMachine } from "xstate";


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

export const MenuMachine = createMachine({
    states: {
        home: {},
        product: {},
        category: {}
    },
    on: {
        "SHOW_HOME": { target: "home" },
        "SHOW_PRODUCT": { target: "product" },
        "SHOW_CATEGORY": { target: "category" }
    },
    initial: "home"
});