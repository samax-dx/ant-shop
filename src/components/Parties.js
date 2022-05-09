import { useEffect, useState } from "react";
import { useActor } from "@xstate/react";
import { Col, Row, Form, Input, Button, Table, Space, Pagination, Typography, Divider, Select, notification, Card, Collapse, Modal, Spin } from "antd";
import { Br } from "./Br";
import { countries } from "countries-list";


const SearchForm = ({ onSearch }) => {
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
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 7 }}
            labelAlign="left"
        >
            <Form.Item name="loginId" label="User ID" children={<Input />} />
            <Form.Item name="loginId_op" initialValue={"contains"} hidden children={<Input />} />
            <Form.Item name="name" label="Name" children={<Input />} />
            <Form.Item name="name_op" initialValue={"contains"} hidden children={<Input />} />
            <Form.Item wrapperCol={{ offset: 3 }}>
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

const EditForm = ({ form, record: party, onSave }) => {
    const [editForm] = Form.useForm(form);

    return (<>
        <Form
            form={editForm}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            labelAlign={"left"}
        >
            <Form.Item name="partyId" label="ID" style={{ display: "none" }} children={<Input />} />
            <Form.Item name="loginId" label="User ID" rules={[{ required: true }]} children={<Input />} />
            <Form.Item name="name" label="Name" rules={[{ required: true }]} children={<Input />} />

            <Form.Item label="Contact Number" required>
                <Space direction="horizontal" align="start">
                    <Form.Item
                        name="contactMech.countryCode"
                        rules={[{ required: true }]}
                        style={{ minWidth: "160px", margin: 0 }}
                    >
                        <Select
                            showSearch
                            placeholder="country"
                            optionFilterProp="children"
                            filterOption={true}
                            allowClear={true}
                        >
                            {
                                Object.values(countries).map(({ name, emoji, phone }) => {
                                    return (
                                        <Select.Option value={phone} key={phone}>
                                            {emoji}&nbsp;&nbsp;{name}
                                        </Select.Option>
                                    );
                                })
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item name="contactMech.areaCode" style={{ maxWidth: "85px" }} children={<Input placeholder="area code" />} />
                    <Form.Item name="contactMech.contactNumber" rules={[{ required: true }]} children={<Input placeholder="Phone Number" />} />
                </Space>
            </Form.Item>
            {party.partyId && <Form.Item
                name="password_old"
                label="Current Password"
                rules={[{ required: true }]}
                hasFeedback
            >
                <Input.Password />
            </Form.Item>}

            <Form.Item
                name="password"
                label={party.partyId ? "New password" : "Password"}
                rules={[{ required: true }]}
                hasFeedback
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                name="passwordConfirm"
                label="Confirm Password"
                dependencies={party.partyId ? ['password_old', 'password'] : ["password"]}
                hasFeedback
                rules={[
                    { required: true },
                    ({ getFieldValue }) => ({
                        validator: (_, value) => {
                            const password = getFieldValue("password");
                            const passwordOld = getFieldValue("passwordOld");
                            if (password === value && password != passwordOld) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Passwords do not match!'));
                        },
                    }),
                ]}
            >
                <Input.Password />
            </Form.Item>

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
                title={"Actions"}
                render={(_, party, i) => (<>
                    <Button onClick={() => onEdit(party)} type="link" disabled>Edit</Button>
                    <Button onClick={_ => onDelete(party)} type="link" disabled>Delete</Button>
                </>)}
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

export const Parties = ({ actor: [lookupActor, saveActor] }) => {
    const [lookupState, sendLookup] = useActor(lookupActor);
    const [saveState, sendSave] = useActor(saveActor);
    const [editForm] = Form.useForm();

    const [saving, setSaving] = useState(false);

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
                sendPagedQuery({ ...lookupContext.payload.data, orderBy: "partyId DESC" })();

                notification.success({
                    key: `cparty_${Date.now()}`,
                    message: "Task Complete",
                    description: <>Party created: {saveContext.payload.data.loginId}</>,
                    duration: 5
                });

                editForm.resetFields();
                setSaving(false);
            }

            if (state.matches("hasError")) {
                notification.error({
                    key: `cparty_${Date.now()}`,
                    message: "Task Failed",
                    description: <>Error creating party.<br />{state.context.error.message}</>,
                    duration: 5
                });
                setSaving(false);
            }
        });
    }, [editForm]);

    useEffect(() => {
        if (lookupState.matches("idle")) {
            if (lookupState.context.result.count > 0 && lookupState.context.result.parties.length === 0) {
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
            <Col md={10}>
                <Card title="Find Parties">
                    <SearchForm onSearch={data => sendPagedQuery(data)(1, viewLimit)} />
                </Card>
            </Col>
            <Col md={11} push={1}>
                <Collapse>
                    <Collapse.Panel header="Create Party" key="recordEditor">
                        <EditForm form={editForm} record={{}} onSave={data => setSaving(true) || saveRecord(data)} />
                    </Collapse.Panel>
                </Collapse>
            </Col>
        </Row>
        <Br />
        <DataView context={viewContext} onView={onClickView} onEdit={onClickEdit} onDelete={onClickDelete} viewPage={viewPage} viewLimit={viewLimit} />
        <Br />
        <DataPager totalPagingItems={viewContext.result.count} currentPage={viewPage} onPagingChange={sendPagedQuery(viewContext.payload.data)} />
        <Modal visible={saving} footer={null} closable="false" maskClosable={false}>
            <Spin tip="Sending Request" />
        </Modal>
    </>);
};

export const PartyPicker = ({ actor: lookupActor, onPicked }) => {
    const [lookupState, sendLookup] = useActor(lookupActor);

    const sendPagedQuery = queryData => (page, limit) => {
        page === undefined && (page = queryData.page)
        limit === undefined && (limit = queryData.limit)
        console.log(queryData, page, limit);

        const query = { data: { ...queryData, page, limit }, type: "LOAD" };
        return sendLookup(query);
    };

    useEffect(() => sendPagedQuery(lookupState.context.payload.data)(), []);

    const onClickView = data => console.log("view", data) || onPicked(data);
    const onClickEdit = data => console.log("edit", data);
    const onClickDelete = data => console.log("delete", data);

    const viewContext = lookupState.context;

    const viewPage = viewContext.payload.data.page;
    const viewLimit = viewContext.payload.data.limit;

    return (<>
        <Row>
            <Col md={10}>
                <Typography.Text strong>Find Parties</Typography.Text>
                <Br />
                <SearchForm onSearch={data => sendPagedQuery(data)(1, viewLimit)} />
            </Col>
        </Row>
        <DataView context={viewContext} onView={onClickView} onEdit={onClickEdit} onDelete={onClickDelete} viewPage={viewPage} viewLimit={viewLimit} />
        <Br />
        <DataPager totalPagingItems={viewContext.result.count} currentPage={viewPage} onPagingChange={sendPagedQuery(viewContext.payload.data)} />
    </>);
};
