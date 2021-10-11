import { Table } from "antd"
import products from './products.json';

export const Product = props => {
    return (
        <Table
            dataSource={products}
            rowKey="id"
            onRow={(data, index) => ({
                onClick: e => console.log(e)
            })}
            pagination={{ pageSize: 3 }}
        >
            <Table.Column title="Product" dataIndex="name" />
            <Table.Column title="Category" dataIndex="category" />
        </Table>
    );
};
