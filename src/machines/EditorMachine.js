import { assign, createMachine } from "xstate";


export const EditorModalMachine = createMachine({
    initial: "saved",
    states: {
        hasValidChanges: {
            on: {
                "SAVE_RECORD": { target: "saving" },
                "EDIT_RECORD": { target: "hasInvalidChanges", cond: "changesAreInvalid" }
            }
        },
        hasInvalidChanges: {
            on: {
                "EDIT_RECORD": { target: "hasValidChanges", cond: "changesAreValid" }
            }
        },
        saved: {
            on: {
                "EDIT_RECORD": [
                    { target: "hasValidChanges", cond: "changesAreValid" },
                    { target: "hasInvalidChanges", cond: "changesAreInvalid" }
                ]
            }
        },
        saving: {
            on: {
                "SAVE_SUCCESS": { target: "doneSaving", actions: ["assignSuccessNext"] },
                "SAVE_FAILURE": { target: "doneSaving", actions: ["assignFailureNext"] },
                "EDIT_RECORD": { actions: ["assignChangedNext"] },
            }
        },
        doneSaving: {
            always: [
                { target: "saved", cond: (ctx, _) => ctx._nextState === "saved" },
                { target: "hasValidChanges", cond: (ctx, _) => ctx._nextState === "hasValidChanges" },
                { target: "hasInvalidChanges", cond: (ctx, _) => ctx._nextState === "hasInvalidChanges" },
            ],
            exit: assign({ _nextState: null }),
        }
    },
    context: {
        record: {},
        _nextState: null,
    },
}, {
    actions: {
        assignSuccessNext: assign((ctx, _) => ({ _nextState: ctx._nextState || "saved" })),
        assignFailureNext: assign((ctx, _) => ({ _nextState: ctx._nextState || "hasValidChanges" })),
        assignChangedNext: assign({ _nextState: (_, ev) => ev.isValid ? "hasValidChanges" : "hasInvalidChanges" }),
    },
    guards: {
        changesAreValid: (ctx, ev) => ev.isValid,
        changesAreInvalid: (ctx, ev) => !ev.isValid,
    }
});
