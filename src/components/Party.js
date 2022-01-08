import { Button, Input, Space, Table } from "antd";
import { useState } from "react";
import useSWR from "swr";

export const Party = props => {
    const { data, error } = useSWR(
        "http://localhost:3005/ofbiz",
        url => {
            return fetch(url, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    method: "performFind",
                    params: {
                        entityName: "PartyNameView",
                        inputFields: {
                            groupName: "a",
                            groupName_op: "contains"
                        }
                    }
                })
            }).then(res => {
                return res.ok ? res.json() : Promise.reject(res.status);
            });
        }
    );

    const parties = data && data.result ? (data.result.listIt || []) : [];
    const [editing, setEditing] = useState(null);

    return (<>
        <Space>
            <Input.Search addonBefore="Name" onSearch={data => console.log("send", ({ type: "LOAD", data }))} style={{ margin: "15px 0" }} enterButton />
        </Space>
        <Table
            size="small"
            dataSource={parties}
            pagination={{ pageSize: 3 }}
            rowKey={"partyId"}
            locale={{ emptyText: error ? `[${error}]` : undefined }}
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
