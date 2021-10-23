import { useState } from "react";
import { Table, Button, Space } from "antd";

import products from './products.json';
import { ProductEdit } from "./ProductEdit";


export const Product = props => {
    const [editing, setEditing] = useState(null);

    return (<>
        <Table
            dataSource={products}
            rowKey="id"
            pagination={{ pageSize: 3 }}
            size="small"
        >
            <Table.Column dataIndex="name" title={() => {
                return (<Space>
                    Product 
                    <Button onClick={_ => setEditing({})} type="link" size="small" style={{ border: "1px dashed", padding: "0 5px", borderRadius: "2px", verticalAlign: "middle" }}>Add</Button>
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
