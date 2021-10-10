import { Table, Button } from "antd";

const CategoryActions = ({ categoryId }) => {
    return (
        <div>
            <Button type="link" title="delete" />
        </div>
    );
};

export const CategoryList = props => {
    const categories = ["Food", "Cosmetics", "Electronics", "Sports"].map(
        (cat, i) => ({ id: ++i, name: cat, productCount: i % 2 === 0 ? i * 2 : i * 3 })
    );

    return (
        <Table
            dataSource={categories}
            rowKey="id"
            onRow={(data, index) => ({
                onClick: e => console.log(e)
            })}
            pagination={{pageSize: 3, current: 1}}
        >
            <Table.Column title="Product Categories" dataIndex="name" />
            <Table.Column title="Product Count" dataIndex="productCount" />
            <Table.Column title="Actions" children={<CategoryActions />}/>
        </Table>
    );
};