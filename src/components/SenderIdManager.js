import { useEffect, useState } from "react";
import {
    Form,
    Input,
    Button,
    Table,
    Space,
    Pagination,
    DatePicker,
    notification,
    Collapse,
    Card,
    Select,
    Row,
    Col,
    Modal, Typography, Upload
} from "antd";
import {SenderIdManagerService} from "../services/SenderIdManagerService";
import {countries} from "countries-list";
import {PartySearchForm} from "./PartyWidgets";
import {PlusCircleFilled} from "@ant-design/icons";


/*const SearchForm = ({ onSearch }) => {
    const [searchForm] = Form.useForm();

    const performSearch = () => {
        const formData = searchForm.getFieldsValue();

        // ["date_fld0_value", "date_fld1_value"].forEach((n, i) => {
        //     const date = formData[n];
        //     formData[n] = date ? dayjs(date).add(i, "day").format("YYYY-MM-DD") : "";
        // });

        const queryData = ["senderId"].reduce((acc, v) => {
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
        onSearch(queryData);
    };

    return (<>
        <Form
            form={searchForm}
            labelCol={{span: 18}}
            wrapperCol={{ span: 23}}
            labelAlign="left"
            //layout={"horizontal"}

        >
            <Form.Item style={{display:"inline-block",marginBottom:'0px'}} name="loginId" label="Sender-ID" children={<Input />} />
            <Form.Item name="senderId_op" initialValue={"contains"} hidden children={<Input />} />
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
};*/

const EditForm = ({ form, record, onSave, prefixes, routes }) => {
    const [editForm] = Form.useForm(form);

    return (<>
        <Form
            form={editForm}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 20 }}
            labelAlign={"left"}
            style={{
                padding:'15px'
            }}
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
                    onClick={() => editForm
                        .validateFields()
                        .then(_ => onSave(editForm.getFieldsValue()))
                        .catch(_ => { })
                    }
                    children={"Submit"}
                />
            </Form.Item>
        </Form>
    </>);
};

const DataView = ({ parties, viewPage, viewLimit,onEdit }) => {
    console.log(parties);
    console.log(viewLimit);

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

            <Table.Column
                title="Actions"
                dataIndex={undefined}
                render={(_, senderId, i) => {
                    return (
                        <Button onClick={() => onEdit(senderId)} type="link">Edit</Button>
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
const SearchForm = ({onSearch})=>{
    const onFinish = (values) => {
        onSearch(values.loginId)
    };
    return(<>
        <Form
            labelCol={{span: 18}}
            wrapperCol={{ span: 23}}
            labelAlign="left"
            style={{marginLeft:5}}
            //layout={"horizontal"}
            onFinish={onFinish}
        >
            <Form.Item style={{display:"inline-block",marginBottom:'0px'}} name="loginId" label="Search" children={<Input placeholder="User id/Name/Number"/>} />
            <Form.Item name="senderId_op" initialValue={"contains"} hidden children={<Input />} />
            <Form.Item style={{display:'inline-block', marginBottom:0}} label=" " colon={false}>
                <Button
                    type="primary"
                    htmlType="submit"
                    children={"Search"}
                />
            </Form.Item>
        </Form>
    </>)
}

export const SenderIdManager = () => {
    const [parties, setParties] = useState([]);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(0);
    const [partyFetchResultCount, setPartyFetchResultCount] = useState(0);
    const [partyFetchError, setPartyFetchError] = useState(null);
    const [search,setSearch] = useState('');
    const [dataForSearch,setDataForSearch]=useState([])
    const {Title} = Typography;
    const [editForm] = Form.useForm();
    const [modalData, setModalData] = useState(null);
    const showModal = data => setModalData(data);
    const handleOk = () => setModalData(null);
    const handleCancel = () => setModalData(null);
    useEffect(() => {
        /*static initializer*/
        SenderIdManagerService.fetchRecords({})
            .then((data) => {
                setParties(data.parties);
                setDataForSearch(data.parties);
                setPartyFetchResultCount(data.count);
                setPage(data.page);
                setLimit(data.limit);
                setPartyFetchError(null);
                console.log(data)
            })
            .catch(error => {
                setParties([]);
                setPartyFetchResultCount(0);
                setPartyFetchError(error);
            });

        return () => { /*destructor*/ };
    }, []);

    useEffect(()=>{
        search?
            setParties(dataForSearch.filter((party) =>
                party.loginId.toLowerCase().includes(search.toLowerCase())||
                party.name.toLowerCase().includes(search.toLowerCase())||
                party.contactNumber.includes(search.toLowerCase())
            ))
          :setParties(dataForSearch);
    },[search])

    //const {Search} = Input;

    return (<>
        {/*<Space style={{marginLeft:5}} header={'he'}> Sene
            <Search onChange={(e)=>setSearch(e.target.value)} />
        </Space>*/}
        <Row style={{marginLeft: 5}}>
            <Col md={24}>
                <Card title={<Title level={5}>Sender ID</Title>}
                      headStyle={{backgroundColor: "#f0f2f5", border: 0, padding: '0px'}}
                      extra={
                          <Button type="primary" style={{background: "#1890ff", borderColor: "#1890ff"}}
                                  icon={<PlusCircleFilled/>} onClick={showModal}>
                              Create Sender
                          </Button>}
                      style={{height: 135}} size="small">
                    <SearchForm onSearch={setSearch}/>
                </Card>
            </Col>
            <Modal width={800} header="Create Sender" key="recordEditor" visible={modalData} onOk={handleOk}
                   onCancel={handleCancel}>
                <EditForm form={editForm} record={{}} />
            </Modal>
        </Row>
        <DataView parties={parties} viewLimit={limit} viewPage={page}/>
        <DataPager/>
    </>);
};
