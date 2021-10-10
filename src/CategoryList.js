import { Table } from "antd";

export const CategoryList = props => {
    const categories = ["Food", "Cosmetics", "Electronics", "Sports"].map(
        (cat, i) => ({ id: ++i, name: cat, key: i, productCount: i % 2 === 0 ? i * 2 : i * 3 })
    );

    return (
        <Table dataSource={categories} key="id">
            <Table.Column title="Product Categories" dataIndex="name" />
            <Table.Column title="Product Count" dataIndex="productCount" />
        </Table>
    );
};