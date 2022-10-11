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
    Modal, Typography, DatePicker, notification, Spin
} from "antd";
import {AccountingService} from "../services/AccountingService";
import {countries} from "countries-list";
import {PlusCircleFilled} from "@ant-design/icons";
import dayjs from "dayjs";
import {TopupParty} from "./TopupParty";


const SearchForm = ({ onSearch }) => {
    const [searchForm] = Form.useForm();

    const performSearch = () => {
        const formData = searchForm.getFieldsValue();

        ["createdOn_fld0_value", "createdOn_fld1_value"].forEach((n, i) => {
            const date = formData[n];
            formData[n] = date ? dayjs(date).add(i, "day").format("YYYY-MM-DD") : null;

            if (formData[n] === null) {
                delete formData[n];
            }
        });

        const queryData = ["partyLoginId", "partyName", "createdOn_fld0_value", "createdOn_fld1_value"].reduce((acc, v) => {
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
            <Form.Item name="partyLoginId" label="User-ID" children={<Input />} style={{display:"inline-block",marginBottom:'0px'}} />
            <Form.Item name="partyLoginId_op" initialValue={"contains"} hidden children={<Input />} />
            <Form.Item name="partyName" label="Party Name" children={<Input />} style={{display:"inline-block",marginBottom:'0px'}} />
            <Form.Item name="partyName_op" initialValue={"contains"} hidden children={<Input />} />

            <Form.Item name="createdOn_fld0_value" label="From Date" style={{display: 'inline-block', marginBottom: '0px'}} children={<DatePicker format={"MMM D, YYYY"}/>}/>
            <Form.Item name="createdOn_fld0_op" initialValue={"greaterThanEqualTo"} hidden children={<Input/>}/>
            <Form.Item name="createdOn_fld1_value" label="To Date" style={{display: 'inline-block', marginBottom: '0px'}} children={<DatePicker format={"MMM D, YYYY"}/>}/>
            <Form.Item name="createdOn_fld1_op" initialValue={"lessThanEqualTo"} hidden children={<Input/>}/>

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

const WriteForm = ({ form, record }) => {
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
            onFinish={() => createForm.resetFields()}
        >
            <Form.Item name="partyId" label="ID" style={{ display: "none" }} children={<Input />} />
            <Form.Item name="loginId" label="User ID" rules={[{ required: true }]} children={<Input />} />
            <Form.Item name="name" label="Name" rules={[{ required: true }]} children={<Input />} />

            <Form.Item label="Contact Number" required>
                <Space direction="horizontal" align="start">
                    <Form.Item
                        name="contactMech.countryCode"
                        rules={[{ required: true }]}
                        style={{ minWidth: "150px", margin: 0 }}
                    >
                        <Select
                            showSearch
                            placeholder="country"
                            optionFilterProp="children"
                            filterOption={true}
                            allowClear={true}
                        >
                            {
                                Object.values(countries).map(({ name, emoji, phone }) => {
                                    return (
                                        <Select.Option value={phone} key={phone}>
                                            {emoji}&nbsp;&nbsp;{name}
                                        </Select.Option>
                                    );
                                })
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item name="contactMech.areaCode" style={{ maxWidth: "85px" }} children={<Input placeholder="area code" />} />
                    <Form.Item name="contactMech.contactNumber" rules={[{ required: true }]} children={<Input placeholder="Phone Number" />} />
                </Space>
            </Form.Item>
            <Form.Item name="selectedPolicy" id="selected" label="Schedule Policy" initialValue={""} rules={[{required:true}]}>
                <Select>
                    <Option value="masking">Masking</Option>
                    <Option value="non_masking">Non-Masking</Option>
                </Select>
            </Form.Item>
            <Form.Item name="roles" label="Roles" rules={[{ required: true }]} children={ <Select
                mode="multiple"
                size={'middle'}
                placeholder="Please select"
                defaultValue={['a10', 'c12']}
                style={{
                    width: '100%',
                }}
            >
            </Select>} />
            {record.partyId && <Form.Item
                name="password_old"
                label="Current Password"
                rules={[{ required: true }]}
                hasFeedback
            >
                <Input.Password />
            </Form.Item>}

            <Form.Item
                name="password"
                label={record.partyId ? "New password" : "Password"}
                rules={[{ required: true }]}
                hasFeedback
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                name="passwordConfirm"
                label="Confirm Password"
                dependencies={record.partyId ? ['password_old', 'password'] : ["password"]}
                hasFeedback
                rules={[
                    { required: true },
                    ({ getFieldValue }) => ({
                        validator: (_, value) => {
                            const password = getFieldValue("password");
                            const passwordOld = getFieldValue("passwordOld");
                            if (password === value && password != passwordOld) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Passwords do not match!'));
                        },
                    }),
                ]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 0}} style={{marginLeft: 333}} >
                <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => createForm
                        .validateFields()
                        .then(_ => AccountingService.saveRecord(createForm.getFieldsValue()) && alert("Sender Create Success!"))
                        .catch(error => {alert(error.message)})
                    }
                    children={"Submit"}
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
                    <SearchForm onSearch={data => setLastQuery({ ...(data || {}), page: 1, limit: lastQuery.limit })}/>
                </Card>
            </Col>
            <Modal  width={"90vw"} closable={false} key="recordEditor" visible={modalData}
                   maskClosable={false} onCancel={handleCancel} style={{ top: 20 }} footer={[<Button style={{backgroundColor: '#FF0000', color: 'white', border: 'none'}} onClick={handleOk}>Close</Button>]}>
                <TopupParty onRecordSaved={_ => setLastQuery({ ...lastQuery, page: 1 })}/>
            </Modal>
        </Row>
        <DataView payments={payments} viewLimit={lastQuery.limit} viewPage={lastQuery.page} onEdit={showModal}/>
        <DataPager totalPagingItems={partyFetchResultCount} currentPage={lastQuery.page}
                   onPagingChange={(page, limit) => setLastQuery({ ...lastQuery, page, limit })} />
    </>);
};
