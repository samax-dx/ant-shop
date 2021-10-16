import { assign, createMachine } from "xstate";

export const EditorModalMachine = createMachine({
    context: {
        product: {}
    },
    states: {
        inactive: {
            on: {
                "EDIT_RECORD": {
                    target: "ideal",
                    actions: assign({ product: (ctx, ev) => ev.product })
                }
            }
        },
        ideal: {
            on: {
                "EDIT_RECORD": { target: "editing" },
                "CLOSE_EDITOR": { target: "inactive" }
            },
        },
        editing: {
            on: {
                "SAVE_RECORD": { target: "saving" },
                "CLOSE_EDITOR": { target: "inactive" },
                "INVALID_INPUT": { target: "editing_invalid" }
            },
            exit: ["trackSaveClose"]
        },
        editing_invalid: {
            on: {
                "EDIT_RECORD": { target: "editing" },
                "CLOSE_EDITOR": { target: "inactive" }
            }
        },
        saving: {
            invoke: {
                src: "saveProduct",
                onDone: { target: "success" },
                onError: { target: "editing" }
            }
        },
        success: {
            always: { target: "inactive", cond: "shouldClose" },
            on: {
                "EDIT_RECORD": { target: "editing" },
                "CLOSE_EDITOR": { target: "inactive" }
            },
            exit: ["trackSaveClose"]

        },
        error: {
            on: {
                "EDIT_RECORD": { target: "editing" },
                "CLOSE_EDITOR": { target: "inactive" }
            }
        }
    },
    initial: "inactive"
}, {
    services: {
        saveProduct: async (ctx, ev) => console.log("saving") || true
    },
    actions: {
        trackSaveClose: (ctx, ev) => {
            if (ev.type === "SAVE_RECORD") {
                ctx._shouldCloseOnSaved = ev.shouldClose;
            } else {
                delete ctx._shouldCloseOnSaved;
            }
        }
    },
    guards: {
        shouldClose: (ctx, ev) => ctx._shouldCloseOnSaved,
    }
});