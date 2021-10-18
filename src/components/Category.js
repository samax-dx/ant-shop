import { Table } from "antd";
import useSWR from "swr";

export const Category = props => {
    const { data: categories, error } = useSWR(
        "http://localhost:5000/category",
        (...args) => fetch(...args).then(res => res.json())
    );

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
