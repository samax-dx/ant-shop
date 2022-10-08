import React, { useEffect, useState } from "react";
import {
    Form,
    Input,
    Button,
    Table,
    Space,
    Pagination,
    Card,
    Select,
    Row,
    Col,
    Modal, Typography, DatePicker
} from "antd";
import {countries} from "countries-list";
import {PlusCircleFilled} from "@ant-design/icons";
import dayjs from "dayjs";
import {DialPlanService} from "../services/DialPlanService";


const SearchForm = ({ onSearch }) => {
    const [searchForm] = Form.useForm();

    const performSearch = () => {
        const formData = searchForm.getFieldsValue();

        // ["createdOn_fld0_value", "createdOn_fld1_value"].forEach((n, i) => {
        //     const date = formData[n];
        //     formData[n] = date ? dayjs(date).add(i, "day").format("YYYY-MM-DD") : null;
        //
        //     if (formData[n] === null) {
        //         delete formData[n];
        //     }
        // });

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

        // queryData = { userName: "value", userName_op: "contains", phoneNumber: "value", phoneNumber_op: "contains" };
        onSearch(Object.keys(queryData).length ? queryData : null);
    };

    return (<>
        <Form
            form={searchForm}
            labelCol={{span: 18}}
            wrapperCol={{ span: 23}}
            labelAlign="left"
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

const WriteForm = ({ form, record, prefixes, routes  }) => {
    const { Option } = Select;
    const [createForm] = Form.useForm(form);

    useEffect(() => createForm.resetFields(), [record, createForm]);

    return (<>
        <Form
            form={createForm}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 20 }}
            labelAlign={"left"}
            initialValues={record}
            style={{
                padding:'15px'
            }}
            onFinish={form.resetFields}
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

            <Form.Item wrapperCol={{ offset: 0}} style={{marginLeft: 333}} >
                <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => createForm
                        .validateFields()
                        .then(_ => DialPlanService.saveRecord(createForm.getFieldsValue()) && alert("Sender Create Success!"))
                        .catch(error => {alert(error.message)})
                    }
                    children={"Submit"}
                />
            </Form.Item>
        </Form>
    </>);
};

const DataView = ({ dialPlans, viewPage, viewLimit, onEdit }) => {
    return (<>
        <Table
            style={{marginLeft:6}}
            size="small"
            dataSource={dialPlans}
            rowKey={dialPlan => dialPlan.dialPlanId + dialPlan.routeId}
            locale={{ emptyText: dialPlans === null ? "E" : "No Data" }}
            pagination={false}
        >
            <Table.Column
                dataIndex={undefined}
                title={"#"}
                render={(_, __, i) => (viewPage - 1) * viewLimit + (++i)}
            />
            <Table.Column title="Prefix" dataIndex={"prefixId"}/>
            <Table.Column title="Route" dataIndex={"routeId"} />
            <Table.Column title="Priority" dataIndex={"priority"} />
            <Table.Column title="Egress Prefix" dataIndex={"egressPrefix"} />
            <Table.Column title="Digit Cut" dataIndex={"digitCut"} />

            <Table.Column
                title="Actions"
                dataIndex={undefined}
                render={(record, value, index) => {
                    return (
                        <Button onClick={() => onEdit(record)} type="link">Edit</Button>
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

export const NewDialPlan = () => {
    const [lastQuery, setLastQuery] = useState({});
    const [dialPlans, setDialPlans] = useState([]);
    const [partyFetchResultCount, setPartyFetchResultCount] = useState(0);
    const [partyFetchError, setPartyFetchError] = useState(null);

    const {Title} = Typography;
    const [writeForm] = Form.useForm();

    const [modalData, setModalData] = useState(null);
    const showModal = data => setModalData(data);
    const handleOk = () => setModalData(null);
    const handleCancel = () => setModalData(null);

    useEffect(() => {
        DialPlanService.fetchRecords(lastQuery)
            .then((data) => {
                setDialPlans(data.dialPlans);
                setPartyFetchResultCount(data.count);
                setPartyFetchError(null);
            })
            .catch(error => {
                setDialPlans([]);
                setPartyFetchResultCount(0);
                setPartyFetchError(error);
            });
    }, [lastQuery]);

    useEffect(() => {
        setLastQuery({ page: 1, limit: 10 })
    }, []);

    return (<>
        <Row style={{marginLeft: 5}}>
            <Col md={24}>
                <Card title={<Title level={5}>Dial Plan</Title>}
                      headStyle={{backgroundColor: "#f0f2f5", border: 0, padding: '0px'}}
                      extra={
                          <Button type="primary" style={{background: "#1890ff", borderColor: "#1890ff"}}
                                  icon={<PlusCircleFilled/>} onClick={() => showModal({})}>
                              Create DialPlan
                          </Button>}
                      style={{height: 135}} size="small">
                    <SearchForm onSearch={data => setLastQuery({ ...(data || {}), page: 1, limit: lastQuery.limit })}/>
                </Card>
            </Col>
            <Modal width={800} header="Create Sender" key="recordEditor" visible={modalData}
                   maskClosable={false} onOk={handleOk} onCancel={handleCancel}>
                <WriteForm form={writeForm} record={modalData}/>
            </Modal>
        </Row>
        <DataView dialPlans={dialPlans} viewLimit={lastQuery.limit} viewPage={lastQuery.page} onEdit={showModal}/>
        <DataPager totalPagingItems={partyFetchResultCount} currentPage={lastQuery.page}
                   onPagingChange={(page, limit) => setLastQuery({ ...lastQuery, page, limit })} />
    </>);
};
