import { assign, createMachine } from "xstate";
import axios from "axios";

export const FetchMachine = createMachine({
    initial: "idle",
    states: {
        idle: {
            on: {
                "LOAD": { target: "loading", actions: ["assignPayload"] },
            }
        },
        loading: {
            invoke: {
                src: (ctx, ev) => doFetch(ctx.payload),
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
        assignPayload: assign((ctx, ev) => ({ payload: ev.data })),
        setResult: assign((ctx, ev) => ({ ...ev.data, payload: ctx.payload })),
        setError: assign((ctx, ev) => ({ error: ev.data, result: null })),
    }
});

const doFetch = searchData =>
    axios.post(
        "http://localhost:3005/ofbiz",
        JSON.stringify({
            method: "performFind",
            params: {
                entityName: "PartyNameView",
                inputFields: {
                    groupName: searchData,
                    groupName_op: "contains"
                }
            }
        }),
        {
            headers: { 'Content-Type': 'application/json' }
        }
    ).then(response => {
        const { result, error = null } = response.data;
        return { result: result && result.listIt, error };
    }).catch(error => {
        const response = error.response || { data: { error: error.message } };
        const { status: code, statusText: text, data } = response;
        return { result: null, error: { code, message: data.error || text } };
    });

