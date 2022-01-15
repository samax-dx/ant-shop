import { assign, createMachine } from "xstate";

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
        error: "Waiting for Party Search",
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

const doFetch = async searchData => {
    try {
        const response = await fetch("http://localhost:3005/ofbiz", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Accept": "application/json"
            },
            body: JSON.stringify({
                method: "performFind",
                params: {
                    entityName: "PartyNameView",
                    inputFields: {
                        groupName: searchData,
                        groupName_op: "contains"
                    }
                },
                mode: 'cors',
            })
        });

        const { ok: success, status: code, statusText: message } = response;
        const { result } = await (success ? response.json() : {});
        const error = success ? null : { code, message };

        return { result: result && result.listIt, error };
    } catch (error) {
        return { result: null, error };
    }
};
