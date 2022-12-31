import React, {useEffect, useState} from "react";
import {
    Button,
    Card,
    Col,
    DatePicker,
    Form,
    Input,
    Modal,
    Pagination,
    Row,
    Select,
    Space,
    Table,
    Typography
} from "antd";
import {AccountingService} from "../services/AccountingService";
import {countries} from "countries-list";
import {PlusCircleFilled} from "@ant-design/icons";
import dayjs from "dayjs";
import {TopupParty} from "./TopupParty";
import {ModalTitleBar} from "./ModalTitleBar";
import moment from "moment";


const SearchForm = ({ onSearch }) => {
    const [searchForm] = Form.useForm();

    const performSearch = () => {
        const formData = searchForm.getFieldsValue();

        ["date_fld0_value", "date_fld1_value"].forEach((n, i) => {
            const date = formData[n];
            formData[n] = date ? dayjs(date).add(i, "day").format("YYYY-MM-DD HH:mm:ss") : null;

            if (formData[n] === null) {
                delete formData[n];
            }
        });

        const queryData = ["partyLoginId", "partyName", "date_fld0_value", "date_fld1_value"].reduce((acc, v) => {
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
            initialValues={{ date_fld0_value: moment().subtract(1, 'days'), date_fld1_value:moment(new Date()) }}
        >
            <Form.Item name="partyLoginId" label="User-ID" children={<Input />} style={{display:"inline-block",marginBottom:'0px'}} />
            <Form.Item name="partyLoginId_op" initialValue={"contains"} hidden children={<Input />} />
            <Form.Item name="partyName" label="Party Name" children={<Input />} style={{display:"inline-block",marginBottom:'0px'}} />
            <Form.Item name="partyName_op" initialValue={"contains"} hidden children={<Input />} />

            <Form.Item name="date_fld0_value" label="From Date" style={{display: 'inline-block', marginBottom: '0px'}} children={<DatePicker showTime use12Hours={true} format="YYYY-MM-DD HH:mm:ss" />}/>
            <Form.Item name="date_fld0_op" initialValue={"greaterThanEqualTo"} hidden children={<Input/>}/>
            <Form.Item name="date_fld1_value" label="To Date" style={{display: 'inline-block', marginBottom: '0px'}} children={<DatePicker showTime use12Hours={true} format="YYYY-MM-DD HH:mm:ss" />}/>
            <Form.Item name="date_fld1_op" initialValue={"lessThanEqualTo"} hidden children={<Input/>}/>

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

const DataView = ({ payments, viewPage, viewLimit, onEdit }) => {
    return (<>
        <Table
            style={{marginLeft:6}}
            size="small"
            dataSource={payments}
            rowKey={"paymentId"}
            locale={{ emptyText: payments === null ? "E" : "No Data" }}
            pagination={false}
        >
            <Table.Column
                dataIndex={undefined}
                title={"#"}
                render={(_, __, i) => (viewPage - 1) * viewLimit + (++i)}
            />
            <Table.Column title="Payment ID" dataIndex={"paymentId"} />
            <Table.Column title="User ID" dataIndex={"partyLoginId"} />
            <Table.Column title="Party Name" dataIndex={"partyName"} />
            <Table.Column title="Date" dataIndex={"createdOn"} render={value => dayjs(value).format("MMM D, YYYY - hh:mm A")} />
            <Table.Column title="Amount" dataIndex={"amount"} />

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

export const Topup = () => {
    const [lastQuery, setLastQuery] = useState({});
    const [payments, setPayments] = useState([]);
    const [partyFetchResultCount, setPartyFetchResultCount] = useState(0);
    const [partyFetchError, setPartyFetchError] = useState(null);

    const {Title} = Typography;
    const [writeForm] = Form.useForm();

    const [modalData, setModalData] = useState(null);
    const showModal = data => setModalData(data);
    const handleOk = () => setModalData(null);
    const handleCancel = () => setModalData(null);

    useEffect(() => {
        AccountingService.fetchBalanceRequests(lastQuery)
            .then((data) => {
                setPayments(data.payments);
                setPartyFetchResultCount(data.count);
                setPartyFetchError(null);
            })
            .catch(error => {
                setPayments([]);
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
                <Card title={<Title level={5}>TopUp / Payment</Title>}
                      headStyle={{backgroundColor: "#f0f2f5", border: 0, padding: '0px'}}
                      extra={
                          <Button type="primary" style={{background: "#1890ff", borderColor: "#1890ff"}}
                                  icon={<PlusCircleFilled/>} onClick={() => showModal({})}>
                              TopUp / Make Payment
                          </Button>}
                      style={{height: 135}} size="small">
                    <SearchForm onSearch={data => setLastQuery({ ...(data || {}), page: 1, limit: lastQuery.limit, orderBy: lastQuery.orderBy })}/>
                </Card>
            </Col>
            <Modal bodyStyle={{padding: 0}} width={"90vw"} closable={false} key="recordEditor" visible={modalData}
                   maskClosable={false} onCancel={handleCancel} style={{ top: 20 }} footer={[<Button style={{backgroundColor: '#FF0000', color: 'white', border: 'none'}} onClick={handleOk}>Close</Button>]}>
                <ModalTitleBar onClose={handleCancel}>Find Party to Pay</ModalTitleBar>
                <Card bordered={false}>
                    <TopupParty onRecordSaved={_ => setLastQuery({ ...lastQuery, page: 1 })}/>
                </Card>
            </Modal>
        </Row>
        <DataView payments={payments} viewLimit={lastQuery.limit} viewPage={lastQuery.page} onEdit={showModal}/>
        <DataPager totalPagingItems={partyFetchResultCount} currentPage={lastQuery.page}
                   onPagingChange={(page, limit) => setLastQuery({ ...lastQuery, page, limit })} />
    </>);
};
