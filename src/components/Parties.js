import { useEffect, useState } from "react";
import { useActor } from "@xstate/react";
import { Br } from "./Br";
import { countries } from "countries-list";
import { Col, Row, Form, Input, Button, Table, Space, Pagination, Typography, Divider, Select, notification, Card, Collapse, Modal, Spin, Upload } from "antd";
import {FormOutlined, PlusCircleFilled, UploadOutlined,  PlusOutlined } from "@ant-design/icons";
import {PartySearchForm} from "./PartyWidgets";
import {UserManagement} from "./UserManagement";

// For upload Photo
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
  });

const EditForm = ({ form, record: party, onSave }) => {
    const [editForm] = Form.useForm(form);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://prod-media-eng.dhakatribune.com/uploads/2018/07/web-national-id-edited-26-11-2017-1532158137905.jpg',
    },
    {
      uid: '-2',
      name: 'image.png',
      status: 'done',
      url: 'https://prod-media-eng.dhakatribune.com/uploads/2018/07/web-national-id-edited-26-11-2017-1532158137905.jpg',
    }
  ]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
    

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
            {party.partyId && <Form.Item
                name="password_old"
                label="Current Password"
                rules={[{ required: true }]}
                hasFeedback
            >
                <Input.Password />
            </Form.Item>}

            <Form.Item
                name="password"
                label={party.partyId ? "New password" : "Password"}
                rules={[{ required: true }]}
                hasFeedback
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                name="passwordConfirm"
                label="Confirm Password"
                dependencies={party.partyId ? ['password_old', 'password'] : ["password"]}
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
            <Form.Item
                name="userNid"
                label="Upload Your National Identity Card"
                rules={[{ required: true }]}
            >
                <Upload
                action="http://localhost:3000/"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                >
                {fileList.length >= 2 ? null : uploadButton}
            </Upload>
                <Modal visible={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img
                    alt=""
                    style={{
                        width: '100%',
                    }}
                    src={previewImage}
                    />
                </Modal>
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

const ShowPartyForm = ({form,details,onSave}) => {
    const [ShowPartyForm] = Form.useForm(form);

    return (<>
        <Form
            key={details.partyId}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 20 }}
            labelAlign={"left"}
            style={{
                padding:'15px'
            }}
        >
            <Form.Item name="partyId" label="User ID" children={<Input defaultValue={details.loginId} preventDefault></Input>}></Form.Item>
            <Form.Item name="partyName" label="Name" children={<Input defaultValue={details.name}></Input>}></Form.Item>
            <Form.Item name="contactNumber" label="Contact Number" children={<Input defaultValue={details.contactNumber}></Input>}></Form.Item>
            <Form.Item wrapperCol={{ offset: 0}} style={{marginLeft: 333}} >
                <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => PartySearchForm
                        .validateFields()
                        .then(_ => onSave(PartySearchForm.getFieldsValue()))
                        .catch(_ => { })
                    }
                    children={"Submit"}
                />
            </Form.Item>
        </Form>
    </>);
};

