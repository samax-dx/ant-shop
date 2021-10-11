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
        "NAV_HOME": {
            target: "home",

        },
        "NAV_PRODUCT":
            {
                target: "product",
                actions:[()=>console.log('entering product...')]
            },
        "NAV_CATEGORY": { target: "category" }
    },
    initial: "home"
});
