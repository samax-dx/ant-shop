import { useState } from "react";
import { Table, Button, Space } from "antd";

import reateplans from './rateplans.json';
import { RateplanEdit } from "./RateplanEdit";


export const Rateplan = props => {
    const [editing, setEditing] = useState(null);

    return (<>
        <Table
            dataSource={reateplans}
            rowKey="id"
            pagination={{ pageSize: 3 }}
            size="small"
        >
            <Table.Column dataIndex="name" title={() => {
                return (<Space>
                    Product 
                    <Button onClick={_ => setEditing({})} type="primary" size="small" style={{ verticalAlign: "middle", border: "none", borderRadius: "3px" }}>Add</Button>
                </Space>);
            }} />
            <Table.Column dataIndex="category" title={() => "Category"} />
            <Table.Column dataIndex={undefined} title={() => "Actions"} render={(_, product, i) => {
                return (<>
                    <Button onClick={() => setEditing(product)} type="link">Edit</Button>
                    <Button onClick={_ => console.log("delete product")} type="link">Delete</Button>
                </>);
            }} />
        </Table>
        {editing && <RateplanEdit rateplan={editing} onClose={() => setEditing(null)} />}
    </>);
};
