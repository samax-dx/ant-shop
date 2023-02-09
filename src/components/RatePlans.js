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
import {ExclamationCircleOutlined, PlusCircleFilled} from "@ant-design/icons";
import dayjs from "dayjs";
import { RouteService } from "../services/RouteService";
import { DebounceSelect } from "./DebounceSelect";
import {Link} from "react-router-dom";
import {RatePlanService} from "../services/RatePlanService";
import {DebounceCurrency} from "./DebounceCurrency";
import {CurrencyService} from "../services/CurrencyService";
import {RateService} from "../services/RateService";


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

        const queryData = ["name", "ratePlanId", "createdOn_fld0_value", "createdOn_fld1_value"].reduce((acc, v) => {
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
            <Form.Item name="name" label="Rate-Plan Name" children={<Input />} style={{ display: "inline-block", marginBottom: '0px' }} />
            <Form.Item name="name_op" initialValue={"contains"} hidden children={<Input />} />
            <Form.Item name="ratePlanId" label="Rate-Plan ID" children={<Input />} style={{ display: "inline-block", marginBottom: '0px' }} />
            <Form.Item name="ratePlanId_op" initialValue={"contains"} hidden children={<Input />} />

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

const WriteForm = ({currency, recordArg, onRecordSaved,close }) => {

    const { Option } = Select;

    const [writeForm] = Form.useForm();
    const [isCreateForm, setIsCreateForm] = useState(true);
    const [lastWrite, setLastWrite] = useState(recordArg);
    const transformRecordAtoS = r => {
        const record = { ...r };
        record.parties = record.parties?.join(",");
        return record;
    };
    const transformRecordStoA = r => {
        const record = { ...r };
        record.parties = record.parties?.map(party => party.partyId);
        return record;
    };

    useEffect(() => {
        setIsCreateForm(Object.keys(recordArg).length === 0);
        writeForm.resetFields();
        writeForm.setFieldsValue(recordArg);
    }, [recordArg]);

    useEffect( () => {
        if (lastWrite === recordArg) return;
        isCreateForm && writeForm.resetFields();
    },[lastWrite]);

    return (<>
        <Form
            form={writeForm}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 20 }}
            labelAlign={"left"}
            style={{
                padding: '15px'
            }}
        >
            <Form.Item name="ratePlanId" label="Rate Plan ID" hidden rules={[{ required: false }]} children={<Input disabled={!isCreateForm} />} />
            <Form.Item name="name" label="Name" rules={[{ required: true }]} children={<Input disabled={!isCreateForm}/>} />
            <Form.Item name="description" label="Description" rules={[{ required: true }]} children={<Input />} />
            <Form.Item name="currencyCode" label="Currency" rules={[{ required: true }]} children={
                <Select
                    showSearch
                    placeholder="Select a person"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={currency.map(data=>{return {value:data.code,label:data.code + " - " + data.name}})}
                />
                } />
            <Form.Item wrapperCol={{ offset: 16}} >
                <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => writeForm
                        .validateFields()
                        .then(_ => RatePlanService.saveRecord(writeForm.getFieldsValue()))
                        .then(data => {
                            console.log(data);
                            setLastWrite(data);
                            onRecordSaved(data);
                            notification.success({
                                key: `crateplan_${Date.now()}`,
                                message: "Task Complete",
                                description: <>Rate-Plan Saved: {data.ratePlanId}</>,
                                duration: 5
                            });
                        })
                        .catch(error => console.log(error) || notification.error({
                            key: `crateplan_${Date.now()}`,
                            message: "Task Failed",
                            description: <>Error creating .<br />{error.message}</>,
                            duration: 5
                        }))
                    }
                    children={"Submit"}
                />
                <Button style={{backgroundColor: '#FF0000', color: 'white', border: 'none',marginLeft:4}} onClick={close}>Close</Button>
            </Form.Item>
        </Form>
    </>);
};

