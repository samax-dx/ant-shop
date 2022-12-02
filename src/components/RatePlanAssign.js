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
    Modal, Typography, DatePicker, notification
} from "antd";
import {PlusCircleFilled} from "@ant-design/icons";
import dayjs from "dayjs";
import {RatePlanAssignService} from "../services/RatePlanAssignService";
import {PartyService} from "../services/PartyService";



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

        const queryData = ["ratePlanAssignmentId", "ratePlanId", "partyId"].reduce((acc, v) => {
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
            <Form.Item name="ratePlanId" label="Rateplan Id" children={<Input />} style={{display:"inline-block",marginBottom:'0px'}} />
            <Form.Item name="ratePlanId_op" initialValue={"contains"} hidden children={<Input />} />
            <Form.Item name="partyId" label="Party Id" children={<Input />} style={{display:"inline-block",marginBottom:'0px'}} />
            <Form.Item name="partyId_op" initialValue={"contains"} hidden children={<Input />} />

            {/*<Form.Item name="createdOn_fld0_value" label="From Date" style={{display: 'inline-block', marginBottom: '0px'}} children={<DatePicker format={"MMM D, YYYY"}/>}/>*/}
            {/*<Form.Item name="createdOn_fld0_op" initialValue={"greaterThanEqualTo"} hidden children={<Input/>}/>*/}
            {/*<Form.Item name="createdOn_fld1_value" label="To Date" style={{display: 'inline-block', marginBottom: '0px'}} children={<DatePicker format={"MMM D, YYYY"}/>}/>*/}
            {/*<Form.Item name="createdOn_fld1_op" initialValue={"lessThanEqualTo"} hidden children={<Input/>}/>*/}

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

const WriteForm = ({ parties, recordArg, onRecordSaved, close }) => {
    console.log(parties);
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
                padding:'15px'
            }}
        >
            <Form.Item style={{marginBottom:'5px'}} name="ratePlanAssignmentId" label="Rate-Plan Assignment ID" rules={[{ required: false }]} hidden children={<Input disabled={!isCreateForm} />} />
            <Form.Item name="ratePlanId" label="Rate-Plan ID" rules={[{ required: true }]}  children={<Input />} />
            <Form.Item name="partyId" label="Party ID" rules={[{ required: true }]} children={
                <Select
                    showSearch
                    placeholder="Select a party"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={parties.map(data=>{return {value:data.partyId}})}
                />
            } />
            <Form.Item name="effectiveDate" label="Effective Date" rules={[{ required: true }]}  children={<DatePicker showTime use12Hours={true} format="YYYY-MM-DD HH:mm:ss" />} />

            <Form.Item wrapperCol={{ offset: 16}}>
                <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => writeForm
                        .validateFields()
                        .then(_ =>{
                            const formData = writeForm.getFieldsValue();
                            formData.effectiveDate = formData.effectiveDate.format("YYYY-MM-DD HH:mm:ss");
                            return RatePlanAssignService.saveRecord(formData);
                        })
                        .then(data => {
                            console.log(data);
                            setLastWrite(data);
                            onRecordSaved(data);
                            notification.success({
                                key: `crateplanassign_${Date.now()}`,
                                message: "Task Complete",
                                description: <>Rateplan Assigned: {data.ratePlanAssignmentId}</>,
                                duration: 5
                            });
                        })
                        .catch(error => {alert(error.message)})
                    }
                    children={"Submit"}
                />
                <Button style={{backgroundColor: '#FF0000', color: 'white', border: 'none',marginLeft:4}} onClick={close}>Close</Button>
            </Form.Item>
        </Form>
    </>);
};

const DataView = ({ ratePlanAssignments, viewPage, viewLimit, onEdit }) => {
    return (<>
        <Table
            style={{marginLeft:6}}
            size="small"
            dataSource={ratePlanAssignments}
            rowKey={"ratePlanAssignmentId"}
            locale={{ emptyText: ratePlanAssignments === null ? "E" : "No Data" }}
            pagination={false}
        >
            <Table.Column title="Rate-Plan Id" dataIndex={"ratePlanId"} />
            <Table.Column title="Rate-Plan Name" dataIndex={"ratePlanName"} />
            <Table.Column title="Party Name" dataIndex={"partyName"} />
            <Table.Column title="Effective Date" dataIndex={"effectiveDate"} render={value => dayjs(value).format("MMM D, YYYY - hh:mm A")}/>
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

export const RatePlanAssignment  = () => {
    const [lastQuery, setLastQuery] = useState({});
    const [ratePlanAssignments, setRatePlanAssignments] = useState([]);
    const [parties, setParties] = useState([]);
    const [partyFetchResultCount, setPartyFetchResultCount] = useState(0);
    const [partyFetchError, setPartyFetchError] = useState(null);

    const {Title} = Typography;

    const [modalData, setModalData] = useState(null);
    const showModal = data => setModalData(data);
    const handleOk = () => setModalData(null);
    const handleCancel = () => setModalData(null);

    useEffect(() => {
        RatePlanAssignService.fetchRecords(lastQuery)
            .then((data) => {
                console.log(data);
                setRatePlanAssignments(data);
                setPartyFetchResultCount(data.count);
                setPartyFetchError(null);
            })
            .catch(error => {
                setRatePlanAssignments([]);
                setPartyFetchResultCount(0);
                setPartyFetchError(error);
            });
    }, [lastQuery]);

    useEffect(() => {
        PartyService.fetchRecords({})
            .then(data => {
                console.log(data);
                setParties(data.parties);
            })
    },[])
    useEffect(() => {
        setLastQuery({ page: 1, limit: 10 })
    }, []);

    // useEffect(() => {
    //     setLastQuery({ page: 1, limit: 10 })
    // }, []);

    return (<>
        <Row style={{marginLeft: 5}}>
            <Col md={24}>
                <Card title={<Title level={5}>Rate-Plan Assignment</Title>}
                      headStyle={{backgroundColor: "#f0f2f5", border: 0, padding: '0px'}}
                      extra={
                          <Button type="primary" style={{background: "#1890ff", borderColor: "#1890ff"}}
                                  icon={<PlusCircleFilled/>} onClick={() => showModal({})}>
                              Create Rate-Plan Assignment
                          </Button>}
                      style={{height: 135}} size="small">
                    <SearchForm onSearch={data => setLastQuery({ ...(data || {}), page: 1, limit: lastQuery.limit })}/>
                </Card>
            </Col>
            <Modal closable={false} key="recordEditor" visible={modalData}
                   maskClosable={false} onCancel={handleCancel} footer={null} bodyStyle={{height:"17rem"}}>
                <WriteForm recordArg={modalData} parties={parties} onRecordSaved={_ => setLastQuery({ ...lastQuery, orderBy: "lastUpdatedStamp DESC", page: 1 })} close={handleCancel}/>
            </Modal>
        </Row>
        <DataView ratePlanAssignments={ratePlanAssignments} viewLimit={lastQuery.limit} viewPage={lastQuery.page} onEdit={showModal}/>
        <DataPager totalPagingItems={partyFetchResultCount} currentPage={lastQuery.page}
                   onPagingChange={(page, limit) => setLastQuery({ ...lastQuery, page, limit })} />
    </>);
};
