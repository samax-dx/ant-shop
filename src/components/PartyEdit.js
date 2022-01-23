import { useEffect } from "react";
import { useActor } from "@xstate/react";
import { Button, Modal, Form, Input } from "antd";


export const PartyEdit = ({ actor: [editActor, saveActor] }) => {
    const [editState, sendEditor] = useActor(editActor);
    const [saveState, sendSaver] = useActor(saveActor);
    const [_parent, sendParent] = useActor(editActor.parent);

    const [partyEditForm] = Form.useForm();
    const { record: party } = editState.context;

    useEffect(() => {
        editState.matches("isValidating") && (
            partyEditForm
                .validateFields()
                .then(party => sendEditor({ type: "SET_VALID" }))
                .catch(errorInfo => {
                    if (errorInfo.errorFields.length) {
                        sendEditor({ type: "SET_INVALID" });
                    }
                })
        );
        editState.matches("isSaving") && sendSaver({
            type: "LOAD", data: party
        });
        saveState.matches("hasResult") && sendEditor({
            type: "SAVE_SUCCESS", data: saveState.context.result
        });
        saveState.matches("hasError") && sendEditor({
            type: "SAVE_FAILURE", data: saveState.context.error
        });
    });

    return (
        <Modal
            title={party.partyId ? `Edit Party : ${party.groupName}` : "Enter Party Info"}
            visible={true}
            closable={false}
            keyboard={false}
            footer={[
                <Button
                    type="primary"
                    key="btnSave"
                    onClick={() => sendEditor({ type: "SAVE_RECORD" })}
                    disabled={["didSave", "isSaving", "hasInvalidChanges"].includes(editState.value)}
                    children={"Save"}
                />,
                <Button
                    type="primary"
                    danger
                    key="btnClose"
                    onClick={() => sendParent({ type: "VIEW_LIST" })}
                    children={["isValidating", "hasValidChanges", "hasInvalidChanges"].includes(editState.value) ? "Revert Changes & Exit" : "Close"}
                />
            ]}
        >
            <Form
                form={partyEditForm}
                initialValues={party}
                onChange={() => sendEditor({ type: "EDIT_RECORD" })}
            >
                <Form.Item label="ID" name="partyId">
                    <Input />
                </Form.Item>
                <Form.Item label="Name" name="groupName" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};