const DuplicateRatePlanForm = ({currency, recordArg, onRecordSaved,close }) => {

    const { Option } = Select;

    const [DuplicateRatePlanForm] = Form.useForm();
    const [lastWrite, setLastWrite] = useState(recordArg);

    useEffect(() => {
        DuplicateRatePlanForm.setFieldsValue(recordArg);
    }, [recordArg]);

    useEffect( () => {
        if (lastWrite === recordArg) return;
        DuplicateRatePlanForm.setFieldsValue(lastWrite);
    },[lastWrite]);

    return (<>
        <Form
            form={DuplicateRatePlanForm}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 20 }}
            labelAlign={"left"}
            style={{
                padding: '15px'
            }}
        >
            <Form.Item name="ratePlanId" label="Rate Plan ID" hidden rules={[{ required: false }]} children={<Input />} />
            <Form.Item name="name" label="Name" rules={[{ required: true }]} children={<Input />} />
            <Form.Item name="description" label="Description" rules={[{ required: true }]} children={<Input />} />
            <Form.Item name="currencyCode" label="Currency" rules={[{ required: true }]} children={
                <Select
                    showSearch
                    placeholder="Select a person"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={currency.map(data=>{return {value:data.code,label:data.code + " - " + data.name}})}
                />
            } />
            <Form.Item wrapperCol={{ offset: 16}} >
                <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => DuplicateRatePlanForm
                        .validateFields()
                        .then(_ => RatePlanService.saveDuplicate(DuplicateRatePlanForm.getFieldsValue()))
                        .then(data => {
                            console.log(data);
                            setLastWrite(data);
                            onRecordSaved(data);
                            notification.success({
                                key: `dcrateplan_${Date.now()}`,
                                message: "Task Complete",
                                description: <>duplicated Rate-Plan: {data.ratePlanId}</>,
                                duration: 5
                            });
                        })
                        .catch(error => console.log(error) || notification.error({
                            key: `dcrateplan_${Date.now()}`,
                            message: "Task Failed",
                            description: <>Error duplicating .<br />{error.message}</>,
                            duration: 5
                        }))
                    }
                    children={"Submit"}
                />
                <Button style={{backgroundColor: '#FF0000', color: 'white', border: 'none',marginLeft:4}} onClick={close}>Close</Button>
            </Form.Item>
        </Form>
    </>);
};

