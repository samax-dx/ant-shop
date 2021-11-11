import { Space, Table } from "antd";
import useSWR from "swr";

export const Category = props => {
    const { data: categories, error } = useSWR(
        "http://localhost:5000/category",
        (...args) => fetch(...args).then(res => res.ok ? res.json() : Promise.reject(res.status))
    );

    return (<>
        <Space>
            <br />
        </Space>
        <Table
            size="small"
            dataSource={categories}
            pagination={{ pageSize: 3 }}
            rowKey={"id"}
            locale={{ emptyText: error ? `[${error}]` : undefined }}
        >
            <Table.Column title="Category Name" dataIndex={"name"} />
            <Table.Column title="Category Label" dataIndex={"label"} />
        </Table>
    </>);
};
