import React, { useEffect, useRef, useState } from "react";
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
    Modal, Typography, DatePicker, notification
} from "antd";
import { PartyService } from "../services/PartyService";
import { countries } from "countries-list";
import { PlusCircleFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import { SenderIdService } from "../services/SenderIdService";
import { Route } from "../services/Route";
import { RouteService } from "../services/RouteService";
import { DebounceSelect } from "./DebounceSelect";


const SearchForm = ({ onSearch }) => {
    const [searchForm] = Form.useForm();

    const performSearch = () => {
        const formData = searchForm.getFieldsValue();

      /*  ["createdOn_fld0_value", "createdOn_fld1_value"].forEach((n, i) => {
            const date = formData[n];
            formData[n] = date ? dayjs(date).add(i, "day").format("YYYY-MM-DD") : null;

            if (formData[n] === null) {
                delete formData[n];
            }
        });*/

        const queryData = ["senderId", "createdOn_fld0_value", "createdOn_fld1_value"].reduce((acc, v) => {
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
            labelCol={{ span: 18 }}
            wrapperCol={{ span: 23 }}
            labelAlign="left"
        >
            <Form.Item name="senderId" label="Sender-ID" children={<Input />} style={{ display: "inline-block", marginBottom: '0px' }} />
            <Form.Item name="senderId_op" initialValue={"contains"} hidden children={<Input />} />

            {/*<Form.Item name="createdOn_fld0_value" label="From Date" style={{display: 'inline-block', marginBottom: '0px'}} children={<DatePicker format={"MMM D, YYYY"}/>}/>
            <Form.Item name="createdOn_fld0_op" initialValue={"greaterThanEqualTo"} hidden children={<Input/>}/>
            <Form.Item name="createdOn_fld1_value" label="To Date" style={{display: 'inline-block', marginBottom: '0px'}} children={<DatePicker format={"MMM D, YYYY"}/>}/>
            <Form.Item name="createdOn_fld1_op" initialValue={"lessThanEqualTo"} hidden children={<Input/>}/>*/}

            <Form.Item style={{ display: 'inline-block', marginBottom: 0 }} label=" " colon={false}>
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

const WriteForm = ({ form, record, onRecordSaved,close }) => {
    const { Option } = Select;
    const [createForm] = Form.useForm(form);

    const [routes, setRoutes] = useState([]);
    const ref = useRef();
    useEffect(() => {
        RouteService.fetchRecords({})
            .then(data => {
                setRoutes(data.routes);
            })
    }, [])
    useEffect(() => createForm.resetFields(), [record, createForm]);

    const transformRecordAtoS = r => {
        const record = { ...r };
        record.parties = record.parties?.join(",");
        record.routes = record.routes?.join(",");
        return record;
    };
    const transformRecordStoA = r => {
        const record = { ...r };
        record.parties = record.parties?.map(party => party.partyId);
        record.routes = record.routes?.map(route => route.routeId);
        return record;
    };
    return (<>
        <Form
            form={createForm}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 20 }}
            labelAlign={"left"}
            initialValues={transformRecordStoA(record)}
            style={{
                padding: '15px'
            }}
            onFinish={() => createForm.resetFields()}
        >
            {/*<Form.Item name="partyId" label="I333D" style={{ display: "none" }} children={<Input />} />*/}
            <Form.Item name="senderIdId" label="Sender ID" hidden children={<Input />} />
            <Form.Item name="senderId" label="Sender ID" rules={[{ required: true }]} children={<Input />} />
            <Form.Item name="type" id="selected" label="Type" rules={[{ required: true }]}>
                <Select>
                    <Option key={"masking"} value="masking">Masking</Option>
                    <Option key={"non-masking"} value="non-masking">Non-Masking</Option>
                </Select>
            </Form.Item>
            <Form.Item name="parties" label="Parties" children={<DebounceSelect />} />
            <Form.Item name="routes" label="Routes" rules={[{ required: true }]}>
                <Select
                    ref={ref}
                    mode="multiple"
                    placeholder="Please select"
                    style={{
                        width: '100%',
                    }}
                    onChange={() => ref.current.blur()}
                >
                    {routes.map(route => <Option key={route.routeId}>{route.routeId}</Option>)}
                </Select>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 19}} >
                <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => createForm
                        .validateFields()
                        .then(_ => SenderIdService.saveRecord(transformRecordAtoS(createForm.getFieldsValue())))
                        .then(data => {
                            onRecordSaved(data.senderId);
                            notification.success({
                                key: `csenderid_${Date.now()}`,
                                message: "Task Complete",
                                description: <>SenderId Saved: {data.senderId}</>,
                                duration: 5
                            });
                        })
                        .catch(error => notification.error({
                            key: `csenderid_${Date.now()}`,
                            message: "Task Failed",
                            description: <>Error creating party.<br />{error.message}</>,
                            duration: 5
                        }))
                    }
                    children={"Submit"}
                />
                <Button style={{backgroundColor: '#FF0000', color: 'white', border: 'none',marginLeft:6}} onClick={close}>Close</Button>
            </Form.Item>
        </Form>
    </>);
};

