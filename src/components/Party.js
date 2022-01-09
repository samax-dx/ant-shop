import { Button, Input, Space, Table } from "antd";
import { useState } from "react";
import { useActor } from "@xstate/react";
import { menuMachine } from "../machines/menuMachine";

export const Party = props => {
    const [{ context }, send] = useActor(menuMachine.state.context.actor);
    const [editing, setEditing] = useState(null);

    const parties = context.result || [];
    const error = context.error;

    return (<>
        <Space>
            <Input.Search addonBefore="Name" onSearch={data => send({ type: "LOAD", data })} style={{ margin: "15px 0" }} enterButton />
        </Space>
        <Table
            size="small"
            dataSource={parties}
            pagination={{ pageSize: 3 }}
            rowKey={"partyId"}
            locale={{ emptyText: error && `[ ${error.message} ]` }}
        >
            <Table.Column
                dataIndex={undefined}
                title={"#"}
                render={(_, __, i) => i}
            />

            <Table.Column title="ID" dataIndex={"partyId"} />
            <Table.Column title="Name" dataIndex={"groupName"} />

            <Table.Column
                dataIndex={undefined}
                title={() => (<Space>
                    <span>Actions: </span>
                    <Button
                        onClick={_ => setEditing({})}
                        type="primary"
                        size="small"
                        style={{ verticalAlign: "middle", border: "none", borderRadius: "3px" }}
                        children={"Add Party"}
                    />
                </Space>)}
                render={(_, party, i) => (<>
                    <Button onClick={() => setEditing(party)} type="link">Edit</Button>
                    <Button onClick={_ => console.log("delete party")} type="link">Delete</Button>
                </>)}
            />
        </Table>
        {editing && <Space PartyEdit={""} product={editing} onClose={() => setEditing(null)} />}
    </>);
};
