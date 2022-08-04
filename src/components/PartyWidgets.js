import {Button, Form, Input, Space, Table} from "antd";
import {useRef, useState} from "react";

export const PartySearchForm = ({ onSearch }) => {
    const [searchForm] = Form.useForm();

    const performSearch = () => {
        const formData = searchForm.getFieldsValue();

        const queryData = ["name", "loginId"].reduce((acc, v) => {
            const field = v;
            const fieldOp = `${field.replace("_value", "")}_op`;
            const fieldValue = (acc[field] || "").trim();

            if (fieldValue === "") {
                delete acc[field];
                delete acc[fieldOp];
            } else {
                acc[field] = fieldValue;
            }

            return acc;
        }, formData);
        onSearch(queryData);
    };

    return (<>
        <Form
            form={searchForm}
            labelCol={{ span: 10}}
            wrapperCol={{ span: 23}}
            labelAlign="left"
        >
            <Space>
                <Form.Item style={{display:'inline-block'}}  name="loginId" label="User ID" children={<Input />} />
                <Form.Item name="loginId_op" initialValue={"contains"} hidden children={<Input />} />
                <Form.Item style={{display:'inline-block'}} name="name" label="Name" children={<Input />} />
                <Form.Item name="name_op" initialValue={"contains"} hidden children={<Input />} />

                <Form.Item colon={false} style={{display:'inline-block'}} label=' '
                           children={
                               <Button
                                   type="primary"
                                   htmlType="submit"
                                   onClick={performSearch}
                                   children={"Search"}
                               />
                           }
                />

            </Space>
        </Form>
    </>);
};


export const PartyDataView = ({ context, viewPage, viewLimit, onView, onEdit, onDelete }) => {
    const viewResult = context.result;
    const viewError = context.error;
    const [amount, setAmount] = useState(0);
    const inputRef = useRef(null);

    return (<>
        <Table
            style={{marginLeft:5}}
            size="small"
            dataSource={viewResult.parties}
            rowKey={"partyId"}
            locale={{ emptyText: viewError && `[ ${viewError.message} ]` }}
            pagination={false}
        >
            <Table.Column
                dataIndex={undefined}
                title={"#"}
                render={(_, __, i) => (viewPage - 1) * viewLimit + (++i)}
            />

            <Table.Column
                title="User ID"
                dataIndex={undefined}
                render={(_, party, i) => {
                    return (
                        <Button onClick={() => onView(party)} type="link">{party.loginId}</Button>
                    );
                }}
            />

            <Table.Column title="Name" dataIndex={"name"} />

            <Table.Column
                title="Contact Number"
                dataIndex={undefined}
                render={(_, party, i) => (<span>
                    {["contactMech.countryCode", "contactMech.areaCode", "contactMech.contactNumber"].map(x => party[x] || "").join(" ")}
                </span>)}
            />

            <Table.Column
                dataIndex={undefined}
                title={"Pay Amount"}
                render={(_, party, i) => (<>
                    <Input style={{display:"inline-block"}} ref={inputRef} onChange={e => setAmount(e.target.value)} placeholder="Write amount"/>
                    <Button style={{display:"inline-block"}} type="link" onClick={() => onView({partyId: party.partyId, amount: isNaN(amount) ? 0 : +amount }) || (inputRef.current.value="")}>Add Payment</Button>
                </>)}
            />
        </Table>
    </>);
};
