import { assign, createMachine } from "xstate";
import axios from "axios";

export const FetchMachine = createMachine({
    initial: "ideal",
    states: {
        ideal: {
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
            always: { target: "ideal" }
        },
        hasError: {
            always: { target: "ideal" }
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
            },
            mode: 'cors',
        }),
        {
            headers: { 'Content-Type': 'application/json' }
        }
    ).then(({ data }) => {
        return { result: data.result.listIt, error: null };
    }).catch(error => {
        return { result: null, error }
    });

