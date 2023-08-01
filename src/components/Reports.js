import React, {useEffect, useRef, useState} from "react";
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
    Modal, Typography, DatePicker, notification, Tooltip, Upload, message, Checkbox, TimePicker, Descriptions, Tag
} from "antd";
import Title from "antd/es/typography/Title";
import {Br} from "./Br";
import dayjs from "dayjs";
import {ProductService} from "../services/ProductService";
import {CampaignService} from "../services/CampaignService";
import {
    ExclamationCircleOutlined,
    FileDoneOutlined,
    FileTextOutlined,
    FileTextTwoTone,
    PlusCircleFilled
} from "@ant-design/icons";
import moment from 'moment';
import {PartyIdCatcher} from "./HomeNew";
import {DebounceSelectForCampaign} from "./DebounceSelectForCampaignDropdown";
import {DebounceSelectForRoute} from "./DebounceSelectForRouteDropdown";
import {DebounceSelectForParty} from "./DebounceSelectForPartyDropdown";
import {ReportsService} from "../services/ReportsService";


const SearchForm = ({ onSearch }) => {
    const [searchForm] = Form.useForm();

    const performSearch = () => {
        const formData = searchForm.getFieldsValue();

        ["createdOn_fld0_value", "createdOn_fld1_value"].forEach((n, i) => {
            const date = formData[n];
            formData[n] = date ? dayjs(date).add(i, "day").format("YYYY-MM-DD HH:mm:ss") : null;

            if (formData[n] === null) {
                delete formData[n];
            }
        });

        const queryData = ["campaignId","routeId","createdOn_fld0_value", "createdOn_fld1_value"].reduce((acc, v) => {
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
        // onSearch(queryData);
        onSearch(Object.keys(queryData).length ? queryData : null);
    };

    return (<>
        <Form
            form={searchForm}
            labelCol={{ span: 22 }}
            wrapperCol={{ span: 23 }}
            labelAlign="left"
            initialValues={{ createdOn_fld0_value: moment().subtract(1, 'days'), createdOn_fld1_value:moment(new Date()) }}
        >
            <Form.Item style={{display:'inline-block', margin:'0px'}} name="campaignId" label="Campaign Id" children={<DebounceSelectForCampaign />} />
            <Form.Item name="campaignId_op" initialValue={"contains"} hidden children={<Input />} />
            <Form.Item style={{display:'inline-block', margin:'0px'}} name="routeId" label="Route Name" children={<DebounceSelectForRoute />} />
            <Form.Item name="routeId_op" initialValue={"contains"} hidden children={<Input />} />
            <Form.Item style={{display:'inline-block', margin:'0px'}} name="partyId" label="Party ID" children={<DebounceSelectForParty />} />
            <Form.Item name="partyId_op" initialValue={"contains"} hidden children={<Input />} />
            <Form.Item style={{display:'inline-block', margin:'0px'}} name="createdOn_fld0_value" label="From Date" children={<DatePicker showTime use12Hours={true} format="YYYY-MM-DD HH:mm:ss" />} />
            <Form.Item name="createdOn_fld0_op" initialValue={"greaterThanEqualTo"} hidden children={<Input />} />
            <Form.Item style={{display:'inline-block', margin:'0px'}} name="createdOn_fld1_value" label="To Date" children={<DatePicker showTime use12Hours={true} format="YYYY-MM-DD HH:mm:ss" />} />
            <Form.Item name="createdOn_fld1_op" initialValue={"lessThanEqualTo"} hidden children={<Input />} />
            <Form.Item wrapperCol={{ offset: 5 }} style={{display:'inline-block', margin:'0px'}} colon={false} label=' '>
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


const DataView = ({ report, viewPage, viewLimit}) => {

    return (<>
        <Table
            style={{marginLeft:6}}
            size="small"
            dataSource={report}
            rowKey={"prefixId"}
            locale={{ emptyText: report === null ? "E" : "No Data" }}
            pagination={false}
        >
            <Table.Column
                dataIndex={undefined}
                title={"#"}
                render={(_, __, i) => (viewPage - 1) * viewLimit + (++i)}
            />
            <Table.Column title="Party Id" dataIndex={"partyId"} />
            <Table.Column title="Campaign Id" dataIndex={"campaignId"} />
            <Table.Column title="Route Id" dataIndex={"routeId"} />
            <Table.Column title="Total" dataIndex={"total"} />
            <Table.Column title="Delivered" dataIndex={"delivered"} />
            <Table.Column title="In Process" dataIndex={"inProcess"} />
            <Table.Column title="Suspended" dataIndex={"suspended"} />
            <Table.Column title="Failed" dataIndex={"failed"} />
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

export const Reports = () => {

    // Component States
    const [lastQuery, setLastQuery] = useState({});
    const [campaigns, setCampaigns] = useState([]);
    const [reports, setReports] = useState([]);
    const [CampaignsFetchCount, setCampaignsFetchCount] = useState(0);
    const [CampaignsFetchError, setCampaignsFetchError] = useState(null);

    const [modalData, setModalData] = useState(null);
    const showModal = data => setModalData(data);
    const handleOk = () => setModalData(null);
    const handleCancel = () => setModalData(null);

    useEffect(() => {
        ReportsService.fetchRecords(lastQuery)
            .then((data) => {
                console.log(data)
                setReports(data);
                setCampaignsFetchCount(data.count);
                setCampaignsFetchError(null);
            })
            .catch(error => {
                setCampaigns([]);
                setCampaignsFetchCount(0);
                setCampaignsFetchError(error);
            });
    }, [lastQuery]);

    useEffect(() => {
        setLastQuery({ page: 1, limit: 10 })
    }, []);


    return (<>
        <Row >
            <Col md={24} style={{marginLeft:'5px'}}>
                <Card title={<Title level={5}>Report Details</Title>}
                      headStyle={{backgroundColor:"#f0f2f5", border: 0,padding:'0px'}}
                      size="small"
                      // extra={
                      //     <Button type="primary" style={{ background:"#1890ff", borderColor:"#1890ff"}} icon={<PlusCircleFilled />} onClick={showModal}>
                      //         Create Campaign
                      //     </Button>}
                >
                    <SearchForm onSearch={data => setLastQuery({ ...(data || {}), page: 1, limit: lastQuery.limit, orderBy: lastQuery.orderBy })}/>
                </Card>
            </Col>
            {/*<Modal width={1000} header="Create Campaign" key="createCampaign" visible={modalData} footer={null} maskClosable={false} closable={false} style={{ top: 20 }} bodyStyle={{height:"57rem"}}>*/}
            {/*    <WriteForm close={handleCancel} recordArg={modalData} onRecordSaved={_ => setLastQuery({ ...lastQuery, orderBy: "updatedOn DESC", page: 1 })} />*/}
            {/*</Modal>*/}
        </Row>
        <DataView report={reports} viewPage={lastQuery.page} viewLimit={lastQuery.limit} onEdit={showModal}/>
        <Br />
        <DataPager totalPagingItems={CampaignsFetchCount} currentPage={lastQuery.page}
                              onPagingChange={(page, limit) => setLastQuery({ ...lastQuery, page, limit })} />
    </>);
};
