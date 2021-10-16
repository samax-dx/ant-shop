import categories from "./Categories.json";
import { Table } from "antd";

export const Category = props => {
    return (<>
        <Table
            size="small"
            dataSource={categories}
            pagination={{ pageSize: 3 }}
            rowKey={"id"}
        >
            <Table.Column title="Category Name" dataIndex={"name"} />
            <Table.Column title="Category Label" dataIndex={"label"} />
        </Table>
    </>);
};
