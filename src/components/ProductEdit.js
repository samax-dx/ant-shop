import { Button, Modal, Form, Input } from "antd";

export const ProductEdit = ({ product, onClose }) => {
    return (
        <Modal
            title={product.id ? `Edit ${product.name}` : "Enter Product Info"}
            visible={true}
            onCancel={onClose}
            footer={[
                <Button type="primary" color="blue" key="btnSave" onClick={() => console.log("saving")}>Save</Button>,
                <Button type="primary" color="red" key="btnClose" onClick={onClose}>Close</Button>
            ]}
        >
            <Form initialValues={product}>
                <Form.Item label="Name" name="name">
                    <Input />
                </Form.Item>
                <Form.Item label="Category" name="category">
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};
