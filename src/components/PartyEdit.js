import { useEffect } from "react";
import { useActor } from "@xstate/react";
import { Button, Modal, Form, Input, Select, Space, Alert } from "antd";
import { countries } from "countries-list";


export const PartyEdit = ({ actor: [editActor, saveActor] }) => {
    const [partyEditForm] = Form.useForm();

    const [editState, sendEditor] = useActor(editActor);
    const [saveState, sendSaver] = useActor(saveActor);
    const [parentState, sendParent] = useActor(editActor.parent);

    useEffect(() => {
        editActor.subscribe(state => {
            state.matches("isValidating") && (
                partyEditForm
                    .validateFields()
                    .then(party => (
                        sendEditor({
                            type: "SET_VALID",
                            data: state.context.record
                        })
                    ))
                    .catch(({ errorFields: efl }) => efl.length && sendEditor({
                        type: "SET_INVALID",
                        data: {
                            code: "input_validation_error",
                            // message: "\n" + partyEditForm
                            //     .getFieldsError()
                            //     .filter(v => v.errors.length)
                            //     .map(v => `${v.name}: ${v.errors.join(" | ")}`)
                            //     .join("\n")
                            message: ""
                        }
                    }))
            );

            state.matches("isSaving") && sendSaver({
                type: "LOAD", data: state.context.record
            });
        });

        saveActor.subscribe(state => {
            state.matches("hasResult") && sendEditor({
                type: "SAVE_SUCCESS", data: { id: state.context.result.id }
            });

            state.matches("hasError") && sendEditor({
                type: "SAVE_FAILURE", data: {}
            });
        });
    }, []);

    const { record: party } = editState.context;

    return (
        <Modal
            title={<>
                <span>{party.id ? `Edit Party : ` : "Enter Party Info"}</span>
                <Button
                    type="link"
                    onClick={() => {
                        party.id && sendParent({ type: "VIEW_ITEM", data: party });
                    }}
                    children={party.id && party.username}
                />
            </>}
            visible={true}
            closable={false}
            keyboard={false}
            footer={[
                <Button
                    type="primary"
                    key="btnSave"
                    onClick={() => sendEditor({ type: "SAVE_RECORD" })}
                    disabled={["didSave", "isEditing", "isValidating", "isSaving", "hasInvalidChanges"].some(editState.matches)}
                    children={"Save"}
                />,
                <Button
                    type="primary"
                    danger
                    key="btnClose"
                    onClick={() => sendParent({ type: "VIEW_LIST" })}
                    children={["isEditing", "isValidating", "hasValidChanges", "hasInvalidChanges"].some(editState.matches) ? "Revert Changes & Exit" : "Close"}
                />
            ]}
            width={600}
        >
            <Form
                form={partyEditForm}
                initialValues={party}
                onChange={() => sendEditor({
                    type: "EDIT_RECORD",
                    data: partyEditForm.getFieldsValue()
                })}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
            >
                <Form.Item label="ID" name="id" style={{ display: "none" }}>
                    <Input />
                </Form.Item>
                <Form.Item label="User ID" name="username" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Contact Number">
                    <Space direction="horizontal" align="start">
                        <Form.Item
                            name="contactMech.countryCode"
                            rules={[{ required: true }]}
                            style={{ margin: 0 }}
                        >
                            <Select
                                showSearch
                                placeholder="country"
                                optionFilterProp="children"
                                filterOption={true}
                                allowClear={true}
                            >
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
                            <Input placeholder="area code" />
                        </Form.Item>
                        <Form.Item name="contactMech.contactNumber" rules={[{ required: true }]}>
                            <Input placeholder="Phone Number" />
                        </Form.Item>
                    </Space>
                </Form.Item>
                {party.id && <Form.Item
                    label="Current Password"
                    name="password_old"
                    rules={[{ required: true }]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>}
                <Form.Item
                    label={party.id ? "New password" : "Password"}
                    name="password"
                    rules={[{ required: true }]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="Confirm Password"
                    name="passwordConfirm"
                    dependencies={party.id ? ['password_old', 'password'] : ["password"]}
                    hasFeedback
                    rules={[
                        { required: true },
                        ({ getFieldValue }) => ({
                            validator: (_, value) => {
                                const password = getFieldValue("password");
                                const passwordOld = getFieldValue("passwordOld");
                                if (password === value && password != passwordOld) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Passwords do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
            </Form>
            {saveState.context.error && <Alert type="error" message={saveState.context.error.message} />}
        </Modal>
    );
};
