import { useEffect } from "react";
import { useActor } from "@xstate/react";
import { Button, Modal, Form, Input } from "antd";


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
                    .then(party => sendEditor({ type: "SET_VALID" }))
                    .catch(({ errorFields: fields }) => {
                        (fields.length) && sendEditor({ type: "SET_INVALID" });
                    })
            );

            state.matches("isSaving") && sendSaver({
                type: "LOAD", data: party
            });
        });

        saveActor.subscribe(state => {
            state.matches("hasResult") && (console.log(state.context) || sendEditor({
                type: "SAVE_SUCCESS", data: state.context.result
            }));

            state.matches("hasError") && (console.log(state.context) || sendEditor({
                type: "SAVE_FAILURE", data: state.context.error
            }));
        });
    }, []);

    const { record: party } = editState.context;

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
