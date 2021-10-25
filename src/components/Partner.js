import { useState } from "react";
import { Table, Button, Select, Input, Space } from "antd";

import partners from '../dummy-ds/partners.json';
import { PartnerEdit } from "./PartnerEdit";


export const Partner = props => {
    const [editing, setEditing] = useState(null);

    return (<>
        <hr />
        <Space size="large">
            <strong>Partners</strong>
            <Space>
                <span>Type: </span>
                <Select defaultValue={"all"} size="small" style={{width: 160}}>
                    <Select.Option value="all">All</Select.Option>
                    <Select.Option value="none" disabled={true}>None</Select.Option>
                </Select>
            </Space>
            <Space>
                <span>Name: </span>
                <Input type="text" value="" size="small" />
                <Button type="default" size="small">Find</Button>
            </Space>
            <Button onClick={_ => setEditing({})} type="link" size="small">Add Partners</Button>
        </Space>
        <hr />
        <Table
            dataSource={partners}
            rowKey="id"
            pagination={{ pageSize: 6 }}
            size="small"
            onRow={(data, index) => {
                data.account_name = data.accounts.map(a => a.name);
                data.account_amount = data.accounts.map(a => a.amount);
                data.account_uom = data.accounts.map(a => a.UOM);
            }}
        >
            <Table.Column dataIndex="id" title="Partner ID" />
            <Table.Column dataIndex="name" title="Partner Name" />
            <Table.Column dataIndex="type" title="Partner Type" />
            <Table.Column dataIndex="account_name" key="account_name" title="Account Name" render={(_, data, __) => data.account_name.map(name => <div>{name}</div>)} />
            <Table.Column dataIndex="account_amount" title="Amount" render={(_, data, __) => data.account_amount.map(amount => <div>{amount}</div>)} />
            <Table.Column dataIndex="account_uom" title="UOM" render={(_, data, __) => data.account_uom.map(uom => <div>{uom}</div>)} />
            <Table.Column dataIndex={undefined} title={() => "Actions"} render={(_, data, i) => {
                return (<>
                    <Button onClick={() => setEditing(data)} type="link">Edit</Button>
                    <Button onClick={_ => console.log("delete partner")} type="link">Delete</Button>
                </>);
            }} />
        </Table>
        {editing && <PartnerEdit partner={editing} onClose={() => setEditing(null)} />}
    </>);
};
