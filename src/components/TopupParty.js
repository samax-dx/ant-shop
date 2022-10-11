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
    Modal, Typography, DatePicker, notification, Spin
} from "antd";
import {countries} from "countries-list";
import {PlusCircleFilled} from "@ant-design/icons";
import dayjs from "dayjs";
import {AccountingService} from "../services/AccountingService";
import {PartyService} from "../services/PartyService";


const SearchForm = ({onSearch}) => {
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

        const queryData = ["name", "phoneNumber"].reduce((acc, v) => {
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
            wrapperCol={{span: 23}}
            labelAlign="left"
        >
            <Form.Item name="loginId" label="User ID" children={<Input/>}
                       style={{display: "inline-block", marginBottom: '0px'}}/>
            <Form.Item name="loginId_op" initialValue={"contains"} hidden children={<Input/>}/>
            <Form.Item name="name" label="Name" children={<Input/>}
                       style={{display: "inline-block", marginBottom: '0px'}}/>
            <Form.Item name="name_op" initialValue={"contains"} hidden children={<Input/>}/>

            {/*<Form.Item name="createdOn_fld0_value" label="From Date" style={{display: 'inline-block', marginBottom: '0px'}} children={<DatePicker format={"MMM D, YYYY"}/>}/>*/}
            {/*<Form.Item name="createdOn_fld0_op" initialValue={"greaterThanEqualTo"} hidden children={<Input/>}/>*/}
            {/*<Form.Item name="createdOn_fld1_value" label="To Date" style={{display: 'inline-block', marginBottom: '0px'}} children={<DatePicker format={"MMM D, YYYY"}/>}/>*/}
            {/*<Form.Item name="createdOn_fld1_op" initialValue={"lessThanEqualTo"} hidden children={<Input/>}/>*/}

            <Form.Item style={{display: 'inline-block', marginBottom: 0}} label=" " colon={false}>
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


const DataView = ({parties, viewPage, viewLimit, onRecordSaved}) => {
    const [amountInput, setAmountInput] = useState(null);
    const [spinning, setSpinning] = useState(false);
    // const [lastPayment, setLastPayment] = useState(null);

    const [resetAmount, setResetAmount] = useState(false);
    useEffect(() => resetAmount && setResetAmount(false), [resetAmount])

    return (<>
        {spinning ? <Spin tip="Processing Payment..." size="large">{<Table
                style={{marginLeft: 6, marginRight: 10}}
                size="medium"
                dataSource={parties}
                rowKey={"partyId"}
                locale={{emptyText: parties === null ? "E" : "No Data"}}
                pagination={false}
            >
                <Table.Column
                    dataIndex={undefined}
                    title={"#"}
                    render={(_, __, i) => (viewPage - 1) * viewLimit + (++i)}
                />
                <Table.Column title="User ID" dataIndex={"loginId"}/>
                <Table.Column title="Name" dataIndex={"name"}/>
                <Table.Column title="Contact Number" dataIndex={"contactNumber"}/>

                <Table.Column
                    dataIndex={undefined}
                    title={"Pay Amount"}
                    render={(record, value, index) => (<>
                        <Input onFocus={e => setAmountInput(e.target)} placeholder="Write amount"
                               value={resetAmount ? "" : undefined}/>
                        <Button type="link" onClick={
                            () => setSpinning(true) || AccountingService
                                .addPartyBalance({partyId: record.partyId, amount: +(amountInput.value || 0)})
                                .then(payment => {
                                    setSpinning(false);
                                    setResetAmount(true);
                                    onRecordSaved(payment);
                                    notification.success({
                                        key: `cpayment_${Date.now()}`,
                                        message: "Task Complete",
                                        description: <>Payment Completed: {payment.amount}</>,
                                        duration: 5
                                    });
                                })
                                .catch(error => setSpinning(false) || notification.error({
                                    key: `cpayment_${Date.now()}`,
                                    message: "Task Failed",
                                    description: <>Input Valid Amount{error.message}</>,
                                    duration: 5
                                }))
                        }>Add Payment</Button>
                    </>)}
                />

            </Table>}</Spin> :
            <Table
                style={{marginLeft: 6, marginRight: 10}}
                size="medium"
                dataSource={parties}
                rowKey={"partyId"}
                locale={{emptyText: parties === null ? "E" : "No Data"}}
                pagination={false}
            >
                <Table.Column
                    dataIndex={undefined}
                    title={"#"}
                    render={(_, __, i) => (viewPage - 1) * viewLimit + (++i)}
                />
                <Table.Column title="User ID" dataIndex={"loginId"}/>
                <Table.Column title="Name" dataIndex={"name"}/>
                <Table.Column title="Contact Number" dataIndex={"contactNumber"}/>

                <Table.Column
                    dataIndex={undefined}
                    title={"Pay Amount"}
                    render={(record, value, index) => (<>
                        <Input onFocus={e => setAmountInput(e.target)} placeholder="Write amount"
                               value={resetAmount ? "" : undefined}/>
                        <Button type="link" onClick={
                            () => setSpinning(true) || AccountingService
                                .addPartyBalance({partyId: record.partyId, amount: +(amountInput.value || 0)})
                                .then(payment => {
                                    setSpinning(false);
                                    setResetAmount(true);
                                    onRecordSaved(payment);
                                    notification.success({
                                        key: `cpayment_${Date.now()}`,
                                        message: "Task Complete",
                                        description: <>Payment Completed: {payment.amount}</>,
                                        duration: 5
                                    });
                                })
                                .catch(error => setSpinning(false) || notification.error({
                                    key: `cpayment_${Date.now()}`,
                                    message: "Task Failed",
                                    description: <>Input Valid Amount{error.message}</>,
                                    duration: 5
                                }))
                        }>Add Payment</Button>
                    </>)}
                />

            </Table>}

    </>);
};

const DataPager = ({totalPagingItems, currentPage, onPagingChange}) => {
    return (<>
        <Space align="end" direction="vertical" style={{width: "100%"}}>
            <Pagination
                total={totalPagingItems}
                defaultPageSize={10}
                style={{marginRight: 10}}
                pageSizeOptions={["10", "20", "50", "100", "200"]}
                showSizeChanger={true}
                onChange={onPagingChange}
                current={currentPage}
            />
        </Space>
    </>);
};

export const TopupParty = ({onRecordSaved}) => {
    const [lastQuery, setLastQuery] = useState({});
    const [parties, setParties] = useState([]);
    const [partyFetchResultCount, setPartyFetchResultCount] = useState(0);
    const [partyFetchError, setPartyFetchError] = useState(null);

    const {Title} = Typography;
    const [writeForm] = Form.useForm();


    useEffect(() => {
        PartyService.fetchRecords(lastQuery)
            .then((data) => {
                setParties(data.parties);
                setPartyFetchResultCount(data.count);
                setPartyFetchError(null);
            })
            .catch(error => {
                setParties([]);
                setPartyFetchResultCount(0);
                setPartyFetchError(error);
            });
    }, [lastQuery]);

    useEffect(() => {
        setLastQuery({page: 1, limit: 10})
    }, []);

    return (<>
        <Row style={{marginLeft: 5, marginRight: 10}}>
            <Col md={24}>
                <Card title={<Title level={5}>Find Party To Pay</Title>}
                      headStyle={{backgroundColor: "#f0f2f5", border: 0, padding: '5px'}}
                      style={{height: 135, marginLeft: 5}} size="small">
                    <SearchForm onSearch={data => setLastQuery({...(data || {}), page: 1, limit: lastQuery.limit})}/>
                </Card>
            </Col>
        </Row>
        <DataView parties={parties} viewLimit={lastQuery.limit} viewPage={lastQuery.page}
                  onRecordSaved={onRecordSaved}/>
        <DataPager totalPagingItems={partyFetchResultCount} currentPage={lastQuery.page}
                   onPagingChange={(page, limit) => setLastQuery({...lastQuery, page, limit})}/>
    </>);
};
