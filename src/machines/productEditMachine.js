import { createMachine, interpret } from "xstate";

const ProductEditMachine = createMachine({
    context: {
        product: {},
        closeOnSave: false
    },
    states: {
        inactive: {
            on: {
                "EDIT_PRODUCT": {
                    target: "editing",
                    actions: [(ctx, ev) => { ctx.product = ev.product || {}; }]
                }
            }
        },
        editing: {
            on: {
                "SAVE": { target: "saving" },
                "CLOSE_EDITOR": { target: "inactive" }
            }
        },
        saving: {
            invoke: {
                src: "saveProduct",
                onDone: { target: "success" },
                onError: { target: "error" }
            }
        },
        success: {
            always: { target: "inactive", cond: (ctx, ev) => true },
            on: {
                "EDIT_PRODUCT": { target: "editing" },
                "CLOSE_EDITOR": { target: "inactive" }
            }
        },
        error: {
            on: {
                "EDIT_PRODUCT": { target: "editing" },
                "CLOSE_EDITOR": { target: "inactive" }
            }
        }
    },
    initial: "inactive"
}, {
    services: {
        saveProduct: async (ctx, ev) => console.log("saving") || true
    }
});

const productEditMachine = interpret(ProductEditMachine);

productEditMachine.start();
export { productEditMachine };
