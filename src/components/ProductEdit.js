import { useActor } from "@xstate/react";
import { Button, Modal, Form, Input } from "antd";
import { createRef } from "react";
import { productEditMachine } from "../machines/productEditMachine";

export const ProductEdit = () => {
    const [editorState, sendToEditor] = useActor(productEditMachine);
    const { product } = editorState.context;
    const editFormRef = createRef(null);

    const canSave = () => editorState.value === "editing";
    const validateForm = () => {
        editFormRef.current.validateFields()
            .then(() => {console.log("valid input");
                //
            })
            .catch(() => {console.log("invalid input");
                //
            });
    };

    const startEdit = () => sendToEditor({ type: "EDIT_PRODUCT", product });
    const cancelEdit = () => sendToEditor({ type: "CLOSE_EDITOR" });
    const saveProduct = () => sendToEditor({ type: "SAVE_PRODUCT", shouldClose: !1 });
    const saveProductAndClose = () => sendToEditor({ type: "SAVE_PRODUCT", shouldClose: !0 });

    return (
        <Modal
            title={product.id ? `Edit ${product.name}` : "Enter Product Info"}
            visible={true}
            onCancel={cancelEdit}
            footer={[
                <Button type="primary" onClick={saveProduct} key="btnSave" disabled={!canSave()}>Save</Button>,
                <Button type="primary" onClick={saveProductAndClose} key="btnSaveClose" disabled={!canSave()}>Save & Close</Button>
            ]}
        >
            <Form onChange={() => startEdit() | validateForm()} ref={editFormRef}>
                <Form.Item label="Name" name="name" initialValue={product.name} required={true}>
                    <Input />
                </Form.Item>
                <Form.Item label="Category" name="category" initialValue={product.category}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};
