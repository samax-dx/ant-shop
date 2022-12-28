import React, {useEffect, useRef, useState} from "react";
import { Button, Card, Col, Collapse, Divider, Image, List, Pagination, Row, Space, Statistic, Table, Tag, Typography, Progress, Badge  } from 'antd';
import Title from "antd/es/typography/Title";
import {Br} from "./Br";
import dayjs from "dayjs";
import {CampaignService} from "../services/CampaignService";
import {
    ArrowDownOutlined,
    ArrowRightOutlined, ArrowUpOutlined,
} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {ProfileService} from "../services/ProfileService";
import {CampaignReportService} from "../services/CampaignReportService";
import {AccountingService} from "../services/AccountingService";
import {InventoryService} from "../services/InventoryService";
import {SmsReportService} from "../services/SmsReportService";
import {RouteReportService} from "../services/DashBoardServices/RouteReportService";
import {CampaignCountService} from "../services/DashBoardServices/CampaignCountService";
import {CampaignSuccessCountService} from "../services/DashBoardServices/CampaignSuccessCountService";
import {CampaignTaskCountService} from "../services/DashBoardServices/CampaignTaskCountService";


const CompleteTaskView = ({ taskReports, viewPage, viewLimit, onView}) => {

    return (<>
        <Table
            size="small"
            dataSource={taskReports}
            rowKey={(taskReport) => taskReport.phoneNumber +'_'+ taskReport.campaignId}
            locale={{ emptyText: taskReports ===null? "E": "NO DATA" }}
            pagination={false}
        >
            <Table.Column
                dataIndex={undefined}
                title={"#"}
                render={(_, __, i) => (viewPage - 1) * viewLimit + (++i)}
            />

            <Table.Column title="PhoneNumber" dataIndex={"phoneNumber"} />
            <Table.Column title="Message" dataIndex={"message"} />
            <Table.Column title="Date" dataIndex={"updatedOn"} render={date => dayjs(date).format("MMM D, YYYY - hh:mm A")} />
            <Table.Column title="Campaign" dataIndex={"campaignName"} />
            <Table.Column title="Package" dataIndex={"packageId"} />
        </Table>
    </>);
};
const PackageView = ({ products, viewPage, viewLimit, onView}) => {
    const getBalanceColor = v => ["green", "yellow", "red", "inherit"][
        [1000, 500, 0, -1].findIndex(r => v > r)
        ];

    return (<>
        <Table
            size="small"
            dataSource={products}
            rowKey={"productId"}
            locale={{ emptyText: products ===null? "E": "NO DATA" }}
            pagination={false}
            style={{ minWidth: "24vw" }}
        >

            <Table.Column title="Party ID" dataIndex={"partyId"} />
            <Table.Column title="Product Name" dataIndex={"productName"} />
            <Table.Column title="Balance" dataIndex={"stock"} render={v => <Tag color={getBalanceColor(v)}>{v}</Tag>} />
        </Table>
    </>);
};

