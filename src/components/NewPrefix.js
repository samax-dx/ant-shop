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
import {PrefixService} from "../services/PrefixService";
import {countries} from "countries-list";
import {PlusCircleFilled} from "@ant-design/icons";
import dayjs from "dayjs";



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

        const queryData = ["prefixId", "countryCode", "description"].reduce((acc, v) => {
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
            <Form.Item name="prefixId" label="Prefix" children={<Input />} style={{display:"inline-block",marginBottom:'0px'}} />
            <Form.Item name="prefixId_op" initialValue={"contains"} hidden children={<Input />} />
            <Form.Item name="countryCode" label="Country Code" children={<Input />} style={{display:"inline-block",marginBottom:'0px'}} />
            <Form.Item name="countryCode_op" initialValue={"contains"} hidden children={<Input />} />
            <Form.Item name="description" label="Description" children={<Input />} style={{display:"inline-block",marginBottom:'0px'}} />
            <Form.Item name="description_op" initialValue={"contains"} hidden children={<Input />} />

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
            <Form.Item style={{marginBottom:'5px'}} name="prefixId" label="Prefix" rules={[{ required: true }]} children={<Input />} />

            <Form.Item style={{marginBottom:'5px'}}
                       name="countryCode"
                       label="Country Code"
                       children={(
                           <Select
                               showSearch
                               style={{ width: 200 }}
                               onChange={_ => console.log("changed")}
                               optionFilterProp="children"
                               filterOption={true}
                               allowClear={true}
                           >
                               {
                                   Object.entries(countries).map(([code, { name, emoji, phone }]) => {
                                       return (
                                           <Select.Option value={phone} key={phone}>
                                               {emoji}&nbsp;&nbsp;{name}
                                           </Select.Option>
                                       );
                                   })
                               }
                           </Select>
                       )}
            />
            <Form.Item name="description" label="Description"  children={<Input />} />

            <Form.Item wrapperCol={{ offset: 0}} style={{marginLeft: 200}} >
                <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => createForm
                        .validateFields()
                        .then(_ => PrefixService.saveRecord(createForm.getFieldsValue()) && alert("Prefix Create Success!"))
                        .catch(error => {alert(error.message)})
                    }
                    children={"Submit"}
                />
            </Form.Item>
        </Form>
    </>);
};

const DataView = ({ prefixes, viewPage, viewLimit, onEdit }) => {
    return (<>
        <Table
            style={{marginLeft:6}}
            size="small"
            dataSource={prefixes}
            rowKey={"prefixId"}
            locale={{ emptyText: prefixes === null ? "E" : "No Data" }}
            pagination={false}
        >
            <Table.Column
                dataIndex={undefined}
                title={"#"}
                render={(_, __, i) => (viewPage - 1) * viewLimit + (++i)}
            />
            <Table.Column title="Prefix" dataIndex={"prefixId"} />
            <Table.Column title="Country Code" dataIndex={"countryCode"} />
            <Table.Column title="Description" dataIndex={"description"} />
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

export const NewPrefix  = () => {
    const [lastQuery, setLastQuery] = useState({});
    const [prefixes, setPrefixes] = useState([]);
    const [partyFetchResultCount, setPartyFetchResultCount] = useState(0);
    const [partyFetchError, setPartyFetchError] = useState(null);

    const {Title} = Typography;
    const [writeForm] = Form.useForm();

    const [modalData, setModalData] = useState(null);
    const showModal = data => setModalData(data);
    const handleOk = () => setModalData(null);
    const handleCancel = () => setModalData(null);

    useEffect(() => {
        PrefixService.fetchRecords(lastQuery)
            .then((data) => {
                setPrefixes(data.prefixes);
                setPartyFetchResultCount(data.count);
                setPartyFetchError(null);
            })
            .catch(error => {
                setPrefixes([]);
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
                <Card title={<Title level={5}>Prefix</Title>}
                      headStyle={{backgroundColor: "#f0f2f5", border: 0, padding: '0px'}}
                      extra={
                          <Button type="primary" style={{background: "#1890ff", borderColor: "#1890ff"}}
                                  icon={<PlusCircleFilled/>} onClick={() => showModal({})}>
                              Create Prefix
                          </Button>}
                      style={{height: 135}} size="small">
                    <SearchForm onSearch={data => setLastQuery({ ...(data || {}), page: 1, limit: lastQuery.limit })}/>
                </Card>
            </Col>
            <Modal header="Create Prefix" key="recordEditor" visible={modalData}
                   maskClosable={false} onOk={handleOk} onCancel={handleCancel}>
                <WriteForm form={writeForm} record={modalData}/>
            </Modal>
        </Row>
        <DataView prefixes={prefixes} viewLimit={lastQuery.limit} viewPage={lastQuery.page} onEdit={showModal}/>
        <DataPager totalPagingItems={partyFetchResultCount} currentPage={lastQuery.page}
                   onPagingChange={(page, limit) => setLastQuery({ ...lastQuery, page, limit })} />
    </>);
};
