import { useState } from "react";
import { Table, Button, Space, Select, Input } from "antd";

import reateplans from '../dummy-ds/rateplans.json';
import { RateplanEdit } from "./RateplanEdit";


export const Rateplan = props => {
    const [editing, setEditing] = useState(null);

    return (<>
        <hr />
        <Space size="large">
            <strong>Services</strong>
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
            <Button onClick={_ => setEditing({})} type="link" size="small">Add Rate-Plan</Button>
        </Space>
        <hr />
        <Table
            dataSource={reateplans}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            size="small"
            scroll={{x: 'max-content' }}
        >
            <Table.Column au dataIndex="id" title={() => "Plan ID"} />
            <Table.Column dataIndex="name" title={() => "Plan Nam"} />
            <Table.Column dataIndex="family" title={() => "family"} />
            <Table.Column dataIndex="currency" title={() => "currency"} />
            <Table.Column dataIndex="timezone" title={() => "timezone"} />
            <Table.Column dataIndex="created" title={() => "created"} />
            <Table.Column dataIndex="tech" title={() => "tech"} />
            <Table.Column dataIndex="description" title={() => "description"} />
            <Table.Column dataIndex="pulse" title={() => "pulse"} />
            <Table.Column dataIndex="roundDigit" title={() => "roundDigit"} />
            <Table.Column dataIndex="minimumDuration" title={() => "minimumDuration"} />
            <Table.Column dataIndex="uesLcrRatePlan" title={() => "uesLcrRatePlan"} />
            <Table.Column dataIndex="ambiguousDateHandling" title={() => "ambiguousDateHandling"} />
            <Table.Column dataIndex="fixedChargeDuration" title={() => "fixedChargeDuration"} />
            <Table.Column dataIndex="fixedChargeAmount" title={() => "fixedChargeAmount"} />
            <Table.Column dataIndex="billingSpan" title={() => "billingSpan"} />
            <Table.Column dataIndex="category" title={() => "category"} />
            <Table.Column dataIndex="subcategory" title={() => "subcategory"} />
            <Table.Column dataIndex="validationErrors" title={() => "validationErrors"} />
            <Table.Column dataIndex={undefined} title={() => "Actions"} fixed="right" render={(_, rateplan, i) => {
                return (<>
                    <Button onClick={() => setEditing(rateplan)} type="link">Edit</Button>
                    <Button onClick={_ => console.log("delete product")} type="link">Delete</Button>
                </>);
            }} />
        </Table>
        {editing && <RateplanEdit rateplan={editing} onClose={() => setEditing(null)} />}
    </>);
};
