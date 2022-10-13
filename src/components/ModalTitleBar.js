import {Button, Card, Col, Divider, Row, Typography} from "antd";
import React from "react";

export const ModalTitleBar = ({onClose, children}) => {
    return (<>
        <Card bordered={false} bodyStyle={{paddingTop: 10, paddingBottom: 10}}>
            <Row justify="space-between">
                <Col style={{display: "flex", alignItems: "end"}}>
                    <Typography.Title level={5} style={{margin: 0, marginBottom: 0}} children={children}/>
                </Col>
                <Col>
                    <Button onClick={onClose} type={"link"} danger size={"small"}>X</Button>
                </Col>
            </Row>
        </Card>
        <Divider style={{margin: 0}}/>
    </>);
}