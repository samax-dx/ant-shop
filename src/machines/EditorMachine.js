import { assign, createMachine } from "xstate";


export const EditorMachine = createMachine({
    initial: "didSave",
    states: {
        isEditing: {
            on: {
                "VALIDATE": { target: "isValidating" }
            },
            after: {
                300: { target: "isValidating" }
            }
        },
        isValidating: {
            on: {
                "SET_VALID": { target: "hasValidChanges" },
                "SET_INVALID": { target: "hasInvalidChanges" }
            }
        },
        hasValidChanges: {
            on: {
                "SAVE_RECORD": { target: "isSaving" },
                "EDIT_RECORD": { target: "isEditing", actions: ["assignRecord"] }
            }
        },
        hasInvalidChanges: {
            on: {
                "EDIT_RECORD": { target: "isEditing", actions: ["assignRecord"] }
            }
        },
        didSave: {
            on: {
                "EDIT_RECORD": { target: "isEditing", actions: ["assignRecord"] }
            }
        },
        isSaving: {
            on: {
                "SAVE_SUCCESS": { target: "doneSaving", actions: ["assignSuccessNext"] },
                "SAVE_FAILURE": { target: "doneSaving", actions: ["assignFailureNext"] },
                "EDIT_RECORD": { actions: ["assignRecord", "assignChangedNext"] }
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
    context: {
        record: null,
        _nextState: null
    }
}, {
    actions: {
        assignRecord: assign((_, ev) => ({ record: ev.data })),
        assignSuccessNext: assign((ctx, _) => ({ _nextState: ctx._nextState || "didSave" })),
        assignFailureNext: assign((ctx, _) => ({ _nextState: ctx._nextState || "hasValidChanges" })),
        assignChangedNext: assign({ _nextState: "isEditing" }),
    }
});
