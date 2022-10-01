import { useEffect, useState } from "react";
import {
    Form,
    Input,
    Button,
    Table,
    Space,
    Pagination,
    DatePicker,
    notification,
    Collapse,
    Card,
    Select,
    Row,
    Col,
    Modal, Typography
} from "antd";
import { useActor } from "@xstate/react";
import { Br } from "./Br";

import { Prefix as PrefixSvc } from "../services/Prefix";
import { Route as RouteSvc } from "../services/Route";
import {PlusCircleFilled} from "@ant-design/icons";


const SearchForm = ({ onSearch }) => {
    const [searchForm] = Form.useForm();

    const performSearch = () => {
        const formData = searchForm.getFieldsValue();

        // ["date_fld0_value", "date_fld1_value"].forEach((n, i) => {
        //     const date = formData[n];
        //     formData[n] = date ? dayjs(date).add(i, "day").format("YYYY-MM-DD") : "";
        // });

        const queryData = ["senderId"].reduce((acc, v) => {
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
            labelCol={{span: 18}}
            wrapperCol={{ span: 23}}
            labelAlign="left"
            //layout={"horizontal"}

        >
            <Form.Item style={{display:"inline-block",marginBottom:'0px'}} name="senderId" label="Sender-ID" children={<Input />} />
            <Form.Item name="senderId_op" initialValue={"contains"} hidden children={<Input />} />
            <Form.Item style={{display:'inline-block', marginBottom:0}} label=" " colon={false}>
                <Button
                    type="primary"
                    htmlType="submit"
                    onClick={performSearch}
                    children={"Search"}
                />
            </Form.Item>
        </Form>
    </>);
};

const EditForm = ({ form, record, onSave, prefixes, routes }) => {
    const [editForm] = Form.useForm(form);

    return (<>
        <Form
            form={editForm}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            labelAlign={"left"}
            initialValues={record}
            style={{
                padding:'15px'
            }}
        >
            <Form.Item name="senderIdId" label="Prefix" rules={[{ required: true }]}>
                <Select showSearch allowClear style={{ minWidth: 150 }}>
                    {prefixes.map((v, i) => <Select.Option value={v.prefixId} key={i}>{v.prefixId}</Select.Option>)}
                </Select>
            </Form.Item>

            <Form.Item name="senderId" label="Route" rules={[{ required: true }]}>
                <Select showSearch allowClear style={{ minWidth: 150 }}>
                    {routes.map((v, i) => <Select.Option value={v.senderId} key={i}>{v.senderId}</Select.Option>)}
                </Select>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8 }}>
                <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => editForm
                        .validateFields()
                        .then(_ => onSave(editForm.getFieldsValue()))
                        .catch(_ => { })
                    }
                    children={"Submit"}
                />
            </Form.Item>
        </Form>
    </>);
};

const DataView = ({ context, viewPage, viewLimit, onView, onEdit, onDelete }) => {
    const viewResult = context.result;
    const viewError = context.error;

    return (<>
        <Table
            style={{marginLeft:6}}
            size="small"
            dataSource={viewResult.senderIds}
            rowKey={senderId => senderId.senderIdId + senderId.senderId}
            locale={{ emptyText: viewError && `[ ${viewError.message || "Fetch Error"} ]` }}
            pagination={false}
        >
            <Table.Column
                dataIndex={undefined}
                title={"#"}
                render={(_, __, i) => (viewPage - 1) * viewLimit + (++i)}
            />

            <Table.Column
                title="Prefix"
                dataIndex={undefined}
                render={(_, senderId, i) => {
                    return (
                        <Button onClick={() => onView(senderId)} type="link">{senderId.senderIdId}</Button>
                    );
                }}
            />

            <Table.Column title="Route" dataIndex={"senderId"} />
            <Table.Column title="Priority" dataIndex={"priority"} />
            <Table.Column title="Egress Prefix" dataIndex={"egressPrefix"} />
            <Table.Column title="Digit Cut" dataIndex={"digitCut"} />

            <Table.Column
                title="Actions"
                dataIndex={undefined}
                render={(_, senderId, i) => {
                    return (
                        <Button onClick={() => onEdit(senderId)} type="link">Edit</Button>
                    );
                }}
            />
        </Table>
    </>);
};

const DataPager = ({ totalPagingItems, currentPage, onPagingChange }) => {
    return (<>
        <Space align="end" direction="vertical" style={{ width: "100%" }}>
            <Pagination
                total={totalPagingItems}
                defaultPageSize={10}
                pageSizeOptions={["10", "20", "50", "100", "200"]}
                showSizeChanger={true}
                onChange={onPagingChange}
                current={currentPage}
            />
        </Space>
    </>);
};

export const SenderIdManager = () => {

    let totalPagingItems;
    let onPagingChange;
    let currentPage;
    return (<>
        <>
            <Space align="end" direction="vertical" style={{ width: "100%" }}>
                <Pagination
                    total={totalPagingItems}
                    defaultPageSize={10}
                    pageSizeOptions={["10", "20", "50", "100", "200"]}
                    showSizeChanger={true}
                    onChange={onPagingChange}
                    current={currentPage}
                />
            </Space>
        </>
    </>);
};
