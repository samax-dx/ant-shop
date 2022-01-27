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
                    .then(party => sendEditor({
                        type: "SET_VALID",
                        data: state.context.record
                    }))
                    .catch(({ errorFields: efl }) => efl.length && sendEditor({
                        type: "SET_INVALID",
                        data: {
                            code: "input_validation_error",
                            message: "\n" + partyEditForm
                                .getFieldsError()
                                .filter(v => v.errors.length)
                                .map(v => `${v.name}: ${v.errors.join(" | ")}`)
                                .join("\n")
                        }
                    }))
            );

            state.matches("isSaving") && (console.log(state.context) || sendSaver({
                type: "LOAD", data: state.context.record
            }));
        });

        saveActor.subscribe(state => {
            state.matches("hasResult") && sendEditor({
                type: "SAVE_SUCCESS", data: { partyId: state.context.result.partyId }
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
                <span>{party.partyId ? "Edit Party : " : "Enter Party Info"}</span>
                <Button
                    type="link"
                    onClick={() => {
                        party.partyId && sendParent({ type: "VIEW_ITEM", data: party });
                    }}
                    children={party.partyId && party.groupName}
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
                onChange={() => sendEditor({ type: "EDIT_RECORD", data: partyEditForm.getFieldsValue() })}
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
