import { assign, createMachine } from "xstate";


export const EditorMachine = createMachine({
    states: {
        isEditing: {
            on: {
                "VALIDATE": { target: "isValidating" },
                "EDIT_RECORD": { actions: ["updateRecord"] },
            },
            after: {
                300: { target: "isValidating" }
            }
        },
        isValidating: {
            on: {
                "SET_VALID": [
                    { target: "hasValidChanges", cond: (ctx, _) => ctx._nextState || true },
                    { target: "isEditing", cond: (ctx, _) => ctx._nextState === "isEditing" },
                ],
                "SET_INVALID": [
                    { target: "hasInvalidChanges", cond: (ctx, _) => ctx._nextState || true },
                    { target: "isEditing", cond: (ctx, _) => ctx._nextState === "isEditing" },
                ],
                "EDIT_RECORD": { actions: ["assignChangedNext", "updateRecord"] }
            },
            exit: assign({ _nextState: null })
        },
        hasValidChanges: {
            on: {
                "SAVE_RECORD": { target: "isSaving" },
                "EDIT_RECORD": { target: "isEditing", actions: ["updateRecord"] }
            }
        },
        hasInvalidChanges: {
            on: {
                "EDIT_RECORD": { target: "isEditing", actions: ["updateRecord"] }
            }
        },
        didSave: {
            on: {
                "EDIT_RECORD": { target: "isEditing", actions: ["updateRecord"] }
            }
        },
        isSaving: {
            on: {
                "SAVE_SUCCESS": { target: "doneSaving", actions: ["assignSuccessNext", "updateRecord"] },
                "SAVE_FAILURE": { target: "doneSaving", actions: ["assignFailureNext", "updateRecord"] },
                "EDIT_RECORD": { actions: ["assignChangedNext", "updateRecord"] }
            }
        },
        doneSaving: {
            always: [
                { target: "didSave", cond: (ctx, _) => ctx._nextState === "didSave" },
                { target: "isEditing", cond: (ctx, _) => ctx._nextState === "isEditing" },
                { target: "hasValidChanges", cond: (ctx, _) => ctx._nextState === "hasValidChanges" }
            ],
            exit: assign({ _nextState: null })
        }
    },
    initial: "didSave",
    context: { record: {}, _nextState: null },
}, {
    actions: {
        updateRecord: assign((ctx, ev) => ({ record: { ...ctx.record, ...ev.data } })),
        assignSuccessNext: assign((ctx, _) => ({ _nextState: ctx._nextState || "didSave" })),
        assignFailureNext: assign((ctx, _) => ({ _nextState: ctx._nextState || "hasValidChanges" })),
        assignChangedNext: assign({ _nextState: "isEditing" }),
    }
});
