import { useActor } from "@xstate/react";
import { Button, Modal, Form, Input } from "antd";
import { productEditMachine } from "../machines/productEditMachine";

export const ProductEdit = () => {
    const [editorState, sendToEditor] = useActor(productEditMachine);
    const { product } = editorState.context;

    const handleClose = () => sendToEditor({ type: "CLOSE_EDITOR" });
    const saveProduct = () => sendToEditor({ type: "SAVE" });

    editorState.context.closeOnSave = true;

    return (
        <Modal
            title={product.id ? `Edit ${product.name}` : "Enter Product Info"}
            visible={editorState.value === "inactive" ? false : true}
            onOk={handleClose}
            onCancel={handleClose}
            footer={[
                <Button type="primary" onClick={saveProduct} key="btnSave">Save & Close</Button>
            ]}
        >
            <Form>
                <Form.Item label="Name" name="name">
                    <Input value={product.name} />
                </Form.Item>
                <Form.Item label="Category" name="category">
                    <Input value={product.category} />
                </Form.Item>
            </Form>
        </Modal>
    );
};
