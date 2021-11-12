import { Button, Card, Form, Input, Space, Select, Tag, Tooltip, Checkbox } from "antd";
import { FileDoneOutlined, FileTextOutlined } from "@ant-design/icons";
import { countries } from "countries-list";
import { useEffect, useState } from "react";

import sms_api_cred from "../sms_api_cred.json";

export const ComposeSMS = props => {
    const [form] = Form.useForm();

    const toRequest = req => {
        req = Object.assign({
            senderId: null,
            isUnicode: true,
            isFlash: false,
            schedTime: null,
            groupId: null,
            message: null,
            contacts: null,
            serviceId: null,
            coRelator: null,
            linkId: null,
            principleEntityId: null,
            templateId: null,
            apiKey: sms_api_cred.apiKey,
            clientId: sms_api_cred.clientId,
        }, req);

        const defaultFilter = v => v;
        const contactsFilter = v => v && v.trim().replace(/[+\ \r]/gm, "");

        [
            ["isUnicode", "Is_Unicode"],
            ["isFlash", "Is_Flash"],
            ["contacts", "MobileNumbers", contactsFilter],
            ["senderId", "SenderId"],
            ["apiKey", "ApiKey"],
            ["clientId", "ClientId"]
        ].forEach(item => {
            const srcKey = item[0];
            const dstKey = item[1];
            const valueFilter = item[2] || defaultFilter;

            req[dstKey] = valueFilter(req[srcKey]);
            delete req[srcKey];
        });

        return req;
    };

    const toResponse = (res = {
        errorCode: 0,
        errorDescription: null,
        data: null
    }) => res;

    const sendSMS = async () => {
        const url = "http://sms.brilliant.com.bd:6005/api/v2/SendSMS";
        const payload = toRequest(form.getFieldsValue());
console.log(JSON.stringify(payload));
        const response = await fetch(url, {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json',
                "Accept": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
            },
            body: JSON.stringify(payload)
        });

        console.log(toResponse(response));
    };

    return (<>
        <Space><br /></Space>
        <Card style={{ maxWidth: "40vw" }}>
            <Form
                form={form}
                initialValues={{
                    campaingName: null,
                    senderId: "8809638010035",
                    contacts: "",
                    autoCountryCode: null,
                    message: "",
                    isUnicode: true,
                    isFlash: false,
                }}
                layout="vertical"
            >
                <Form.Item
                    label="Campaing Name"
                    name="campaingName"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Sender ID"
                    name="senderId"
                >
                    <Input />
                </Form.Item>
                <Form.Item label="Contacts">
                    <Space direction="vertical" style={{ width: "100%" }}>
                        <Form.Item name="contacts" style={{ margin: 0 }}>
                            <Input.TextArea />
                        </Form.Item>
                        <Space style={{ width: "100%", justifyContent: "space-between" }}>
                            <Form.Item name="autoCountryCode" style={{ margin: 0 }}>
                                <Select
                                    showSearch
                                    style={{ width: 200 }}
                                    placeholder="Auto Country Code"
                                    onChange={_ => console.log("changed")}
                                    optionFilterProp="children"
                                    filterOption={true}
                                    allowClear={true}
                                >
                                    {
                                        Object.values(countries).map(({ name, emoji, phone }) => {
                                            return (
                                                <Select.Option value={phone} key={emoji}>
                                                    <Button type="link">{emoji}</Button> {name}
                                                </Select.Option>
                                            );
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <div>
                                Import Contacts:
                                <Button size="small" type="link">Groups</Button> |
                                <Button size="small" type="link">File (Excel, CSV, Text)</Button>
                            </div>
                        </Space>
                    </Space>
                </Form.Item>
                <Form.Item label="Message">
                    <Space direction="vertical" style={{ width: "100%" }}>
                        <Space style={{ width: "100%", justifyContent: "space-between" }}>
                            <Space>
                                <Tooltip title="Import Draft"><Button shape="circle" icon={<FileTextOutlined />} /></Tooltip>
                                <Tooltip title="Import Template"><Button shape="circle" icon={<FileDoneOutlined />} /></Tooltip>
                            </Space>
                            <Space>
                                <Form.Item name="isUnicode" valuePropName="checked" style={{ margin: 0 }}>
                                    <Checkbox><Tooltip title="using unicode charecters">Unicode</Tooltip></Checkbox>
                                </Form.Item>
                                <Form.Item name="isFlash" valuePropName="checked" style={{ margin: 0 }}>
                                    <Checkbox><Tooltip title="is a flash sms">Flash</Tooltip></Checkbox>
                                </Form.Item>
                            </Space>
                        </Space>
                        <Form.Item name="message" style={{ margin: 0 }}>
                            <Input.TextArea />
                        </Form.Item>
                        <span>Used: 0 | Left: 1224 | SMS Count: 0</span>
                    </Space>
                </Form.Item>
                <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                    <Button type="default">Draft</Button>
                    <Button type="default">Schedule</Button>
                    <Button type="primary" onClick={sendSMS}>Send</Button>
                </Space>
            </Form>
        </Card>
    </>)
};