import { createMachine, send } from "xstate";


export const EditorModalMachine = createMachine({
    context: {
        record: {},
    },
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
            invoke: {
                id: "svcSaveRecord",
                src: (ctx, ev) => (_, onEvent) => {
                    ctx._exitState = "saved";

                    onEvent(({ type, isValid, targetReceiver: receive }) => {
                        if (type === "EDIT_RECORD") {
                            ctx._exitState = isValid ? "valid" : "invalid";
                            return;
                        }

                        if (type === "REQUEST_TARGET") {
                            if (typeof receive === "function") {
                                receive(ctx._exitState)
                            }
                            return;
                        }
                    });
                }
            },
            on: {
                "EDIT_RECORD": { actions: "sendToSaveRecord" },
                "REQUEST_TARGET": { actions: "sendToSaveRecord" },
                "END_SAVE": [
                    { target: "saved", cond: (_, ev) => ev.t === "saved" },
                    { target: "hasValidChanges", cond: (_, ev) => ev.t === "hasValidChanges" },
                    { target: "hasInvalidChanges", cond: (_, ev) => ev.t === "hasInvalidChanges" },
                ],
                // "END_SAVE": [
                //     "saved", "hasValidChanges", "hasInvalidChanges"
                // ].map(t => ({ target: t, cond: (_, ev) => ev.nextState === t }))
            }
        }
    },
    initial: "saved"
}, {
    actions: {
        sendToSaveRecord: send((_, ev) => ({ ...ev }), { to: "svcSaveRecord" })
    },
    guards: {
        changesAreValid: (ctx, ev) => ev.isValid,
        changesAreInvalid: (ctx, ev) => !ev.isValid
    }
});
