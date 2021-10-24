import { assign, createMachine, send } from "xstate";
import products from "../components/products.json";

export const ProductMachine = createMachine({
    id: "smProductMachine",
    context: {
        data: null,
        error: null,
    },
    states: {
        noQuery: {
            entry: send({ type: "LOAD" })
        },
        hasQuery: {},
        loading: {
            invoke: {
                src: "runQuery",
                onDone: { target: "hasResult", actions: ["setResult"] },
                onError: { target: "hasError", actions: ["setError"] }
            }
        },
        hasResult: {},
        hasError: {}
    },
    on: {
        "LOAD": { target: "loading" }
    },
    initial: "noQuery"
}, {
    services: {
        runQuery: async (ctx, ev) => {
            const response = await fetch("http://localhost:5000/product/1");
            const product = await response.json()
            return [product];
        }
    },
    actions: {
        setResult: assign((ctx, ev) => ({ data: ev.data })),
        setError: assign((ctx, ev) => ({ error: ev.data })),
    }
});