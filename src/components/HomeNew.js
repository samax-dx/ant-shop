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
import {PartyCountDashService} from "../services/DashBoardServices/PartyCountDashService";
import {SigtranStatusService} from "../services/DashBoardServices/SigtranStatusService";


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

            <Table.Column title="Party Name" dataIndex={"partyName"} />
            <Table.Column title="Product Name" dataIndex={"productName"} />
            <Table.Column title="Balance" dataIndex={"stock"} render={v => <Tag color={getBalanceColor(v)}>{v}</Tag>} />
        </Table>
    </>);
};

const PaymentView = ({ payments, viewPage, viewLimit, onView, onEdit, onDelete }) => {

    return (<>
        <Table
            size="small"
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
    const [partyTotalCount, setPartyTotalCount] = useState('');
    const [partyActiveCount, setPartyActiveCount] = useState('');
    const [todayPartyActiveCount, setTodayPartyActiveCount] = useState(0);
    const [routeStatistics, setRouteStatistics] = useState([0]);
    const [gp1Status, setGp1Status] = useState({});


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
        repetitiveApiCaller();
        setInterval(()=>{
            repetitiveApiCaller();
        },30000)
    },[])

    // useEffect(()=>{
    //     CampaignCountService.getTodayCampaignCount()
    //         .then(data=>{
    //             console.log(data);
    //             setTodayCampaignCount(data);
    //         })
    //         .catch(error=>{
    //             console.log(error);
    //         })
    // },[])

    // useEffect(()=>{
    //     CampaignCountService.getWeekCampaignCount()
    //         .then(data=>{
    //             console.log(data);
    //             setWeekCampaignCount(data);
    //         })
    //         .catch(error=>{
    //             console.log(error);
    //         })
    // },[])

    // useEffect(()=>{
    //     CampaignCountService.getRtCampaignCount()
    //         .then(data=>{
    //             console.log(data);
    //             setRtCampaignCount(data);
    //         })
    //         .catch(error=>{
    //             console.log(error);
    //         })
    // },[])

    // useEffect(()=>{
    //     CampaignSuccessCountService.getTodayCampaignSuccessCount()
    //         .then(data=>{
    //             console.log(data);
    //             setTodayCampaignSuccessCount(data);
    //         })
    //         .catch(error=>{
    //             console.log(error);
    //         })
    // },[])

    // useEffect(()=>{
    //     CampaignSuccessCountService.getWeekCampaignSuccessCount()
    //         .then(data=>{
    //             console.log(data);
    //             setWeekCampaignSuccessCount(data);
    //         })
    //         .catch(error=>{
    //             console.log(error);
    //         })
    // },[])

    // useEffect(()=>{
    //     CampaignSuccessCountService.getRtCampaignSuccessCount()
    //         .then(data=>{
    //             console.log(data);
    //             setRtCampaignSuccessCount(data);
    //         })
    //         .catch(error=>{
    //             console.log(error);
    //         })
    // },[])

    // useEffect(()=>{
    //     CampaignTaskCountService.getWeekCampaignTaskCount()
    //         .then(data=>{
    //             console.log(data);
    //             setWeekCampaignTaskCount(data);
    //         })
    //         .catch(error=>{
    //             console.log(error);
    //         })
    // },[])

    // useEffect(()=>{
    //     CampaignTaskCountService.getTodayCampaignTaskCount()
    //         .then(data=>{
    //             console.log(data);
    //             setTodayCampaignTaskCount(data);
    //         })
    //         .catch(error=>{
    //             console.log(error);
    //         })
    // },[])

    // useEffect(()=>{
    //     CampaignTaskCountService.getRtCampaignTaskCount()
    //         .then(data=>{
    //             console.log(data);
    //             setRtCampaignTaskCount(data);
    //         })
    //         .catch(error=>{
    //             console.log(error);
    //         })
    // },[])

    // useEffect(()=>{
    //     PartyCountDashService.getTotalPartyCount()
    //         .then(data=>{
    //             console.log(data);
    //             setPartyTotalCount(data);
    //         })
    //         .catch(error=>{
    //             console.log(error);
    //         })
    // },[])

    // useEffect(()=>{
    //     PartyCountDashService.getActivePartyCount()
    //         .then(data=>{
    //             console.log(data);
    //             setPartyActiveCount(data);
    //         })
    //         .catch(error=>{
    //             console.log(error);
    //         })
    // },[])

    // useEffect(()=>{
    //     PartyCountDashService.getTodayActivePartyCount()
    //         .then(data=>{
    //             console.log(data);
    //             setTodayPartyActiveCount(data);
    //         })
    //         .catch(error=>{
    //             console.log(error);
    //         })
    // },[])

    // useEffect((()=>{
    //     SmsReportService.getSmsStatistics()
    //         .then(data=>{
    //             setSmsStatistics(data);
    //         })
    //         .catch(error=>{
    //             console.log(error);
    //         })
    // }),[])

    // useEffect(()=>{
    //     RouteReportService.getRouteStatistics()
    //         .then(data=>{
    //             console.log(data);
    //             setRouteStatistics(data);
    //         })
    //         .catch(error=>{
    //             console.log(error);
    //         })
    // },[])

    useEffect(()=>{
        ProfileService.fetchProfile()
            .then(data=>{
                setProfile(data.profile);
                setAccountBalance(data.balance);
            })
            .catch(error=>{
                console.log(error);
            })
    },[])

    const repetitiveApiCaller = () => {
        SigtranStatusService.getGp1Status()
            .then(data=>{
                console.log(data);
                setGp1Status(data.status);
            })
            .catch(error=>{
                console.log(error);
            })
        CampaignCountService.getTodayCampaignCount()
            .then(data=>{
                console.log(data);
                setTodayCampaignCount(data);
            })
            .catch(error=>{
                console.log(error);
            })
        CampaignCountService.getWeekCampaignCount()
            .then(data=>{
                console.log(data);
                setWeekCampaignCount(data);
            })
            .catch(error=>{
                console.log(error);
            })
        CampaignCountService.getRtCampaignCount()
            .then(data=>{
                console.log(data);
                setRtCampaignCount(data);
            })
            .catch(error=>{
                console.log(error);
            })
        CampaignSuccessCountService.getTodayCampaignSuccessCount()
            .then(data=>{
                console.log(data);
                setTodayCampaignSuccessCount(data);
            })
            .catch(error=>{
                console.log(error);
            })
        CampaignSuccessCountService.getWeekCampaignSuccessCount()
            .then(data=>{
                console.log(data);
                setWeekCampaignSuccessCount(data);
            })
            .catch(error=>{
                console.log(error);
            })
        CampaignSuccessCountService.getWeekCampaignSuccessCount()
            .then(data=>{
                console.log(data);
                setWeekCampaignSuccessCount(data);
            })
            .catch(error=>{
                console.log(error);
            })
        CampaignSuccessCountService.getRtCampaignSuccessCount()
            .then(data=>{
                console.log(data);
                setRtCampaignSuccessCount(data);
            })
            .catch(error=>{
                console.log(error);
            })
        CampaignTaskCountService.getWeekCampaignTaskCount()
            .then(data=>{
                console.log(data);
                setWeekCampaignTaskCount(data);
            })
            .catch(error=>{
                console.log(error);
            })
        CampaignTaskCountService.getTodayCampaignTaskCount()
            .then(data=>{
                console.log(data);
                setTodayCampaignTaskCount(data);
            })
            .catch(error=>{
                console.log(error);
            })
        CampaignTaskCountService.getRtCampaignTaskCount()
            .then(data=>{
                console.log(data);
                setRtCampaignTaskCount(data);
            })
            .catch(error=>{
                console.log(error);
            })
        PartyCountDashService.getTotalPartyCount()
            .then(data=>{
                console.log(data);
                setPartyTotalCount(data);
            })
            .catch(error=>{
                console.log(error);
            })
        PartyCountDashService.getActivePartyCount()
            .then(data=>{
                console.log(data);
                setPartyActiveCount(data);
            })
            .catch(error=>{
                console.log(error);
            })
        PartyCountDashService.getTodayActivePartyCount()
            .then(data=>{
                console.log(data);
                setTodayPartyActiveCount(data);
            })
            .catch(error=>{
                console.log(error);
            })
        SmsReportService.getSmsStatistics()
            .then(data=>{
                setSmsStatistics(data);
            })
            .catch(error=>{
                console.log(error);
            })
        RouteReportService.getRouteStatistics()
            .then(data=>{
                console.log(data);
                setRouteStatistics(data);
            })
            .catch(error=>{
                console.log(error);
            })
    }

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
                    <Card
                        title={<Title level={4} style={{color:'white'}}>Parties</Title>}
                        bordered={true}
                        headStyle={{background: '#2193b0' , padding: '0 8px 0 10px'}}
                        style={{ boxShadow: 'rgba(0, 0, 0, 0.1) 4px 4px 5px',background:'#F2F1F0'}}
                    >
                        <Title level={4} style={{color: "#492D3A", lineHeight: '0.95'}}>Total : {partyTotalCount}</Title>
                        <Title level={4} style={{color: "#492D3A", lineHeight: '0.95'}}>Active : {partyActiveCount}</Title>
                        <Title level={4} style={{color: "#492D3A", lineHeight: '0.95'}}>Active Today : {todayPartyActiveCount}</Title>
                    </Card>
                </Col>
                {/*<Divider type="vertical" style={{ height: "inherit", marginRight: "24px" }} />*/}
                <Col md={2}>
                    <Title level={5} style={{color: "#492D3A", marginLeft: 20}}>Today</Title>
                    <Space style={{marginTop: 5}}><ArrowRightOutlined style={{fontSize: 25, color: "#689dc4", marginLeft: 35}} /></Space>
                    <Title level={5} style={{color: "#492D3A", marginTop: 40}}>This Week</Title>
                    <Space style={{marginTop: 5}}><ArrowRightOutlined style={{fontSize: 25, color: "#4F995B", marginLeft: 35}} /></Space>
                </Col>

                <Col md={4}>
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
                <Col md={4}>
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
                <Col md={4}>
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

                <Col md={5}>
                    <Card
                        title={<Title level={4} style={{color:'white'}}>Sigtran Status</Title>}
                        bordered={true}
                        headStyle={{background: '#2193b0' , padding: '0 8px 0 10px'}}
                        style={{ boxShadow: 'rgba(0, 0, 0, 0.1) 4px 4px 5px',background:'#F2F1F0'}}
                    >
                        <Title level={4} style={{color: "#492D3A", lineHeight: '0.95'}}>GP-1 : {gp1Status}</Title>
                        <Title level={4} style={{color: "#492D3A", lineHeight: '0.95'}}>Active : {partyActiveCount}</Title>
                        <Title level={4} style={{color: "#492D3A", lineHeight: '0.95'}}>Active Today : {todayPartyActiveCount}</Title>
                    </Card>
                </Col>
            </Row>
        </Card>
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
                <Col md={7}>
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
                <Col md={9}>
                    <Card title={<><Typography.Text style={{fontWeight: "bold", fontSize: 16}}>Active Packages</Typography.Text>&nbsp;&nbsp;<Tag color={"blue"}>{partyProductsFetchCount}</Tag></>} size="small">
                        <PackageView products={partyProducts} viewPage={lastProductQuery.page} viewLimit={lastProductQuery.limit} />
                        <Space children={<><p /><p /></>} />
                        <DataPager totalPagingItems={partyProductsFetchCount} currentPage={lastProductQuery.page}
                                   onPagingChange={(page, limit) => setLastProductQuery({ ...lastProductQuery, page, limit })} />
                    </Card>
                </Col>
            </Row>
        </Card>
        <Space children={<><p /><p /></>} />
        <Card title={<Typography.Text style={{fontWeight: "bold", fontSize: 16}}>Recent TopUp / Recharges</Typography.Text>} size="small">
            <PaymentView payments={payments} viewPage={lastPaymentQuery.page} viewLimit={lastPaymentQuery.limit} />
            <Space children={<><p /><p /></>} />
            <DataPager totalPagingItems={paymentsFetchCount} currentPage={lastPaymentQuery.page}
                       onPagingChange={(page, limit) => setLastPaymentQuery({ ...lastPaymentQuery, page, limit })} />
        </Card>
        <Space children={<><p /><p /></>} />
        <Card title={<Typography.Text style={{fontWeight: "bold", fontSize: 16}}>Sent Messages</Typography.Text>} size="small">
            <CompleteTaskView taskReports={taskReports} viewPage={lastTaskReportQuery.page} viewLimit={lastTaskReportQuery.limit} />
            <Space children={<><p /><p /></>} />
            <DataPager totalPagingItems={taskReportsFetchCount} currentPage={lastTaskReportQuery.page}
                       onPagingChange={(page, limit) => setLastTaskReportQuery({ ...lastTaskReportQuery, page, limit })} />
        </Card>
    </>);
};
