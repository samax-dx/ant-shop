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
    Modal, Typography, DatePicker, Checkbox
} from "antd";
import {countries} from "countries-list";
import {PlusCircleFilled} from "@ant-design/icons";
import dayjs from "dayjs";
import {RouteService} from "../services/RouteService";


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

        const queryData = ["routeId", "description"].reduce((acc, v) => {
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
            <Form.Item name="routeId" label="Route ID" children={<Input />} style={{display:"inline-block",marginBottom:'0px'}} />
            <Form.Item name="routeId_op" initialValue={"contains"} hidden children={<Input />} />
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

const WriteForm = ({ form, record, onRecordSaved }) => {
    const { Option } = Select;
    const [createForm] = Form.useForm(form);
    var rec = { ...record };
    if (rec.disabled !== "Y") {
        console.log("fefg");
        rec.disabled = null;
    }

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
            <Form.Item name="routeId" label="Route ID" rules={[{ required: true }]} children={<Input />} />

            <Form.Item name="description" label="Description" children={<Input />} />
            <Form.Item name="disabled" label="Disabled" valuePropName="checked" children={<Checkbox />} />
            <Form.Item wrapperCol={{ offset: 0}} style={{marginLeft: 150}} >
                <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => createForm
                        .validateFields()
                        .then(_ => RouteService.saveRecord(createForm.getFieldsValue()))
                        .then(routeId => {
                            alert("Route Create Success!");
                            onRecordSaved(routeId);
                        })
                        .catch(error => {alert(error.message)})
                    }
                    children={"Submit"}
                />
            </Form.Item>
        </Form>
    </>);
};

const DataView = ({ routes, viewPage, viewLimit, onEdit }) => {
    return (<>
        <Table
            style={{marginLeft:6}}
            size="small"
            dataSource={routes}
            rowKey={"routeId"}
            locale={{ emptyText: routes === null ? "E" : "No Data" }}
            pagination={false}
        >
            <Table.Column
                dataIndex={undefined}
                title={"#"}
                render={(_, __, i) => (viewPage - 1) * viewLimit + (++i)}
            />
            <Table.Column title="Route ID" dataIndex={"routeId"}/>
            <Table.Column title="Description" dataIndex={"description"} />
            <Table.Column title="Disabled" dataIndex={"disabled"} render={disabled => disabled === "Y" ? "Yes" : "No" } />

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

export const RouteNew = () => {
    const [lastQuery, setLastQuery] = useState({});
    const [routes, setRoutes] = useState([]);
    const [partyFetchResultCount, setPartyFetchResultCount] = useState(0);
    const [partyFetchError, setPartyFetchError] = useState(null);

    const {Title} = Typography;
    const [writeForm] = Form.useForm();

    const [modalData, setModalData] = useState(null);
    const showModal = data => setModalData(data);
    const handleOk = () => setModalData(null);
    const handleCancel = () => setModalData(null);

    useEffect(() => {
        RouteService.fetchRecords(lastQuery)
            .then((data) => {
                setRoutes(data.routes);
                setPartyFetchResultCount(data.count);
                setPartyFetchError(null);
            })
            .catch(error => {
                setRoutes([]);
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
                <Card title={<Title level={5}>Route</Title>}
                      headStyle={{backgroundColor: "#f0f2f5", border: 0, padding: '0px'}}
                      extra={
                          <Button type="primary" style={{background: "#1890ff", borderColor: "#1890ff"}}
                                  icon={<PlusCircleFilled/>} onClick={() => showModal({})}>
                              Create Route
                          </Button>}
                      style={{height: 135}} size="small">
                    <SearchForm onSearch={data => setLastQuery({ ...(data || {}), page: 1, limit: lastQuery.limit })}/>
                </Card>
            </Col>
            <Modal header="Create Route" key="recordEditor" visible={modalData}
                   maskClosable={false} onOk={handleOk} onCancel={handleCancel}>
                <WriteForm form={writeForm} record={modalData} onRecordSaved={_ => setLastQuery({ ...lastQuery, orderBy: "routeId DESC", page: 1 })}/>
            </Modal>
        </Row>
        <DataView routes={routes} viewLimit={lastQuery.limit} viewPage={lastQuery.page} onEdit={showModal}/>
        <DataPager totalPagingItems={partyFetchResultCount} currentPage={lastQuery.page}
                   onPagingChange={(page, limit) => setLastQuery({ ...lastQuery, page, limit })} />
    </>);
};
