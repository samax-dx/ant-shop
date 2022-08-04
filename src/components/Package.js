import { useEffect, useState } from "react";
import {
    Form,
    Input,
    Button,
    Table,
    Space,
    Pagination,
    notification,
    Collapse,
    Card,
    Row,
    Col,
    Select,
    Modal,
    Typography
} from "antd";
import { useActor } from "@xstate/react";
import { Br } from "./Br";

import { Product as ProductSvc } from "../services/Product";
import { Prefix as PrefixSvc } from "../services/Prefix";
import {PlusCircleFilled} from "@ant-design/icons";


const SearchForm = ({ onSearch }) => {
    const [searchForm] = Form.useForm();

    const performSearch = () => {
        const formData = searchForm.getFieldsValue();

        const queryData = ["packageId", "prefix", "dialPlanId"].reduce((acc, v) => {
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
            labelCol={{ span: 18}}
            wrapperCol={{ span: 23}}
            labelAlign="left"
        >
            <Form.Item style={{display:'inline-block',marginBottom:'0px'}} name="packageId" label="Package" children={<Input />} />
            <Form.Item name="packageId_op" initialValue={"contains"} hidden children={<Input />} />
            <Form.Item style={{display:'inline-block',marginBottom:'0px'}} name="dialPlanId" label="DialPlan Prefix" children={<Input />} />
            <Form.Item name="dialPlanId_op" initialValue={"contains"} hidden children={<Input />} />
            <Form.Item style={{display:'inline-block',marginBottom:'0px'}} name="prefix" label="Client Prefix" children={<Input />} />
            <Form.Item name="prefix_op" initialValue={"contains"} hidden children={<Input />} />
            <Form.Item wrapperCol={{ offset: 0 }} style={{display:'inline-block',marginBottom:'0px'}} label=" " colon={false}>
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

const EditForm = ({ form, record, onSave, pkgPrefixes, lineups }) => {
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
            <Form.Item name="packageId" label="Package" rules={[{ required: true }]}>
                <Select showSearch allowClear style={{ minWidth: 150 }}>
                    {lineups.map((v, i) => <Select.Option value={v.productId} key={i}>{v.productName} ({v.productId})</Select.Option>)}
                </Select>
            </Form.Item>

            <Form.Item name="dialPlanId" label="DialPlan Prefix" rules={[{ required: true }]}>
                <Select showSearch allowClear style={{ minWidth: 150 }}>
                    {pkgPrefixes.map((v, i) => <Select.Option value={v.prefixId} key={i}>{v.prefixId}</Select.Option>)}
                </Select>
            </Form.Item>

            <Form.Item name="prefix" label="Client Prefix" children={<Input />} />

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
            dataSource={viewResult.packages}
            rowKey={pkg => pkg.packageId + pkg.dialPlanId}
            locale={{ emptyText: viewError && `[ ${viewError.message || "Fetch Error"} ]` }}
            pagination={false}
        >
            <Table.Column
                dataIndex={undefined}
                title={"#"}
                render={(_, __, i) => (viewPage - 1) * viewLimit + (++i)}
            />

            <Table.Column
                title="Package"
                dataIndex={undefined}
                render={(_, pkg, i) => {
                    return (
                        <Button onClick={() => onView(pkg)} type="link">{pkg.packageId}</Button>
                    );
                }}
            />

            <Table.Column title="DialPlan Prefix" dataIndex={"dialPlanId"} />
            <Table.Column title="Client Prefix" dataIndex={"prefix"} />

            <Table.Column
                title="Actions"
                dataIndex={undefined}
                render={(_, pkg, i) => {
                    return (
                        <Button onClick={() => onEdit(pkg)} type="link">Edit</Button>
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

export const Package = ({ actor: [listLoader, recordSaver] }) => {
    // Component Services
    const [editForm] = Form.useForm();


    // Component States
    const [editorCollapsed, setEditorCollapsed] = useState(true);
    const [{ context: listLoaderContext }] = useActor(listLoader);
    const [lineups, setLineups] = useState([]);
    const [pkgPrefixes, setPkgPrefixes] = useState([]);


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
        ProductSvc
            .fetchProductLineups({}, { data: { limit: 10000 } })
            .then(data => console.log("fetched lineups", data) || data)
            .then(data => setLineups(data.lineups || []))
            .catch(error => console.log("error fetching dialPlans", error));
        PrefixSvc
            .fetchRecords({}, { data: { limit: 10000 } })
            .then(data => console.log("fetched prefixs", data) || data)
            .then(data => setPkgPrefixes(data.prefixes || []))
            .catch(error => console.log("error fetching prefixs", error));
    }, []);


    // Listeners
    useEffect(() => {
        recordSaver.subscribe(state => {
            const loaderContext = listLoader.getSnapshot().context;
            const saverContext = recordSaver.getSnapshot().context;

            if (state.matches("hasResult")) {
                sendPagedQuery({ ...loaderContext.payload.data, orderBy: "lastUpdatedStamp DESC" })();

                notification.success({
                    key: `spkg_${Date.now()}`,
                    message: "Task Complete",
                    description: <>Package-Prefix saved: {saverContext.result.packageId}</>,
                    duration: 5
                });

                editForm.resetFields();
            }

            if (state.matches("hasError")) {
                notification.error({
                    key: `spkg_${Date.now()}`,
                    message: "Task Failed",
                    description: <>Error creating campaign.<br />{state.context.error.message}</>,
                    duration: 5
                });
            }
        });
    }, [editForm]);

    useEffect(() => {
        const state = listLoader.getSnapshot();
        const lookupFinished = state.matches("idle");
        const hasResult = state.context.result.count > 0;
        const isViewEmpty = state.context.result.packages.length === 0;

        if (lookupFinished && hasResult && isViewEmpty) {
            state.context.payload.data.page--;
            listLoader.send({ ...state.context.payload, type: "LOAD" });
        }
    });


    // Component Current Properties
    const onClickView = data => console.log("view", data);
    const onClickEdit = data => console.log("edit", data) || setEditorCollapsed(false) || editForm.setFieldsValue(data);
    const onClickDelete = data => console.log("delete", data);

    const editFormTitle = () => editForm.formHooked && editForm.getFieldValue("packageId") ? "Edit Package" : "Create Package";

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
                <Card title={<Title level={4}>Package</Title>}
                      headStyle={{backgroundColor:"#f0f2f5", border: 0,padding:'0px'}}
                      extra={
                          <Button type="primary" style={{ background:"#1890ff", borderColor:"#1890ff"}} icon={<PlusCircleFilled />} onClick={showModal}>
                              Create Package
                          </Button>}
                      style={{margin:0}} size="small">
                    <SearchForm onSearch={data => sendPagedQuery(data)(1, viewLimit)} />
                </Card>
            </Col>
            {/*<Col md={5} push={1}>*/}
            {/*    <Button type="default" onClick={showModal}>*/}
            {/*        Create Package*/}
            {/*    </Button>*/}
                <Modal header={editFormTitle()} key="recordEditor" activeKey={editorCollapsed || ["recordEditor"]} onChange={state => setEditorCollapsed(state)}
                          visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    <EditForm form={editForm} record={{}} onSave={saveRecord} {...{ lineups, dialPlans }} />
                </Modal>
            {/*</Col>*/}
        </Row>
        <DataView context={listLoaderContext} onView={onClickView} onEdit={onClickEdit} onDelete={onClickDelete} viewPage={viewPage} viewLimit={viewLimit} />
        <Br />
        <DataPager totalPagingItems={listLoaderContext.result.count} currentPage={viewPage} onPagingChange={sendPagedQuery(listLoaderContext.payload.data)} />
    </>);
};
