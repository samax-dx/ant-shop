import { useEffect, useState } from "react";
import { useActor } from "@xstate/react";
import { Col, Row, Form, Input, Button, Table, Space, Pagination, Typography, Divider, Select, notification, DatePicker, InputNumber, Modal, Spin, Card, Collapse } from "antd";
import { Br } from "./Br";
import dayjs from "dayjs";
import { SearchOutlined } from "@ant-design/icons";
import { PartyPicker } from "./Parties";


const SearchForm = ({ onSearch }) => {
    const [searchForm] = Form.useForm();

    const performSearch = () => {
        const formData = searchForm.getFieldsValue();

        ["date_fld0_value", "date_fld1_value"].forEach((n, i) => {
            const date = formData[n];
            formData[n] = date ? dayjs(date).add(i, "day").format("YYYY-MM-DD") : "";
        });

        const queryData = ["partyLoginId", "partyName", "date_fld0_value", "date_fld1_value"].reduce((acc, v) => {
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
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            labelAlign="left"
        >
            <Form.Item name="partyLoginId" label="User ID" children={<Input />} />
            <Form.Item name="partyLoginId_op" initialValue={"contains"} hidden children={<Input />} />
            <Form.Item name="partyName" label="Party Name" children={<Input />} />
            <Form.Item name="partyName_op" initialValue={"contains"} hidden children={<Input />} />
            <Form.Item name="date_fld0_value" label="From Date" children={<DatePicker format={"MMM D, YYYY"} />} />
            <Form.Item name="date_fld0_op" initialValue={"greaterThanEqualTo"} hidden children={<Input />} />
            <Form.Item name="date_fld1_value" label="To Date" children={<DatePicker format={"MMM D, YYYY"} />} />
            <Form.Item name="date_fld1_op" initialValue={"lessThanEqualTo"} hidden children={<Input />} />
            <Form.Item wrapperCol={{ offset: 4 }}>
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

const EditForm = ({ form, record, onSave, onFindParty }) => {
    const [editForm] = Form.useForm(form);

    return (<>
        <Form
            form={editForm}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            labelAlign={"left"}
        >
            <Form.Item label="Party ID" required style={{ marginBottom: 0 }}>
                <Space align="start">
                    <Form.Item name="partyId" rules={[{ required: true }]}>
                        <Input style={{ width: "150px" }} />
                    </Form.Item>
                    <Button onClick={onFindParty} children={<SearchOutlined />} />
                </Space>
            </Form.Item>

            <Form.Item name="amount" label="Amount" rules={[{ required: true }]} children={<InputNumber style={{ width: "150px" }} />} />

            <Form.Item wrapperCol={{ offset: 6 }}>
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
            size="small"
            dataSource={viewResult.payments}
            rowKey={"paymentId"}
            locale={{ emptyText: viewError && `[ ${viewError.message} ]` }}
            pagination={false}
        >
            <Table.Column
                dataIndex={undefined}
                title={"#"}
                render={(_, __, i) => (viewPage - 1) * viewLimit + (++i)}
            />

            <Table.Column
                title="Payment ID"
                dataIndex={undefined}
                render={(_, payment, i) => {
                    return (
                        <Button onClick={() => onView(payment)} type="link">{payment.paymentId}</Button>
                    );
                }}
            />

            <Table.Column title="User Id" dataIndex={"partyLoginId"} />
            <Table.Column title="Party Name" dataIndex={"partyName"} />
            <Table.Column title="Date" dataIndex={"date"} render={value => dayjs(value).format("MMM D, YYYY - hh:mm A")} />
            <Table.Column title="Amount" dataIndex={"amount"} />
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

export const Payments = ({ actor: [lookupActor, saveActor, partyActor] }) => {
    const [lookupState, sendLookupOrig] = useActor(lookupActor);
    const [saveState, sendSave] = useActor(saveActor);
    const [editForm] = Form.useForm();
    const [choosingParty, setChoosingParty] = useState(false);

    const [saving, setSaving] = useState(false);

    const sendLookup = payload => {
        Object.assign(payload.data, { statusId: "PMNT_CONFIRMED" });
        sendLookupOrig(payload);
    };

    const sendPagedQuery = queryData => (page, limit) => {
        page === undefined && (page = queryData.page)
        limit === undefined && (limit = queryData.limit)
        console.log(queryData, page, limit);

        const query = { data: { ...queryData, page, limit }, type: "LOAD" };
        return sendLookup(query);
    };

    const saveRecord = data => {
        console.log(data);
        return sendSave({ data, type: "LOAD" });
    };

    useEffect(() => sendPagedQuery(lookupState.context.payload.data)(), []);

    useEffect(() => {
        saveActor.subscribe(state => {
            const lookupContext = lookupActor.getSnapshot().context;
            const saveContext = saveActor.getSnapshot().context;

            if (state.matches("hasResult")) {
                sendPagedQuery({ ...lookupContext.payload.data, orderBy: "date DESC" })();

                notification.success({
                    key: `cpmnt_${Date.now()}`,
                    message: "Task Complete",
                    description: <>Account credited. Payment ID: {saveContext.result.paymentId}</>,
                    duration: 5
                });

                editForm.resetFields();
                setSaving(false);
            }

            if (state.matches("hasError")) {
                notification.error({
                    key: `cpmnt_${Date.now()}`,
                    message: "Task Failed",
                    description: <>Payment failed.<br />{state.context.error.message}</>,
                    duration: 5
                });
                setSaving(false);
            }
        });
    }, [editForm]);

    useEffect(() => {
        if (lookupState.matches("idle")) {
            if (lookupState.context.result.count > 0 && lookupState.context.result.payments.length === 0) {
                lookupState.context.payload.data.page--;
                sendLookup({ ...lookupState.context.payload, type: "LOAD" });
            }
        }
    }, [lookupState]);

    const onClickView = data => console.log("view", data);
    const onClickEdit = data => console.log("edit", data);
    const onClickDelete = data => console.log("delete", data);

    const viewContext = lookupState.context;

    const viewPage = viewContext.payload.data.page;
    const viewLimit = viewContext.payload.data.limit;

    return (<>
        <Row>
            {/* <Col md={14}>
                <Typography.Text strong>Find TopUp / Payments</Typography.Text>
                <Br />
                <SearchForm onSearch={data => sendPagedQuery(data)(1, viewLimit)} />
            </Col>
            <Col md={10} pull={2}>
                <Typography.Text strong>TopUp / Make Payment</Typography.Text>
                <Br />
                <EditForm form={editForm} record={{}} onSave={data => setSaving(true) || saveRecord(data)} onFindParty={() => setChoosingParty(true)} />
                <Br />
            </Col> */}
            <Col md={10}>
                <Card title="Find TopUp / Payments">
                    <SearchForm onSearch={data => sendPagedQuery(data)(1, viewLimit)} />
                </Card>
            </Col>
            <Col md={11} push={1}>
                <Collapse>
                    <Collapse.Panel header="TopUp / Make Payment" key="recordEditor">
                        <EditForm form={editForm} record={{}} onSave={data => setSaving(true) || saveRecord(data)} onFindParty={() => setChoosingParty(true)} />
                    </Collapse.Panel>
                </Collapse>
            </Col>
        </Row>
        <Br />
        <DataView context={viewContext} onView={onClickView} onEdit={onClickEdit} onDelete={onClickDelete} viewPage={viewPage} viewLimit={viewLimit} />
        <Br />
        <DataPager totalPagingItems={viewContext.result.count} currentPage={viewPage} onPagingChange={sendPagedQuery(viewContext.payload.data)} />
        <Modal visible={choosingParty} footer={null} onCancel={() => setChoosingParty(false)} width={"90vw"}>
            <PartyPicker actor={partyActor} onPicked={({ partyId }) => setChoosingParty(false) || editForm.setFieldsValue({ partyId })} />
        </Modal>
        <Modal visible={saving} footer={null} closable="false" maskClosable={false}>
            <Spin tip="Sending Request" />
        </Modal>
    </>);
};
