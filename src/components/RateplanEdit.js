import { Button, Modal, Form, Input } from "antd";

export const RateplanEdit = ({ rateplan, onClose }) => {
    return (
        <Modal
            title={rateplan.id ? `Edit ${rateplan.name}` : "Enter Partner Info"}
            visible={true}
            onCancel={onClose}
            footer={[
                <Button type="primary" color="blue" key="btnSave" onClick={() => console.log("saving")}>Save</Button>,
                <Button type="primary" color="red" key="btnClose" onClick={onClose}>Close</Button>
            ]}
        >
            <Form initialValues={rateplan}>
                <Form.Item label="ID" name="id" hidden={true}>
                    <Input />
                </Form.Item>
                <Form.Item label="Name" name="name">
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};
