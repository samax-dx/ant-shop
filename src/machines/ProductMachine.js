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
        "LOAD": {
            target: "loading",
            actions: assign({
                query: (ctx, ev) => {
                    const ev_data = typeof ev.data === "object" ? ev.data : {};

                    const restActions = {
                        idEquals: id => `${id}`,
                        productNameContains: n => `productNameContains/${n}`,
                    };

                    const params = Object.keys(ev_data).map(
                        k => restActions[k] && restActions[k](ev_data[k])
                    );

                    return params.length ? `/${params.join("/")}` : "";
                }
            })
        }
    },
    initial: "noQuery"
}, {
    services: {
        runQuery: async (ctx, ev) => {
            return await products;//axios.get(`http://localhost:5000/category${ctx.query}`);
        }
    },
    actions: {
        setResult: assign((ctx, ev) => ({ data: ev.data })),
        setError: assign((ctx, ev) => ({ error: ev.data })),
    }
});