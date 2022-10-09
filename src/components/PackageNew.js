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
import {countries} from "countries-list";
import {PlusCircleFilled} from "@ant-design/icons";
import dayjs from "dayjs";
import {PackageService} from "../services/PackageService";
import {PrefixService} from "../services/PrefixService";
import {ProductService} from "../services/ProductService";


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

        const queryData = ["packageId", "prefix", "dialPlanId"].reduce((acc, v) => {
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
            <Form.Item style={{display:'inline-block',marginBottom:'0px'}} name="packageId" label="Package" children={<Input />} />
            <Form.Item name="packageId_op" initialValue={"contains"} hidden children={<Input />} />
            <Form.Item style={{display:'inline-block',marginBottom:'0px'}} name="dialPlanId" label="DialPlan Prefix" children={<Input />} />
            <Form.Item name="dialPlanId_op" initialValue={"contains"} hidden children={<Input />} />
            <Form.Item style={{display:'inline-block',marginBottom:'0px'}} name="prefix" label="Client Prefix" children={<Input />} />
            <Form.Item name="prefix_op" initialValue={"contains"} hidden children={<Input />} />

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
    const [prefixes, setPrefixes] = useState([]);
    useEffect(()=> {
        PrefixService.fetchRecords({})
            .then(data=>{
                setPrefixes(data.prefixes);
            })
    },[])

    const [productLineups, setProductLineups] = useState([]);
    useEffect(()=> {
        ProductService.fetchProductLineups({})
            .then(data=>{
                setProductLineups(data.lineups);
            })
    },[])

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
            <Form.Item name="packageId" label="Package" rules={[{ required: true }]}>
                <Select showSearch allowClear style={{ minWidth: 150 }}>
                    {productLineups.map((v, i) => <Select.Option value={v.productId} key={i}>{v.productName} ({v.productId})</Select.Option>)}
                </Select>
            </Form.Item>

            <Form.Item name="dialPlanId" label="DialPlan Prefix" rules={[{ required: true }]}>
                <Select showSearch allowClear style={{ minWidth: 150 }}>
                    {prefixes.map((v, i) => <Select.Option value={v.prefixId} key={i}>{v.prefixId}</Select.Option>)}
                </Select>
            </Form.Item>

            <Form.Item name="prefix" label="Client Prefix" children={<Input />} />

            <Form.Item wrapperCol={{ offset: 0}} style={{marginLeft: 150}} >
                <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => createForm
                        .validateFields()
                        .then(_ => PackageService.saveRecord(createForm.getFieldsValue()))
                        .then(packageId => {
                            alert("Package Create Success!");
                            onRecordSaved(packageId);
                        })
                        .catch(error => {alert(error.message)})
                    }
                    children={"Submit"}
                />
            </Form.Item>
        </Form>
    </>);
};

const DataView = ({ packages, viewPage, viewLimit, onEdit }) => {
    return (<>
        <Table
            style={{marginLeft:6}}
            size="small"
            dataSource={packages}
            rowKey={"packageId"}
            locale={{ emptyText: packages === null ? "E" : "No Data" }}
            pagination={false}
        >
            <Table.Column
                dataIndex={undefined}
                title={"#"}
                render={(_, __, i) => (viewPage - 1) * viewLimit + (++i)}
            />
            <Table.Column title="Package" dataIndex={"packageId"}/>
            <Table.Column title="DialPlan Prefix" dataIndex={"dialPlanId"} />
            <Table.Column title="Client Prefix" dataIndex={"prefix"} />

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

export const PackageNew = () => {
    const [lastQuery, setLastQuery] = useState({});
    const [packages, setPackages] = useState([]);
    const [partyFetchResultCount, setPartyFetchResultCount] = useState(0);
    const [partyFetchError, setPartyFetchError] = useState(null);

    const {Title} = Typography;
    const [writeForm] = Form.useForm();

    const [modalData, setModalData] = useState(null);
    const showModal = data => setModalData(data);
    const handleOk = () => setModalData(null);
    const handleCancel = () => setModalData(null);

    useEffect(() => {
        PackageService.fetchRecords(lastQuery)
            .then((data) => {
                setPackages(data.packages);
                setPartyFetchResultCount(data.count);
                setPartyFetchError(null);
            })
            .catch(error => {
                setPackages([]);
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
                <Card title={<Title level={5}>Package</Title>}
                      headStyle={{backgroundColor: "#f0f2f5", border: 0, padding: '0px'}}
                      extra={
                          <Button type="primary" style={{background: "#1890ff", borderColor: "#1890ff"}}
                                  icon={<PlusCircleFilled/>} onClick={() => showModal({})}>
                              Create Package
                          </Button>}
                      style={{height: 135}} size="small">
                    <SearchForm onSearch={data => setLastQuery({ ...(data || {}), page: 1, limit: lastQuery.limit })}/>
                </Card>
            </Col>
            <Modal header="Create Package" key="recordEditor" visible={modalData}
                   maskClosable={false} onCancel={handleCancel} footer={[<Button style={{backgroundColor: '#FF0000', color: 'white', border: 'none'}} onClick={handleOk}>Close</Button>]}>
                <WriteForm form={writeForm} record={modalData} onRecordSaved={_ => setLastQuery({ ...lastQuery, orderBy: "packageId DESC", page: 1 })}/>
            </Modal>
        </Row>
        <DataView packages={packages} viewLimit={lastQuery.limit} viewPage={lastQuery.page} onEdit={showModal}/>
        <DataPager totalPagingItems={partyFetchResultCount} currentPage={lastQuery.page}
                   onPagingChange={(page, limit) => setLastQuery({ ...lastQuery, page, limit })} />
    </>);
};
