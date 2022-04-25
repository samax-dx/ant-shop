import { useEffect, useState } from "react";
import { Form, Input, Button, Table, Space, Pagination, DatePicker, notification, Collapse, Card, Select, Row, Col } from "antd";
import { useActor } from "@xstate/react";
import { Br } from "./Br";


const SearchForm = ({ onSearch }) => {
    const [searchForm] = Form.useForm();

    const performSearch = () => {
        const formData = searchForm.getFieldsValue();

        const queryData = ["dialPlanId", "routeId", "egressPrefix", "digitCut"].reduce((acc, v) => {
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
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 8 }}
            labelAlign="left"
        >
            <Form.Item name="dialPlanId" label="DialPlan ID" children={<Input />} />
            <Form.Item name="dialPlanId_op" initialValue={"contains"} hidden children={<Input />} />
            <Form.Item name="routeId" label="Route ID" children={<Input />} />
            <Form.Item name="routeId_op" initialValue={"contains"} hidden children={<Input />} />
            <Form.Item name="egressPrefix" label="Egress Prefix" children={<Input />} />
            <Form.Item name="egressPrefix_op" initialValue={"contains"} hidden children={<Input />} />
            <Form.Item name="digitCut" label="Digit Cut" children={<Input />} />
            <Form.Item name="digitCut_op" initialValue={"contains"} hidden children={<Input />} />
            <Form.Item wrapperCol={{ offset: 5 }}>
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

const EditForm = ({ form, record, onSave }) => {
    const [editForm] = Form.useForm(form);

    return (<>
        <Form
            form={editForm}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            labelAlign={"left"}
            initialValues={record}
        >
            <Form.Item name="dialPlanId" label="DialPlan" rules={[{ required: true }]} children={<Input />} />

            <Form.Item name="routeId" label="Route ID" rules={[{ required: true }]} children={<Input />} />

            <Form.Item name="priority" label="Priority" rules={[{ required: true }]} children={<Input />} />

            <Form.Item name="egressPrefix" label="Egress Prefix" children={<Input />} />

            <Form.Item name="digitCut" label="Digit Cut" children={<Input />} />

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
            size="small"
            dataSource={viewResult.dialPlans}
            rowKey={dialPlan => dialPlan.dialPlanId + dialPlan.routeId}
            locale={{ emptyText: viewError && `[ ${viewError.message || "Fetch Error"} ]` }}
            pagination={false}
        >
            <Table.Column
                dataIndex={undefined}
                title={"#"}
                render={(_, __, i) => (viewPage - 1) * viewLimit + (++i)}
            />

            <Table.Column
                title="DialPlan ID"
                dataIndex={undefined}
                render={(_, dialPlan, i) => {
                    return (
                        <Button onClick={() => onView(dialPlan)} type="link">{dialPlan.dialPlanId}</Button>
                    );
                }}
            />

            <Table.Column title="Route ID" dataIndex={"routeId"} />
            <Table.Column title="Priority" dataIndex={"priority"} />
            <Table.Column title="Egress Prefix" dataIndex={"egressPrefix"} />
            <Table.Column title="Digit Cut" dataIndex={"digitCut"} />

            <Table.Column
                title="Actions"
                dataIndex={undefined}
                render={(_, dialPlan, i) => {
                    return (
                        <Button onClick={() => onEdit(dialPlan)} type="link">Edit</Button>
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

export const DialPlan = ({ actor: [listLoader, recordSaver] }) => {
    // Component Services
    const [editForm] = Form.useForm();


    // Component States
    const [editorCollapsed, setEditorCollapsed] = useState(true);
    const [{ context: listLoaderContext }] = useActor(listLoader);


    // Dependent Helper Functions
    const sendPagedQuery = queryData => (page, limit) => {
        page === undefined && (page = queryData.page)
        limit === undefined && (limit = queryData.limit)
        console.log(queryData, page, limit);

        const query = { data: { ...queryData, page, limit }, type: "LOAD" };
        return listLoader.send(query);
    };

    const saveRecord = data => {
        console.log(data);
        return recordSaver.send({ data, type: "LOAD" });
    };


    // Initializers
    useEffect(() => sendPagedQuery(listLoaderContext.payload.data)(), []);


    // Listeners
    useEffect(() => {
        recordSaver.subscribe(state => {
            const loaderContext = listLoader.getSnapshot().context;
            const saverContext = recordSaver.getSnapshot().context;

            if (state.matches("hasResult")) {
                sendPagedQuery({ ...loaderContext.payload.data, orderBy: "lastUpdatedStamp DESC" })();

                notification.success({
                    message: "Task Complete",
                    description: <>DialPlan saved: {saverContext.result.dialPlanId}</>,
                    duration: 5
                });

                editForm.resetFields();
            }

            if (state.matches("hasError")) {
                notification.error({
                    message: "Task Failed",
                    description: <>Error creating DialPlan.<br />{state.context.error.message}</>,
                    duration: 5
                });
            }
        });
    }, [editForm]);

    useEffect(() => {
        const state = listLoader.getSnapshot();
        const lookupFinished = state.matches("idle");
        const hasResult = state.context.result.count > 0;
        const isViewEmpty = state.context.result.dialPlans.length === 0;

        if (lookupFinished && hasResult && isViewEmpty) {
            state.context.payload.data.page--;
            listLoader.send({ ...state.context.payload, type: "LOAD" });
        }
    });


    // Component Current Properties
    const onClickView = data => console.log("view", data);
    const onClickEdit = data => console.log("edit", data) || setEditorCollapsed(false) || editForm.setFieldsValue(data);
    const onClickDelete = data => console.log("delete", data);

    const editFormTitle = () => editForm.formHooked && editForm.getFieldValue("dialPlanId") ? "Edit DialPlan" : "Create DialPlan";

    const viewPage = listLoaderContext.payload.data.page;
    const viewLimit = listLoaderContext.payload.data.limit;

    return (<>
        <Row>
            <Col md={10}>
                <Card title="Find DialPlan">
                    <SearchForm onSearch={data => sendPagedQuery(data)(1, viewLimit)} />
                </Card>
            </Col>
            <Col md={11} push={1}>
                <Collapse activeKey={editorCollapsed || ["recordEditor"]} onChange={state => setEditorCollapsed(state)} style={{ width: "500px" }}>
                    <Collapse.Panel header={editFormTitle()} key="recordEditor">
                        <EditForm form={editForm} record={{}} onSave={saveRecord} />
                    </Collapse.Panel>
                </Collapse>
            </Col>
        </Row>
        <Br />
        <DataView context={listLoaderContext} onView={onClickView} onEdit={onClickEdit} onDelete={onClickDelete} viewPage={viewPage} viewLimit={viewLimit} />
        <Br />
        <DataPager totalPagingItems={listLoaderContext.result.count} currentPage={viewPage} onPagingChange={sendPagedQuery(listLoaderContext.payload.data)} />
    </>);
};