const DataView = ({ ratePlans, viewPage, viewLimit, onEdit, onDelete, onDuplicate }) => {
    const confirmDelete = ratePlan => Modal.confirm({
        title: 'Confirm delete rate-plan?',
        icon: <ExclamationCircleOutlined />,
        content: <>Deleting rate-plan: <strong>{ratePlan.ratePlanId}</strong></>,
        onOk() {
            onDelete(ratePlan);
        }
    });
    return (<>
        <Table
            style={{ marginLeft: 6 }}
            size="small"
            dataSource={ratePlans}
            rowKey={"ratePlanId"}
            locale={{ emptyText: ratePlans === null ? "E" : "No Data" }}
            pagination={false}
        >
            <Table.Column
                dataIndex={undefined}
                title={"#"}
                render={(_, __, i) => (viewPage - 1) * viewLimit + (++i)}
            />
            <Table.Column
                title="RatePlan Id"
                dataIndex={"ratePlanId"}
                render={(_, ratePlans, i) => {
                    return (
                        <Link to={`/Package/rates/${ratePlans.ratePlanId}`}>{ratePlans.ratePlanId}</Link>
                    );
                }}
            />
            <Table.Column title="Rate-Plan Name" dataIndex={"name"} />
            <Table.Column title="Currency" dataIndex={"currencyCode"} />
            <Table.Column title="Description" dataIndex={"description"} />
            <Table.Column
                title="Actions"
                dataIndex={undefined}
                render={(value, record, index) => {
                    return (<>
                        <Button onClick={() => onEdit(record)} type="link">Edit</Button>
                        <Button onClick={() => confirmDelete(record)} type="danger">Delete</Button>
                        <Button onClick={() => onDuplicate(record)} type="link">Duplicate</Button>
                    </>);
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

export const RatePlans = () => {
    const [lastQuery, setLastQuery] = useState({});
    const [ratePlans, setRatePlans] = useState([]);
    const [partyFetchResultCount, setPartyFetchResultCount] = useState(0);
    const [partyFetchError, setPartyFetchError] = useState(null);

    const [currency, setCurrency] = useState([]);

    const { Title } = Typography;

    const [modalData, setModalData] = useState(null);
    const showModal = data => setModalData(data);
    const handleOk = () => setModalData(null);
    const handleCancel = () => setModalData(null);

    const removeRatePlan = ratePlan => {
        RatePlanService.removeRecord(ratePlan)
            .then(data => {
                setLastQuery({ ...lastQuery, page: 1 });
                notification.success({
                    key: `rRatePlan_${Date.now()}`,
                    message: "Task Finished",
                    description: `Rate-plan deleted: ${ratePlan.ratePlanId}`,
                    duration: 15
                });
            })
            .catch(error => {
                notification.error({
                    key: `rRatePlan_${Date.now()}`,
                    message: "Task Failed",
                    description: `Error Deleting dial-plan: ${ratePlan.ratePlanId}`,
                    duration: 15
                });
            });
    };

    useEffect(() => {
        RatePlanService.fetchRecords({...lastQuery})
            .then((data) => {
                setRatePlans(data.ratePlans);
                setPartyFetchResultCount(data.count);
                setPartyFetchError(null);
            })
            .catch(error => {
                setRatePlans([]);
                setPartyFetchResultCount(0);
                setPartyFetchError(error);
            });
    }, [lastQuery]);

    useEffect(() => {
        CurrencyService.fetchRecords({})
            .then(data => {
                console.log(data);
                setCurrency(data.currency);
            })
            .catch(error =>{
                console.log(error);
            })
    },[])
    useEffect(() => {
        setLastQuery({ page: 1, limit: 10 })
    }, []);

    return (<>
        <Row style={{ marginLeft: 5 }}>
            <Col md={24}>
                <Card title={<Title level={5}>Rate Plan</Title>}
                      headStyle={{ backgroundColor: "#f0f2f5", border: 0, padding: '0px' }}
                      extra={
                          <Button type="primary" style={{ background: "#1890ff", borderColor: "#1890ff" }}
                                  icon={<PlusCircleFilled />} onClick={() => showModal({})}>
                              Create Rate Plan
                          </Button>}
                      style={{ height: 135 }} size="small">
                    <SearchForm onSearch={data => setLastQuery({ ...(data || {}), page: 1, limit: lastQuery.limit })} />
                </Card>
            </Col>
        </Row>
        <DataView ratePlans={ratePlans} viewLimit={lastQuery.limit} viewPage={lastQuery.page} onEdit={showModal} onDelete={removeRatePlan}  onDuplicate={showModal}  />
        <DataPager totalPagingItems={partyFetchResultCount} currentPage={lastQuery.page}
                   onPagingChange={(page, limit) => setLastQuery({ ...lastQuery, page, limit })} />
        <Modal key="recordEditor" visible={modalData} maskClosable={false} onCancel={handleCancel} closable={false} footer={null} bodyStyle={{height:"17rem"}}>
            <WriteForm recordArg={modalData} currency={currency} onRecordSaved={_ => setLastQuery({ ...lastQuery, orderBy: "ratePlanId ASC", page: 1 })} close={handleCancel}/>
        </Modal>
        <Modal key="recordEditor" visible={modalData} maskClosable={false} onCancel={handleCancel} closable={false} footer={null} bodyStyle={{height:"17rem"}}>
            <DuplicateRatePlanForm recordArg={modalData} currency={currency} onRecordSaved={_ => setLastQuery({ ...lastQuery, orderBy: "ratePlanId ASC", page: 1 })} close={handleCancel}/>
        </Modal>
    </>);
};
