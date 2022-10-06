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
import {SenderIdManagerService} from "../services/SenderIdManagerService";
import {countries} from "countries-list";
import {PlusCircleFilled} from "@ant-design/icons";
import dayjs from "dayjs";


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

        const queryData = ["name", "phoneNumber", "createdOn_fld0_value", "createdOn_fld1_value"].reduce((acc, v) => {
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
            <Form.Item name="name" label="Sender-ID" children={<Input />} style={{display:"inline-block",marginBottom:'0px'}} />
            <Form.Item name="name_op" initialValue={"contains"} hidden children={<Input />} />

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
            onFinish={form.resetFields}
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
                        .then(_ => SenderIdManagerService.saveRecord(createForm.getFieldsValue()) && alert("Sender Create Success!"))
                        .catch(error => {alert(error.message)})
                    }
                    children={"Submit"}
                />
            </Form.Item>
        </Form>
    </>);
};

const DataView = ({ parties, viewPage, viewLimit, onEdit }) => {
    return (<>
        <Table
            style={{marginLeft:6}}
            size="small"
            dataSource={parties}
            rowKey={"partyId"}
            locale={{ emptyText: parties === null ? "E" : "No Data" }}
            pagination={false}
        >
            <Table.Column
                dataIndex={undefined}
                title={"#"}
                render={(_, __, i) => (viewPage - 1) * viewLimit + (++i)}
            />
            <Table.Column title="User ID" dataIndex={"loginId"} />
            <Table.Column title="Name" dataIndex={"name"} />
            <Table.Column title="Contact Number" dataIndex={"contactNumber"} />
            <Table.Column title="Created On" dataIndex={"createdOn"} render={value => dayjs(value).format("MMM D, YYYY - hh:mm A")} />

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

export const SenderIdManager = () => {
    const [lastQuery, setLastQuery] = useState({});
    const [parties, setParties] = useState([]);
    const [partyFetchResultCount, setPartyFetchResultCount] = useState(0);
    const [partyFetchError, setPartyFetchError] = useState(null);

    const {Title} = Typography;
    const [writeForm] = Form.useForm();

    const [modalData, setModalData] = useState(null);
    const showModal = data => setModalData(data);
    const handleOk = () => setModalData(null);
    const handleCancel = () => setModalData(null);

    useEffect(() => {
        SenderIdManagerService.fetchRecords(lastQuery)
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
        setLastQuery({ page: 1, limit: 10 })
    }, []);

    return (<>
        <Row style={{marginLeft: 5}}>
            <Col md={24}>
                <Card title={<Title level={5}>Sender ID</Title>}
                      headStyle={{backgroundColor: "#f0f2f5", border: 0, padding: '0px'}}
                      extra={
                          <Button type="primary" style={{background: "#1890ff", borderColor: "#1890ff"}}
                                  icon={<PlusCircleFilled/>} onClick={() => showModal({})}>
                              Create Sender
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
        <DataView parties={parties} viewLimit={lastQuery.limit} viewPage={lastQuery.page} onEdit={showModal}/>
        <DataPager totalPagingItems={partyFetchResultCount} currentPage={lastQuery.page}
                   onPagingChange={(page, limit) => setLastQuery({ ...lastQuery, page, limit })} />
    </>);
};
