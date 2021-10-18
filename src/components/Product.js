import { useState } from "react";
import { Table, Button } from "antd";

import products from './products.json';
import { ProductEdit } from "./ProductEdit";


export const Product = props => {
    const [isEditing, setEditing] = useState(false);
    const [isAdding, setAdding] = useState(false);

    return (<>
        <Table
            dataSource={products}
            rowKey="id"
            pagination={{ pageSize: 3 }}
            size="small"
            footer={() => ([
                <>
                    <Button onClick={_ => setAdding(true)} type="primary" key="btnAddRow">Add Product</Button>
                    {isAdding && <ProductEdit product={{}} onClose={() => setAdding(false)} />}
                </>
            ])}
        >
            <Table.Column title="Product" dataIndex="name" />
            <Table.Column title="Category" dataIndex="category" />
            <Table.Column title="Actions" render={(_, product, i) => {
                return (<>
                    <Button onClick={() => setEditing(true)} type="link">Edit</Button>
                    {isEditing && <ProductEdit product={product} onClose={() => setEditing(false)} />}
                    <Button onClick={_ => console.log("delete product")} type="link">Delete</Button>
                </>);
            }} />
        </Table>
    </>);
};
