import { useState } from "react";
import { Table, Button, Space, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { menuMachine } from "../machines/menuMachine";
import { ProductEdit } from "./ProductEdit";
import { useActor } from "@xstate/react";


export const Product = props => {
    const [current, send] = useActor(menuMachine.state.context.actor);
    const [editing, setEditing] = useState(null);

    return (<>
        <Space>
            <Input.Search addonBefore="Product ID" onSearch={data => send({ type: "LOAD", data })} style={{ margin: "15px 0"}} enterButton />
        </Space>
        <Table
            dataSource={current.context.data || []}
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
        {editing && <ProductEdit product={editing} onClose={() => setEditing(null)} />}
    </>);
};