const DataView = ({ senderId, viewPage, viewLimit, onEdit }) => {
    return (<>
        <Table
            style={{ marginLeft: 6 }}
            size="small"
            dataSource={senderId}
            rowKey={"senderId"}
            locale={{ emptyText: senderId === null ? "E" : "No Data" }}
            pagination={false}
        >
            <Table.Column
                dataIndex={undefined}
                title={"#"}
                render={(_, __, i) => (viewPage - 1) * viewLimit + (++i)}
            />
            <Table.Column title="Sender ID" dataIndex={"senderId"} />
            <Table.Column title="Type" dataIndex={"type"} />
            <Table.Column title="Parties" dataIndex={"parties"} render={(v, r, i) => v.map(rv => rv.partyName).join(", ")} />
            <Table.Column title="Routes" dataIndex={"routes"} render={(v, r, i) => v.map(rv => rv.routeId).join(", ")} />
            <Table.Column
                title="Actions"
                dataIndex={undefined}
                render={(value, record, index) => {
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

export const SenderId = () => {
    const [lastQuery, setLastQuery] = useState({});
    const [senderIds, setSenderIds] = useState([]);
    const [partyFetchResultCount, setPartyFetchResultCount] = useState(0);
    const [partyFetchError, setPartyFetchError] = useState(null);

    const { Title } = Typography;
    const [writeForm] = Form.useForm();

    const [modalData, setModalData] = useState(null);
    const showModal = data => setModalData(data);
    const handleOk = () => setModalData(null);
    const handleCancel = () => setModalData(null);

    useEffect(() => {
        SenderIdService.fetchRecords(lastQuery)
            .then((data) => {
                setSenderIds(data.senderIds);
                setPartyFetchResultCount(data.count);
                setPartyFetchError(null);
            })
            .catch(error => {
                setSenderIds([]);
                setPartyFetchResultCount(0);
                setPartyFetchError(error);
            });
    }, [lastQuery]);

    useEffect(() => {
        setLastQuery({ page: 1, limit: 10 })
    }, []);

    return (<>
        <Row style={{ marginLeft: 5 }}>
            <Col md={24}>
                <Card title={<Title level={5}>Sender ID</Title>}
                    headStyle={{ backgroundColor: "#f0f2f5", border: 0, padding: '0px' }}
                    extra={
                        <Button type="primary" style={{ background: "#1890ff", borderColor: "#1890ff" }}
                            icon={<PlusCircleFilled />} onClick={() => showModal({})}>
                            Create Sender
                        </Button>}
                    style={{ height: 135 }} size="small">
                    <SearchForm onSearch={data => setLastQuery({ ...(data || {}), page: 1, limit: lastQuery.limit })} />
                </Card>
            </Col>
        </Row>
        <DataView senderId={senderIds} viewLimit={lastQuery.limit} viewPage={lastQuery.page} onEdit={showModal} />
        <DataPager totalPagingItems={partyFetchResultCount} currentPage={lastQuery.page}
            onPagingChange={(page, limit) => setLastQuery({ ...lastQuery, page, limit })} />
        <Modal width={800} key="recordEditor" visible={modalData}
               maskClosable={false} onCancel={handleCancel} closable={false}  footer={null}>
            <WriteForm form={writeForm} record={modalData} onRecordSaved={_ => setLastQuery({ ...lastQuery, orderBy: "senderIdId DESC", page: 1 })} close={handleCancel}/>
        </Modal>
    </>);
};
