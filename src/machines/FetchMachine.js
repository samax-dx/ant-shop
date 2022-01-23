import { assign, createMachine } from "xstate";


export const FetchMachine = createMachine({
    initial: "idle",
    states: {
        idle: {
            on: {
                "LOAD": { target: "fetching" },
            }
        },
        fetching: {
            invoke: {
                src: "doFetch",
                onDone: { target: "hasResult", actions: ["setResult"] },
                onError: { target: "hasError", actions: ["setError"] }
            }
        },
        hasResult: {
            always: { target: "idle" }
        },
        hasError: {
            always: { target: "idle" }
        }
    },
    context: {
        result: null,
        error: { message: "Waiting for Party Search" },
        payload: null,
    },
    id: undefined,
}, {
    actions: {
        setResult: assign((ctx, ev) => ({ ...ev.data, payload: ctx.payload })),
        setError: assign((ctx, ev) => ({ error: ev.data, result: null })),
    }
});
