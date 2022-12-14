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
import {Link, useParams} from "react-router-dom";
import {RatePlanService} from "../services/RatePlanService";
import {RateService} from "../services/RateService";
import {DialPlanService} from "../services/DialPlanService";


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

        const queryData = ["rateId", "prefixId", "createdOn_fld1_value"].reduce((acc, v) => {
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
            <Form.Item name="rateId" label="Rate ID" children={<Input />} style={{ display: "inline-block", marginBottom: '0px' }} />
            <Form.Item name="rateId_op" initialValue={"contains"} hidden children={<Input />} />
            <Form.Item name="prefixId" label="Prefix ID" children={<Input />} style={{ display: "inline-block", marginBottom: '0px' }} />
            <Form.Item name="prefixId_op" initialValue={"contains"} hidden children={<Input />} />

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

const WriteForm = ({ recordArg, onRecordSaved,ratePlanId,close }) => {
    const { Option } = Select;

    const [writeForm] = Form.useForm();
    const [isCreateForm, setIsCreateForm] = useState(true);

    const [lastWrite, setLastWrite] = useState(recordArg);


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
            <Form.Item name="rateId" label="Rate ID" hidden rules={[{ required: false }]} children={<Input disabled={!isCreateForm} />} />
            <Form.Item name="prefixId" label="Prefix" rules={[{ required: true }]} children={<Input disabled={!isCreateForm}/>} />
            <Form.Item name="rate" label="Rate" rules={[{ required: true }]} children={<Input />} />
            <Form.Item name="description" label="Description" rules={[{ required: true }]} children={<Input />} />
            <Form.Item name="ratePlanId" label="Rate Plan ID" initialValue={ratePlanId} hidden children={<Input />} />
            <Form.Item wrapperCol={{ offset: 16}} >
                <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => writeForm
                        .validateFields()
                        .then(_ =>{
                            const formData = writeForm.getFieldsValue();
                            formData.rate = parseFloat(formData.rate);
                            return RateService.saveRecord(formData);
                        })
                        .then(data => {
                            console.log(data);
                            setLastWrite(data);
                            onRecordSaved(data);
                            notification.success({
                                key: `crate_${Date.now()}`,
                                message: "Task Complete",
                                description: <>RateId Saved: {data.rate}</>,
                                duration: 5
                            });
                        })
                        .catch(error => notification.error({
                            key: `crate_${Date.now()}`,
                            message: "Task Failed",
                            description: <>Error creating party.<br />{error.message}</>,
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

const DataView = ({ rate, viewPage, viewLimit, onEdit, onDelete }) => {
    const confirmDelete = rate => Modal.confirm({
        title: 'Confirm delete rate?',
        icon: <ExclamationCircleOutlined />,
        content: <>Deleting rate: <strong>{rate.rateId} {rate.prefixId}</strong></>,
        onOk() {
            onDelete(rate);
            console.log("Clicked");
        }
    });
    return (<>
        <Table
            style={{ marginLeft: 6 }}
            size="small"
            dataSource={rate}
            rowKey={"rateId"}
            locale={{ emptyText: rate === null ? "E" : "No Data" }}
            pagination={false}
        >
            <Table.Column
                dataIndex={undefined}
                title={"#"}
                render={(_, __, i) => (viewPage - 1) * viewLimit + (++i)}
            />
            <Table.Column title="Rate Id" dataIndex={"rateId"} />
            <Table.Column title="Prefix" dataIndex={"prefixId"} />
            <Table.Column title="Rate" dataIndex={"rate"} />
            <Table.Column title="Description" dataIndex={"description"} />
            <Table.Column
                title="Actions"
                dataIndex={undefined}
                render={(value, record, index) => {
                    return (<>
                        <Button onClick={() => onEdit(record)} type="link">Edit</Button>
                        <Button onClick={() => confirmDelete(record)} type="link">Delete</Button>
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

export const PackageRate = () => {
    const {ratePlanId} = useParams();
    const [lastQuery, setLastQuery] = useState({});
    const [rate, setRate] = useState([]);
    const [partyFetchResultCount, setPartyFetchResultCount] = useState(0);
    const [partyFetchError, setPartyFetchError] = useState(null);

    const { Title } = Typography;

    const [modalData, setModalData] = useState(null);
    const showModal = data => setModalData(data);
    const handleOk = () => setModalData(null);
    const handleCancel = () => setModalData(null);

    const removeRate = rate => {
        RateService.removeRecord(rate)
            .then(data => {
                setLastQuery({ ...lastQuery, page: 1 });
                notification.success({
                    key: `rRate_${Date.now()}`,
                    message: "Task Finished",
                    description: `Rate deleted: ${rate.rateId} ${rate.prefixId}`,
                    duration: 15
                });
            })
            .catch(error => {
                notification.error({
                    key: `rRate_${Date.now()}`,
                    message: "Task Failed",
                    description: `Error Deleting dial-plan: ${rate.rateId} ${rate.prefixId}`,
                    duration: 15
                });
            });
    };

    useEffect(() => {
        RateService.fetchRecords({...lastQuery, ratePlanId})
            .then(data => {

                setRate(data.rates);
                setPartyFetchResultCount(data.count);
                setPartyFetchError(null);
            })
            .catch(error => {
                setRate([]);
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
                <Card title={<Title level={5}>Rate</Title>}
                      headStyle={{ backgroundColor: "#f0f2f5", border: 0, padding: '0px' }}
                      extra={
                          <Button type="primary" style={{ background: "#1890ff", borderColor: "#1890ff" }}
                                  icon={<PlusCircleFilled />} onClick={() => showModal({})}>
                              Create Rate
                          </Button>}
                      style={{ height: 135 }} size="small">
                    <SearchForm onSearch={data => setLastQuery({ ...(data || {}), page: 1, limit: lastQuery.limit })} />
                </Card>
            </Col>
        </Row>
        <DataView rate={rate} viewLimit={lastQuery.limit} viewPage={lastQuery.page} onEdit={showModal} onDelete={removeRate} />
        <DataPager totalPagingItems={partyFetchResultCount} currentPage={lastQuery.page}
                   onPagingChange={(page, limit) => setLastQuery({ ...lastQuery, page, limit })} />
        <Modal key="recordEditor" visible={modalData} maskClosable={false} onCancel={handleCancel} closable={false}  footer={null} bodyStyle={{height:"17rem"}}>
            <WriteForm ratePlanId={ratePlanId} recordArg={modalData} onRecordSaved={_ => setLastQuery({ ...lastQuery, orderBy: "rateId DESC", page: 1 })} close={handleCancel}/>
        </Modal>
    </>);
};