import { useEffect } from "react";
import { useActor } from "@xstate/react";
import { Button, Form, Input, Pagination, Space, Table } from "antd";


export const PartyList = ({ actor }) => {
    const [searchForm] = Form.useForm();

    const [listState, sendList] = useActor(actor);
    const [parentState, sendParent] = useActor(actor.parent);

    const performSearch = (queryData, page, limit) => {
        queryData["limit"] = limit;
        queryData["page"] = page;

        const data = ["name", "username"].reduce((acc, v) => {
            const field = v;
            const fieldOp = `${field.replace("_value", "")}_op`;
            const fieldValue = (acc[field] || "").trim();

            if (fieldValue === "") {
                delete acc[field];
                delete acc[fieldOp];
            } else {
                acc[field] = fieldValue;
            }

            return acc;
        }, queryData);
        Object.entries(data).length > 2 && sendList({ type: "LOAD", data });
    };

    const listResult = listState.context.result || { parties: [], count: 0 };
    const listPayload = listState.context.payload;
    const listError = listState.context.error;

    useEffect(() => {
        if (listState.matches("idle")) {
            if (listResult.count > 0 && listResult.parties.length === 0) {
                listState.context.payload.data.page--;
                sendList({ ...listState.context.payload, type: "LOAD" });
            }
        }
    }, [listState]);

    return (<>
        <Space><br /></Space>
        <Form form={searchForm} labelCol={{ span: 3 }} wrapperCol={{ span: 7 }} labelAlign="left">
            <Form.Item name="username" label="User ID" children={<Input />} />
            <Form.Item name="username_op" initialValue={"contains"} hidden children={<Input />} />
            <Form.Item name="name" label="Name" children={<Input />} />
            <Form.Item name="name_op" initialValue={"contains"} hidden children={<Input />} />
            <Form.Item wrapperCol={{ offset: 3 }}>
                <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => performSearch(searchForm.getFieldsValue(), 1, listPayload.data.limit)}
                    children={"Search"}
                />
            </Form.Item>
        </Form>
        <Table
            size="small"
            dataSource={listResult.parties}
            rowKey={"partyId"}
            locale={{ emptyText: listError && `[ ${listError.message} ]` }}
            pagination={false}
        >
            <Table.Column
                dataIndex={undefined}
                title={"#"}
                render={(_, __, i) => (listPayload.data.page - 1) * listPayload.data.limit + (++i)}
            />

            <Table.Column
                title="User ID"
                dataIndex={undefined}
                render={(_, party, i) => {
                    return (
                        <Button onClick={() => sendParent({ type: "VIEW_ITEM", data: party })} type="link">{party.username}</Button>
                    );
                }}
            />

            <Table.Column title="Name" dataIndex={"name"} />

            <Table.Column
                title="Contact Number"
                dataIndex={undefined}
                render={(_, party, i) => (<span>
                    {["contactMech.countryCode", "contactMech.areaCode", "contactMech.contactNumber"].map(x => party[x] || "").join(" ")}
                </span>)}
            />

            <Table.Column
                dataIndex={undefined}
                title={() => (<Space>
                    <span>Actions: </span>
                    <Button
                        onClick={_ => sendParent({ type: "ADD_ITEM", data: {} })}
                        type="primary"
                        size="small"
                        style={{ verticalAlign: "middle", border: "none", borderRadius: "3px" }}
                        children={"Add Party"}
                    />
                </Space>)}
                render={(_, party, i) => (<>
                    <Button onClick={() => sendParent({ type: "EDIT_ITEM", data: party })} type="link" disabled>Edit</Button>
                    <Button onClick={_ => console.log("delete party")} type="link" disabled>Delete</Button>
                </>)}
            />
        </Table>
        <hr />
        <Space align="end" direction="vertical">
            <Pagination
                total={listResult.count}
                defaultPageSize={10}
                pageSizeOptions={["10", "20", "50", "100", "200"]}
                showSizeChanger={true}
                onChange={(page, limit) => performSearch(searchForm.getFieldsValue(), page, limit)}
                current={listPayload.data.page}
            />
        </Space>
    </>);
};

// <Input.Search addonBefore="User ID" name="username" onSearch={data => send({ type: "LOAD", data })} style={{ margin: "15px 0" }} enterButton />
