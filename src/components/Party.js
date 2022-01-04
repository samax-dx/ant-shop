import { Space, Table } from "antd";
import useSWR from "swr";

export const Party = props => {
    const { data, error } = useSWR(
        "http://localhost:3005/ofbiz",
        url => {
            return fetch(url, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    method: "performFindParty",
                    params: {
                        firstName: "a"
                    }
                })
            }).then(res => {
                return res.ok ? res.json() : Promise.reject(res.status);
            });
        }
    );

    const parties = data && data.result ? (data.result.listIt || []) : [];

    return (<>
        <Space>
            <br />
        </Space>
        <Table
            size="small"
            dataSource={parties}
            pagination={{ pageSize: 3 }}
            rowKey={"partyId"}
            // locale={{ emptyText: error ? `[${error}]` : undefined }}
        >
            <Table.Column title="Party ID" dataIndex={"partyId"} />
            <Table.Column title="First Name" dataIndex={"firstName"} />
            <Table.Column title="Last Name" dataIndex={"lastName"} />
        </Table>
    </>);
};