const PaymentView = ({ payments, viewPage, viewLimit, onView, onEdit, onDelete }) => {

    return (<>
        <Table
            size="large"
            dataSource={payments}
            rowKey={"paymentId"}
            locale={{ emptyText: payments ===null? "E": "NO DATA" }}
            pagination={false}
        >
            <Table.Column
                dataIndex={undefined}
                title={"#"}
                render={(_, __, i) => (viewPage - 1) * viewLimit + (++i)}
            />

            <Table.Column title="Payment ID" dataIndex={"paymentId"} />
            <Table.Column title="User ID" dataIndex={"partyLoginId"} />
            <Table.Column title="Party ID" dataIndex={"partyId"} />
            <Table.Column title="Party Name" dataIndex={"partyName"} />
            <Table.Column title="Billing Type" dataIndex={"billingType"}/>
            <Table.Column title="Date" dataIndex={"date"} render={date => dayjs(date).format("MMM D, YYYY - hh:mm A")}/>
            <Table.Column title="Amount" dataIndex={"amount"} render={v => v.toFixed(2)} />
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

export const HomeNew = () => {
    // Component States
    const [lastProfileQuery, setLastProfileQuery] = useState({});
    const [profile, setProfile] = useState({});
    const [accountBalance, setAccountBalance] = useState(0);
    const [profileFetchError, setProfileFetchError] = useState(null);

    const [lastProductQuery, setLastProductQuery] = useState({});
    const [partyProducts, setPartyProducts] = useState([]);
    const [partyProductsFetchCount, setPartyProductsFetchCount] = useState(0);
    const [partyProductsFetchError, setPartyProductsFetchError] = useState(null);

    const [lastTaskReportQuery, setLastTaskReportQuery] = useState({});
    const [taskReports, setTaskReports] = useState([]);
    const [taskReportsFetchCount, setTaskReportsFetchCount] = useState(0);
    const [taskReportsFetchError, setTaskReportsFetchError] = useState(null);

    const [lastPaymentQuery, setLastPaymentQuery] = useState({});
    const [payments, setPayments] = useState([]);
    const [paymentsFetchCount, setPaymentsFetchCount] = useState(0);
    const [paymentsFetchError, setPaymentsFetchError] = useState(null);

    const [todayCampaignCount, setTodayCampaignCount] = useState('');
    const [weekCampaignCount, setWeekCampaignCount] = useState('');
    const [rtCampaignCount, setRtCampaignCount] = useState('');
    const [todayCampaignSuccessCount, setTodayCampaignSuccessCount] = useState('');
    const [weekCampaignSuccessCount, setWeekCampaignSuccessCount] = useState('');
    const [rtCampaignSuccessCount, setRtCampaignSuccessCount] = useState('');
    const [todayCampaignTaskCount, setTodayCampaignTaskCount] = useState('');
    const [weekCampaignTaskCount, setWeekCampaignTaskCount] = useState('');
    const [rtCampaignTaskCount, setRtCampaignTaskCount] = useState('');
    const [smsStatistics, setSmsStatistics] = useState('');
    const [routeStatistics, setRouteStatistics] = useState([0]);


    useEffect(() => {
        AccountingService.fetchBalanceRequests(lastPaymentQuery)
            .then((data) => {
                console.log(data);
                setPayments(data.payments);
                setPaymentsFetchCount(data.count);
                setPaymentsFetchError(null);
            })
            .catch(error => {
                setPayments([]);
                setPaymentsFetchCount(0);
                setPaymentsFetchError(error);
            });
    }, [lastPaymentQuery]);

    useEffect(() => {
        InventoryService.fetchProducts(lastProductQuery)
            .then((data) => {
                console.log(data);
                setPartyProducts(data.products);
                setPartyProductsFetchCount(data.count);
                setPartyProductsFetchError(null);
            })
            .catch(error => {
                setPartyProducts([]);
                setPartyProductsFetchCount(0);
                setPartyProductsFetchError(error);
            });
    }, [lastProductQuery]);

    useEffect(() => {
        CampaignService.fetchCampaignTaskReports(lastTaskReportQuery)
            .then((data) => {
                console.log(data);
                setTaskReports(data.taskReports);
                setTaskReportsFetchCount(data.count);
                setTaskReportsFetchError(null);
            })
            .catch(error => {
                setTaskReports([]);
                setTaskReportsFetchCount(0);
                setTaskReportsFetchError(error);
            });
    }, [lastTaskReportQuery]);

    useEffect(()=>{
        CampaignCountService.getTodayCampaignCount()
            .then(data=>{
                console.log(data);
                setTodayCampaignCount(data);
            })
    },[])

    useEffect(()=>{
        CampaignCountService.getWeekCampaignCount()
            .then(data=>{
                console.log(data);
                setWeekCampaignCount(data);
            })
    },[])

    useEffect(()=>{
        CampaignCountService.getRtCampaignCount()
            .then(data=>{
                console.log(data);
                setRtCampaignCount(data);
            })
    },[])

    useEffect(()=>{
        CampaignSuccessCountService.getTodayCampaignSuccessCount()
            .then(data=>{
                console.log(data);
                setTodayCampaignSuccessCount(data);
            })
    },[])

    useEffect(()=>{
        CampaignSuccessCountService.getWeekCampaignSuccessCount()
            .then(data=>{
                console.log(data);
                setWeekCampaignSuccessCount(data);
            })
    },[])

    useEffect(()=>{
        CampaignSuccessCountService.getRtCampaignSuccessCount()
            .then(data=>{
                console.log(data);
                setRtCampaignSuccessCount(data);
            })
    },[])

    useEffect(()=>{
        CampaignTaskCountService.getWeekCampaignTaskCount()
            .then(data=>{
                console.log(data);
                setWeekCampaignTaskCount(data);
            })
            .catch(error=>{
                console.log(error);
            })
    },[])

    useEffect(()=>{
        CampaignTaskCountService.getTodayCampaignTaskCount()
            .then(data=>{
                console.log(data);
                setTodayCampaignTaskCount(data);
            })
    },[])

    useEffect(()=>{
        CampaignTaskCountService.getRtCampaignTaskCount()
            .then(data=>{
                console.log(data);
                setRtCampaignTaskCount(data);
            })
    },[])

    useEffect((()=>{
        SmsReportService.getSmsStatistics()
            .then(data=>{
                setSmsStatistics(data);
            })
    }),[])

    useEffect(()=>{
        RouteReportService.getRouteStatistics()
            .then(data=>{
                console.log(data);
                setRouteStatistics(data);
            })
    },[])

    useEffect(()=>{
        ProfileService.fetchProfile()
            .then(data=>{
                setProfile(data.profile);
                setAccountBalance(data.balance);
            })
    },[])

    useEffect(() => {
        setLastProfileQuery({ page: 1, limit: 10 })
    }, []);
    useEffect(() => {
        setLastProductQuery({ page: 1, limit: 10 })
    }, []);
    useEffect(() => {
        setLastTaskReportQuery({ page: 1, limit: 10 })
    }, []);
    useEffect(() => {
        setLastPaymentQuery({ page: 1, limit: 10 })
    }, []);


    return (<>
        <Card>
            <Row gutter={8}>
                <Col md={5}>
                    <Space direction="vertical" size={"small"}>
                        <Space direction="vertical" size={"small"}>
                            <Statistic title="Account Code No." value={profile.partyId} groupSeparator="" />
                            <Statistic title="Account Balance (BDT)" value={accountBalance} precision={2} />
                            {/*<Statistic title="Balance [Package]" value={partyProducts.map(data=>data.stock +'['+data.productId)+']'} precision={2} />*/}
                        </Space>
                    </Space>
                </Col>
                <Divider type="vertical" style={{ height: "inherit", marginRight: "24px" }} />
                <Col md={3}>
                    <Title level={3} style={{color: "#492D3A", marginLeft: 20}}>Today</Title>
                    <Space style={{marginTop: 5}}><ArrowRightOutlined style={{fontSize: 30, color: "#689dc4", marginLeft: 35}} /></Space>
                    <Title level={3} style={{color: "#492D3A", marginTop: 48}}>This Week</Title>
                    <Space style={{marginTop: 5}}><ArrowRightOutlined style={{fontSize: 30, color: "#4F995B", marginLeft: 35}} /></Space>
                </Col>

                <Col md={5}>
                    <Card style={{backgroundImage:'linear-gradient(to right, #2193b0 ,  #6dd5ed)'}}>
                        <Statistic
                            key={1}
                            title={'Campaigns Total'}
                            value={todayCampaignCount}
                            valueStyle={{ color: '#ffffff', fontWeight: 900 }}
                        />
                    </Card>
                    <Card style={{backgroundImage:'linear-gradient(to right, #2193b0, #6dd5ed)', marginTop: 10}}>
                        <Statistic
                            key={1}
                            title={'Campaigns Total'}
                            value={weekCampaignCount}
                            valueStyle={{ color: '#ffffff', fontWeight: 900 }}
                        />
                    </Card>
                </Col>
                <Col md={5}>
                    <Card style={{backgroundImage:'linear-gradient(to right, #de6262,  #ffb88c)'}}>
                        <Statistic
                            key={2}
                            title={"SMS Attempt"}
                            value={todayCampaignTaskCount}
                            valueStyle={{ color: '#ffffff', fontWeight: 900 }}
                        />
                    </Card>
                    <Card style={{backgroundImage:'linear-gradient(to right, #de6262,  #ffb88c)', marginTop: 10}}>
                        <Statistic
                            key={2}
                            title={"SMS Attempt"}
                            value={weekCampaignTaskCount}
                            valueStyle={{ color: '#ffffff', fontWeight: 900 }}
                        />
                    </Card>
                </Col>
                <Col md={5}>
                    <Card style={{backgroundImage:'linear-gradient(to right, #56ab2f, #a8e063)'}}>
                        <Statistic
                            key={3}
                            title={"Successful SMS"}
                            value={todayCampaignSuccessCount}
                            valueStyle={{ color: '#ffffff', fontWeight: 900 }}
                        />
                    </Card>
                    <Card style={{backgroundImage:'linear-gradient(to right, #56ab2f, #a8e063)', marginTop: 10}}>
                        <Statistic
                            key={3}
                            title={"Successful SMS"}
                            value={weekCampaignSuccessCount}
                            valueStyle={{ color: '#ffffff', fontWeight: 900 }}
                        />
                    </Card>
                </Col>
            </Row>
        </Card>
        {/*<Space children={<><p /><p /></>} />*/}
        <Card>
            <Row gutter={16}>
                <Col md={8}>
                    <Title level={5}> Real Time Performance (20 minutes) </Title>
                    <Space direction="vertical">
                        <Progress type="circle" width={100}  percent={rtCampaignCount} format={(percent) => `${percent}`} strokeColor={"#689dc4"}/>
                        <Badge color="#689dc4" status="processing" text="Total" style={{paddingLeft: 10}}/>
                    </Space>
                    <Space direction="vertical" style={{padding: 5}}>
                        <Progress type="circle" width={100}  percent={rtCampaignTaskCount} format={(percent) => `${percent}`} strokeColor={"Red"} />
                        <Badge color="Red" status="error" text="Attempt" style={{paddingLeft: 10}} />
                    </Space>
                    <Space direction="vertical">
                        <Progress type="circle" width={100}  percent={rtCampaignSuccessCount} format={(percent) => `${percent}`} strokeColor={"Green"}/>
                        <Badge color="Green" status="success" text="Success" style={{paddingLeft: 10}} />
                    </Space>

                </Col>
                <Col md={8}>
                    <Title level={5}> Route Uses </Title>
                    {/*<Progress size="medium" strokeColor={'#EE0000'} percent={routeStatistics.map(v=>v.robi?parseInt(v.robi):0)}/>*/}
                    <Progress size="medium" strokeColor={'#EE0000'} percent={parseInt(routeStatistics.find(v=>Object.keys(v)=="robi")?.robi)} format={(percent) => `${percent}`} />
                    <Progress size="medium" strokeColor={'#19AAF8'} percent={parseInt(routeStatistics.find(v=>Object.keys(v)=="grameenphone")?.grameenphone)} format={(percent) => `${percent}`} />
                    <Progress size="medium" strokeColor={'#F26522'} percent={parseInt(routeStatistics.find(v=>Object.keys(v)=="banglalink")?.banglalink)} format={(percent) => `${percent}`} />
                    <Progress size="medium" strokeColor={'#6AC537'} percent={parseInt(routeStatistics.find(v=>Object.keys(v)=="teletalk")?.teletalk)} format={(percent) => `${percent}`} />
                    <Progress size="medium" strokeColor={'#ED3D7F'} percent={parseInt(routeStatistics.find(v=>Object.keys(v)=="null")?.null)} format={(percent) => `${percent}`} />
                    <Space direction="vertical">
                        <Badge color="#EE0000" status="success" text="Robi" />
                        <Badge color="#19AAF8" status="success" text="Grameenphone" />
                    </Space>
                    <Space direction="vertical" style={{marginLeft: 15}}>
                        <Badge color="#F26522" status="success" text="Banglalink" />
                        <Badge color="#6AC537" status="success" text="Teletalk" />
                    </Space>
                    <Space direction="vertical" style={{marginLeft: 15}}>
                        <Badge color="#ED3D7F" status="success" text="Others" />
                    </Space>
                </Col>
                <Col md={8}>
                    <Card title={<><Typography.Text style={{fontWeight: "bold", fontSize: 16}}>Active Packages</Typography.Text>&nbsp;&nbsp;<Tag color={"blue"}>{partyProductsFetchCount}</Tag></>} size="small">
                        <PackageView products={partyProducts} viewPage={lastProductQuery.page} viewLimit={lastProductQuery.limit} />
                        <Space children={<><p /><p /></>} />
                        <DataPager totalPagingItems={partyProductsFetchCount} currentPage={lastProductQuery.page}
                                   onPagingChange={(page, limit) => setLastProfileQuery({ ...lastProductQuery, page, limit })} />
                    </Card>
                </Col>
            </Row>
        </Card>
        <Space children={<><p /><p /></>} />
        <Card title={<Typography.Text style={{fontWeight: "bold", fontSize: 16}}>Recent TopUp / Recharges</Typography.Text>} size="small">
            <PaymentView payments={payments} viewPage={lastPaymentQuery.page} viewLimit={lastPaymentQuery.limit} />
            <Space children={<><p /><p /></>} />
            <DataPager totalPagingItems={paymentsFetchCount} currentPage={lastPaymentQuery.page}
                       onPagingChange={(page, limit) => setLastProfileQuery({ ...lastPaymentQuery, page, limit })} />
        </Card>
        <Space children={<><p /><p /></>} />
        <Card title="Sent Messages" size="small">
            <CompleteTaskView taskReports={taskReports} viewPage={lastTaskReportQuery.page} viewLimit={lastTaskReportQuery.limit} />
            <Space children={<><p /><p /></>} />
            <DataPager totalPagingItems={taskReportsFetchCount} currentPage={lastTaskReportQuery.page}
                       onPagingChange={(page, limit) => setLastProfileQuery({ ...lastTaskReportQuery, page, limit })} />
        </Card>
    </>);
};