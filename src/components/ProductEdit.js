import { useActor } from "@xstate/react";
import { Button, Modal, Form, Input } from "antd";
import { createRef, useEffect } from "react";
import { productEditMachine } from "../machines/productEditMachine";

export const ProductEdit = () => {
    const [editorState, sendToEditor] = useActor(productEditMachine);
    const formRef = createRef(null);

    const { product } = editorState.context;

    const handleClose = () => sendToEditor({ type: "CLOSE_EDITOR" });
    const saveProduct = () => sendToEditor({ type: "SAVE" });

    useEffect(() => {
        formRef.current.setFieldsValue(product);
    }, [formRef, product]);

    return (
        <Modal
            title={product.id ? `Edit ${product.name}` : "Enter Product Info"}
            visible={true}
            onOk={handleClose}
            onCancel={handleClose}
            footer={[
                <Button type="primary" onClick={saveProduct} key="btnSave">Save & Close</Button>
            ]}
        >
            <Form ref={formRef}>
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
