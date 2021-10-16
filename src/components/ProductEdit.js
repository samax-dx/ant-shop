import { useActor } from "@xstate/react";
import { Button, Modal, Form, Input } from "antd";
import { useState } from "react";
import { productEditMachine } from "../machines/productEditMachine";

export const ProductEdit = () => {
    const [editorState, sendToEditor] = useActor(productEditMachine);
    const [editForm] = Form.useForm();
    const [formVaildity, setValid] = useState(1);
    const { product } = editorState.context;

    const canSave = () => editorState.value === "editing" && formVaildity;

    const startEdit = () => sendToEditor({ type: "EDIT_RECORD", product });
    const cancelEdit = () => sendToEditor({ type: "CLOSE_EDITOR" });
    const saveProduct = () => sendToEditor({ type: "SAVE_RECORD", shouldClose: !1 });
    const saveProductAndClose = () => sendToEditor({ type: "SAVE_RECORD", shouldClose: !0 });

    const validateForm = _ => {
        if (editForm === undefined) setValid(0);
        const fnSetValid = isValid => () => setValid(isValid);
        editForm.validateFields().then(fnSetValid(1)).catch(fnSetValid(0));
    };

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
            <Form
                initialValues={product}
                onValuesChange={() => startEdit() & validateForm()}
                validateTrigger={""}
                form={editForm}
            >
                <Form.Item label="Name" name="name" rules={[
                    { required: true }
                ]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Category" name="category" rules={[
                    { required: true, type: "email" }
                ]}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};