const DataView = ({ context, viewPage, viewLimit, onView, onEdit, onDelete }) => {
    const viewResult = context.result;
    const viewError = context.error;

    return (<>
        <Table
            style={{marginLeft:6}}
            size="small"
            dataSource={viewResult.parties}
            rowKey={"partyId"}
            locale={{ emptyText: viewError && `[ ${viewError.message} ]` }}
            pagination={false}
        >
            <Table.Column
                dataIndex={undefined}
                title={"#"}
                render={(_, __, i) => (viewPage - 1) * viewLimit + (++i)}
            />

            <Table.Column
                title="User ID"
                dataIndex={undefined}
                render={(_, party, i) => {
                    return (
                        <Button onClick={() => onView(party)} type="link">{party.loginId}</Button>
                    );
                }}
            />

            <Table.Column title="Name" dataIndex={"name"} />

            <Table.Column
                title="Contact Number"
                dataIndex={undefined}
                render={(_, party, i) => (<span>
                    {["contactMech.countryCode", "contactMech.areaCode", "contactMech.contactNumber"].map(x => party[x] || "").join(" ")}
                </span>)}
            />

            <Table.Column
                dataIndex={undefined}
                title={"Actions"}
                render={(_, party, i) => (<>
                    <Button onClick={() => onEdit(party)} type="link" disabled>Edit</Button>
                    <Button onClick={_ => onDelete(party)} type="link" disabled>Delete</Button>
                </>)}
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

export const Parties = ({actor: [lookupActor, saveActor]}) => {
    const [lookupState, sendLookup] = useActor(lookupActor);
    const [saveState, sendSave] = useActor(saveActor);
    const [editForm] = Form.useForm();

    const [saving, setSaving] = useState(false);

    const sendPagedQuery = queryData => (page, limit) => {
        page === undefined && (page = queryData.page)
        limit === undefined && (limit = queryData.limit)
        console.log(queryData, page, limit);

        const query = {data: {...queryData, page, limit}, type: "LOAD"};
        return sendLookup(query);
    };

    const saveRecord = data => {
        console.log(data);
        return sendSave({data, type: "LOAD"});
    };

    useEffect(() => sendPagedQuery(lookupState.context.payload.data)(), []);

    useEffect(() => {
        saveActor.subscribe(state => {
            const lookupContext = lookupActor.getSnapshot().context;
            const saveContext = saveActor.getSnapshot().context;

            if (state.matches("hasResult")) {
                sendPagedQuery({...lookupContext.payload.data, orderBy: "partyId DESC"})();

                notification.success({
                    key: `cparty_${Date.now()}`,
                    message: "Task Complete",
                    description: <>Party created: {saveContext.payload.data.loginId}</>,
                    duration: 5
                });

                editForm.resetFields();
                setSaving(false);
            }

            if (state.matches("hasError")) {
                notification.error({
                    key: `cparty_${Date.now()}`,
                    message: "Task Failed",
                    description: <>Error creating party.<br/>{state.context.error.message}</>,
                    duration: 5
                });
                setSaving(false);
            }
        });
    }, [editForm]);

    useEffect(() => {
        if (lookupState.matches("idle")) {
            if (lookupState.context.result.count > 0 && lookupState.context.result.parties.length === 0) {
                lookupState.context.payload.data.page--;
                sendLookup({...lookupState.context.payload, type: "LOAD"});
            }
        }
    }, [lookupState]);
    const [modalDataOrder, setModalDataOrder] = useState(null);
    const showModalOrder = data => setModalDataOrder(data);
    const handleOkOrder = () => setModalDataOrder(null);
    const handleCancelOrder = () => setModalDataOrder(null);

    const onClickView = data => console.log("view", data) || showModalOrder(data);
    const onClickEdit = data => console.log("edit", data);
    const onClickDelete = data => console.log("delete", data);

    const viewContext = lookupState.context;

    const viewPage = viewContext.payload.data.page;
    const viewLimit = viewContext.payload.data.limit;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const {Title} = Typography;
    return (<>
        <Row style={{marginLeft: 5}}>
            <Col md={24}>
                <Card title={<Title level={5}>Parties</Title>}
                      headStyle={{backgroundColor: "#f0f2f5", border: 0, padding: '0px'}}
                      extra={
                          <Button type="primary" style={{background: "#1890ff", borderColor: "#1890ff"}}
                                  icon={<PlusCircleFilled/>} onClick={showModal}>
                              Create Party
                          </Button>}
                      style={{height: 135}} size="small">
                    <PartySearchForm onSearch={data => sendPagedQuery(data)(1, viewLimit)}/>
                </Card>
            </Col>
            <Modal width={800} header="Create Party" key="recordEditor" visible={isModalVisible} onOk={handleOk}
                   onCancel={handleCancel}>
                <EditForm form={editForm} record={{}} onSave={data => setSaving(true) || saveRecord(data)}/>
            </Modal>
        </Row>
        <DataView context={viewContext} onView={onClickView} onEdit={onClickEdit} onDelete={onClickDelete}
                  viewPage={viewPage} viewLimit={viewLimit}/>
        <Br/>
        <Modal width={800} title="Party Details" visible={!!modalDataOrder} onCancel={handleCancelOrder}
               footer={[<Button style={{backgroundColor: '#1DA57A'}} onClick={handleOkOrder}>Ok</Button>]}>
            {/*{JSON.stringify(modalDataOrder)}*/}
            <ShowPartyForm form={ShowPartyForm} record={{}} onSave={data => setSaving(true) || saveRecord(data)}
                           details={modalDataOrder}/>
        </Modal>
        <DataPager totalPagingItems={viewContext.result.count} currentPage={viewPage}
                   onPagingChange={sendPagedQuery(viewContext.payload.data)}/>
        <Modal visible={saving} footer={null} closable="false" maskClosable={false}>
            <Spin tip="Sending Request"/>
        </Modal>
        {/*<UserManagement/>*/}
    </>);
};

export const PartyPicker = ({ actor: lookupActor, onPicked }) => {
    const [lookupState, sendLookup] = useActor(lookupActor);

    const sendPagedQuery = queryData => (page, limit) => {
        page === undefined && (page = queryData.page)
        limit === undefined && (limit = queryData.limit)
        console.log(queryData, page, limit);

        const query = { data: { ...queryData, page, limit }, type: "LOAD" };
        return sendLookup(query);
    };

    useEffect(() => sendPagedQuery(lookupState.context.payload.data)(), []);

    const onClickView = data => console.log("view", data) || onPicked(data);
    const onClickEdit = data => console.log("edit", data);
    const onClickDelete = data => console.log("delete", data);

    const viewContext = lookupState.context;

    const viewPage = viewContext.payload.data.page;
    const viewLimit = viewContext.payload.data.limit;

    return (<>
        <Row>
            <Col md={10}>
                <Typography.Text strong>Find Parties</Typography.Text>
                <Br />
                <PartySearchForm onSearch={data => sendPagedQuery(data)(1, viewLimit)} />
            </Col>
        </Row>
        <DataView context={viewContext} onView={onClickView} onEdit={onClickEdit} onDelete={onClickDelete} viewPage={viewPage} viewLimit={viewLimit} />
        <Br />
        <DataPager totalPagingItems={viewContext.result.count} currentPage={viewPage} onPagingChange={sendPagedQuery(viewContext.payload.data)} />
    </>);
};

export const PartyPickerForSearchModal = ({ actor: lookupActor, onPicked}) =>{
    const [lookupState, sendLookup] = useActor(lookupActor);

    const sendPagedQuery = queryData => (page, limit) => {
        page === undefined && (page = queryData.page)
        limit === undefined && (limit = queryData.limit)
        console.log(queryData, page, limit);

        const query = { data: { ...queryData, page, limit }, type: "LOAD" };
        return sendLookup(query);
    };

    useEffect(() => sendPagedQuery(lookupState.context.payload.data)(), []);

    const onClickView = data => console.log("view", data) || onPicked(data);
    const onClickEdit = data => console.log("edit", data);
    const onClickDelete = data => console.log("delete", data);

    const viewContext = lookupState.context;

    const viewPage = viewContext.payload.data.page;
    const viewLimit = viewContext.payload.data.limit;

    return (<>
        <Row>
            <Col md={10}>
                <Typography.Text strong>Find Parties</Typography.Text>
                <Br />
                <PartySearchForm onSearch={data => sendPagedQuery(data)(1, viewLimit)} />
            </Col>
        </Row>
        <DataView context={viewContext} onView={onClickView} onEdit={onClickEdit} onDelete={onClickDelete} viewPage={viewPage} viewLimit={viewLimit} />
        <Br />
        <DataPager totalPagingItems={viewContext.result.count} currentPage={viewPage} onPagingChange={sendPagedQuery(viewContext.payload.data)} />
    </>);
};


