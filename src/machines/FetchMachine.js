import { assign, createMachine } from "xstate";

export const createFetchMachine = (doFetch, initialError) => createMachine({
    initial: "ideal",
    states: {
        ideal: {
            on: {
                "LOAD": { target: "loading", actions: ["assignPayload"] },
            }
        },
        loading: {
            invoke: {
                src: "runQuery",
                onDone: { target: "hasResult", actions: ["setResult"] },
                onError: { target: "hasError", actions: ["setError"] }
            }
        },
        hasResult: {
            always: { target: "ideal" }
        },
        hasError: {
            always: { target: "ideal" }
        }
    },
    context: {
        result: null,
        error: initialError,
        payload: null,
    },
    id: undefined,
}, {
    services: {
        runQuery: (ctx, ev) => doFetch(ctx.payload),
    },
    actions: {
        assignPayload: assign((ctx, ev) => ({ payload: ev.data })),
        setResult: assign((ctx, ev) => ({ ...ev.data, payload: ctx.payload })),
        setError: assign((ctx, ev) => ({ error: ev.data, result: null })),
    }
});
