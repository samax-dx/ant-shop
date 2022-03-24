import { useActor } from "@xstate/react";
import { Button, Form, Input, Modal, Select, Space, Table } from "antd";
import { countries } from "countries-list";

export const PartyView = ({ actor }) => {
    const [vmState, send] = useActor(actor);
    const [parentState, sendParent] = useActor(actor.parent);

    const { party } = vmState.context;
    const onClose = () => sendParent({ type: "VIEW_LIST" });

    return (
        <Modal
            title={`Party : ${party.username}`}
            visible={true}
            onCancel={onClose}
            footer={[
                <Button type="primary" key="btnSave" onClick={() => sendParent({ type: "EDIT_ITEM", data: party })}>Edit</Button>,
                <Button type="primary" danger key="btnClose" onClick={onClose}>Close</Button>
            ]}
        >
            <Form
                initialValues={party}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
            >
                <Form.Item label="ID" name="id" style={{ display: "none" }}>
                    <Input readOnly />
                </Form.Item>
                <Form.Item label="User ID" name="username">
                    <Input readOnly />
                </Form.Item>
                <Form.Item label="Name" name="name">
                    <Input readOnly />
                </Form.Item>
                <Form.Item label="Contact Number">
                    <Space direction="horizontal" align="start">
                        <Form.Item name="contactMech.countryCode" style={{ margin: 0 }}>
                            <Select disabled>
                                {
                                    Object.values(countries).map(({ name, emoji, phone }) => {
                                        return (
                                            <Select.Option value={phone} key={emoji}>
                                                <Button type="link">{emoji}</Button> {name}
                                            </Select.Option>
                                        );
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item name="contactMech.areaCode">
                            <Input readOnly placeholder="area code" />
                        </Form.Item>
                        <Form.Item name="contactMech.contactNumber">
                            <Input readOnly placeholder="Phone Number" />
                        </Form.Item>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};
