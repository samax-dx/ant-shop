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
            labelCol={{span: 18}}
            wrapperCol={{ span: 23}}
            labelAlign="left"
            //layout={"horizontal"}

        >
            <Form.Item style={{display:"inline-block",marginBottom:'0px'}} name="dialPlanId" label="Prefix" children={<Input />} />
            <Form.Item name="dialPlanId_op" initialValue={"contains"} hidden children={<Input />} />
            <Form.Item style={{display:"inline-block",marginBottom:'0px'}} name="routeId" label="Route" children={<Input />} />
            <Form.Item name="routeId_op" initialValue={"contains"} hidden children={<Input />} />
            <Form.Item style={{display:"inline-block",marginBottom:'0px'}} name="egressPrefix" label="Egress Prefix" children={<Input />} />
            <Form.Item name="egressPrefix_op" initialValue={"contains"} hidden children={<Input />} />
            <Form.Item style={{display:"inline-block",marginBottom:'0px'}} name="digitCut" label="Digit Cut" children={<Input />} />
            <Form.Item name="digitCut_op" initialValue={"contains"} hidden children={<Input />} />
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
            <Form.Item name="dialPlanId" label="Prefix" rules={[{ required: true }]}>
                <Select showSearch allowClear style={{ minWidth: 150 }}>
                    {prefixes.map((v, i) => <Select.Option value={v.prefixId} key={i}>{v.prefixId}</Select.Option>)}
                </Select>
            </Form.Item>

            <Form.Item name="routeId" label="Route" rules={[{ required: true }]}>
                <Select showSearch allowClear style={{ minWidth: 150 }}>
                    {routes.map((v, i) => <Select.Option value={v.routeId} key={i}>{v.routeId}</Select.Option>)}
                </Select>
            </Form.Item>

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
            style={{marginLeft:5}}
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
                title="Prefix"
                dataIndex={undefined}
                render={(_, dialPlan, i) => {
                    return (
                        <Button onClick={() => onView(dialPlan)} type="link">{dialPlan.dialPlanId}</Button>
                    );
                }}
            />

            <Table.Column title="Route" dataIndex={"routeId"} />
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
    const [prefixes, setPrefixes] = useState([]);
    const [routes, setRoutes] = useState([]);


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
    useEffect(() => {
        sendPagedQuery(listLoaderContext.payload.data)();
        PrefixSvc
            .fetchRecords({}, { data: { limit: 10000 } })
            .then(data => console.log("fetched prefixs", data) || data)
            .then(data => setPrefixes(data.prefixes || []))
            .catch(error => console.log("error fetching prefixs", error));
        RouteSvc
            .fetchRecords({}, { data: { limit: 10000 } })
            .then(data => console.log("fetched routes", data) || data)
            .then(data => setRoutes(data.routes || []))
            .catch(error => console.log("error fetching routes", error));
    }, []);


    // Listeners
    useEffect(() => {
        recordSaver.subscribe(state => {
            const loaderContext = listLoader.getSnapshot().context;
            const saverContext = recordSaver.getSnapshot().context;

            if (state.matches("hasResult")) {
                sendPagedQuery({ ...loaderContext.payload.data, orderBy: "lastUpdatedStamp DESC" })();

                notification.success({
                    key: `sdial_${Date.now()}`,
                    message: "Task Complete",
                    description: <>DialPlan saved: {saverContext.result.dialPlanId}</>,
                    duration: 5
                });

                editForm.resetFields();
            }

            if (state.matches("hasError")) {
                notification.error({
                    key: `sdial_${Date.now()}`,
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

    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const { Title } = Typography;

    return (<>
        <Row style={{marginBottom:5,marginLeft:5}}>
            <Col md={24}>
                <Card title={<Title level={4}>DialPlan</Title>}
                      headStyle={{backgroundColor:"#f0f2f5", border: 0,padding:'0px'}}
                      extra={
                          <Button type="primary" style={{ background:"#1890ff", borderColor:"#1890ff"}} icon={<PlusCircleFilled />} onClick={showModal}>
                              Create DailPlan
                          </Button>}
                      style={{margin:0}} size="small">
                    <SearchForm onSearch={data => sendPagedQuery(data)(1, viewLimit)} />
                </Card>
            </Col>
            {/*<Col md={2} push={0} style={{marginLeft:5}}>*/}
            {/*    <Button type="default" onClick={showModal}>*/}
            {/*        Create DailPlan*/}
            {/*    </Button>*/}
                <Modal header={editFormTitle()} key="recordEditor" activeKey={editorCollapsed || ["recordEditor"]} onChange={state => setEditorCollapsed(state)}
                       visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    <EditForm form={editForm} record={{}} onSave={saveRecord} {...{ prefixes, routes }} />
                </Modal>
            {/*</Col>*/}
        </Row>
       {/* <Br />*/}
        <DataView context={listLoaderContext} onView={onClickView} onEdit={onClickEdit} onDelete={onClickDelete} viewPage={viewPage} viewLimit={viewLimit} />
        <Br />
        <DataPager totalPagingItems={listLoaderContext.result.count} currentPage={viewPage} onPagingChange={sendPagedQuery(listLoaderContext.payload.data)} />
    </>);
};
