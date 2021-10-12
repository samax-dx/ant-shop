import { Table, Button } from "antd";
import { useActor } from "@xstate/react";

import { ProductEdit } from "./ProductEdit";
import { productEditMachine } from "../machines/productEditMachine";

import products from './products.json';


export const Product = props => {
    const [editorState, sendToEditor] = useActor(productEditMachine);

    const addProduct = _ => sendToEditor({ type: "EDIT_PRODUCT", product: {} });
    const editProduct = p => sendToEditor({ type: "EDIT_PRODUCT", product: p });
    const deleteProduct = () => { console.log("delete product") };

    return (<>
        <Table
            dataSource={products}
            rowKey="id"
            pagination={{ pageSize: 3 }}
            footer={() => ([
                <Button type="primary" onClick={addProduct} key="btnAddRow">Add Product</Button>
            ])}
        >
            <Table.Column title="Product" dataIndex="name" />
            <Table.Column title="Category" dataIndex="category" />
            <Table.Column title="Actions" render={(_, product, i) => {
                return (<>
                    <Button type="link" onClick={() => editProduct(product)}>Edit</Button>
                    <Button type="link" onClick={() => deleteProduct()}>Delete</Button>
                </>);
            }} />
        </Table>
        {editorState.value === "inactive" || <ProductEdit />}
    </>);
};
