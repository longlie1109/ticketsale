import { SearchOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, DatePickerProps, Input, Layout, Radio, RadioChangeEvent, Row, Space, Table, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import { collection, DocumentData, getDocs, QueryDocumentSnapshot } from "firebase/firestore";
import moment, { now } from "moment";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { db } from "../firebase.config";
import '../styles/header.css'

interface tickets {
    Id: string;
    Code: string;
    Date: string;
    Gate: string;
    Status: string;
    Type: string;
}
const tagColor = (record: tickets) => {
    switch (record.Status) {
        case 'Chưa đối soát':
            return (<p>{record.Gate}        <p style={{ color: "red" }}>{record.Status}</p></p>)

            break;
        case 'Đã đối soát':
            return (<p>{record.Gate}        <p style={{ color: "gray" }}>{record.Status}</p></p>)

            break;
        default:
            return (<p>{record.Gate}        <p style={{ color: "green" }}>{record.Status}</p></p>)

            break;
    }
}
const { Search } = Input;
const Doisoatve = () => {
    const [tickets, setTickets] = useState<tickets[]>([])
    const ticketRef = collection(db, "doisoat");
    const { Header, Content, Footer, Sider } = Layout;
    const { Title } = Typography;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [FilterModalStatus, setFilterModalStatus] = useState();
    const [dateFrom, setDateFrom] = useState(new Date());
    const [dateTo, setDateTo] = useState(new Date());
    const dateFormat = "DD/MM/YYYY"
    const showModal = () => {
        setIsModalVisible(true);
    };
    const radioButton = (e: RadioChangeEvent) => {
        console.log('radio checked', e.target.value);
        setFilterModalStatus(e.target.value);
    };
    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
        setDateFrom(moment(date).toDate())
    };
    const onChange1: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
        setDateTo(moment(date).toDate())
    };
    const filter = () => {
        const filteredData = dataSource.filter(entry => {
            if (FilterModalStatus == "all") {
                return ((
                    moment(entry.Date, dateFormat).toDate() > dateFrom
                    && moment(entry.Date, dateFormat).toDate() < dateTo))
            }
            else {
                return ((
                    entry.Status == FilterModalStatus
                    && moment(entry.Date, dateFormat).toDate() > dateFrom
                    && moment(entry.Date, dateFormat).toDate() < dateTo))

            }
        })

        setDataSources(filteredData);
    }
    const getTickets = async () => {
        const data = await getDocs(ticketRef);
        const ticketResult: tickets[] = [];
        const result: QueryDocumentSnapshot<DocumentData>[] = [];
        data.docs.map((doc) => {
            result.push(doc);
            //console.log(doc)
            ticketResult.push({ Id: doc.id, Code: doc.get("Code"), Date: doc.get("Date"), Gate: doc.get("Gate"), Status: doc.get("Status"), Type: doc.get("Type") });

        });
        //ticketResult.map ((tick) =>{console.log(tick)})

        // set it to state
        //setTickets(result);
        setTickets(ticketResult);
        setDataSources(ticketResult);
    };
    useEffect(() => {

        getTickets();

    }, [])
    const columns: ColumnsType<tickets> = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (text: string, tickets: tickets) => (dataSource.indexOf(tickets) + 1)

        },
        {
            title: 'Mã vé',
            dataIndex: 'Code',
            key: 'Code',
            //  render:(_, record) => (
            //      <text>{record.get("BlockingCode")}</text>
            //  ),
        },
        {
            title: 'Loại vé',
            dataIndex: 'Type',
            key: 'Loại Vé',
            // render:(_, record) => (
            //      <text>{record.get("TicketNumber")}</text>
            //   ),
        },
        {
            title: 'Ngày sử dụng',
            dataIndex: 'Date',
            key: 'Date',
            // render:(_, record) => (
            //       <text>{record.get("Date")}</text>
            //  ),
        },
        {
            title: 'Gate',
            dataIndex: 'Gate',
            key: 'Cổng',
            render: (_, record, index) => (tagColor(record))

        },
    ];

    const dataSource: tickets[] = tickets;
    const [dataSources, setDataSources] = useState(dataSource);
    const [SearchValue, setSearchValue] = useState('');
    const [FilteredData, SetFilteredData] = useState(dataSource);

    return (
        <>
            <Content className="site-layout-background">

                <Content><div>
                    <Title>Danh Sách sự kiện</Title>
                    <div className="search-inner">
                        <Input
                            placeholder="tìm theo số vé"
                            className="search"
                            suffix={<SearchOutlined />}
                            onChange={e => {
                                const currValue = e.target.value;
                                setSearchValue(currValue);
                                const filteredData = dataSource.filter(entry =>
                                    entry.Code.includes(currValue)
                                );
                                setDataSources(filteredData)
                            }}
                            style={{ float: "left", width: "280px", backgroundColor: '#EDEDED', borderRadius: '15px' }} />
                        <Space size={"small"} style={{ float: "right" }}>
                            <Button type="primary" shape="round" size="large" style={{ float: "right", backgroundColor: '#FFFFFF', borderRadius: "15px", borderColor: '#ff6600' }}>
                                <CSVLink
                                    filename={"Expense_Table.csv"}
                                    data={dataSources}
                                    className="btn btn-primary">
                                   <p style={{color:"#FF993C",fontWeight:"bolder"}}>Export to CSV</p>
                                </CSVLink></Button>
                        </Space>
                    </div>
                </div>
                    <Table key="quanlyve" dataSource={dataSources} columns={columns}></Table>
                </Content>

            </Content>
            <Content className="filter-background" style={{width:"100px"}}>
                <Sider className="side">
               
                <Title>Lọc vé</Title>
                    {/* <Row gutter={[16, 26]}> */}
                        
                        <Row  gutter={[16, 26]}>
                        
                            <Col span={12}><Title level={5}>Tình trạng đối soát Vé</Title></Col>
                            <Col span={12}>
                                <Radio.Group value={FilterModalStatus} onChange={radioButton} defaultValue={"all"} >
                                <Space direction="vertical">
                                <Radio value={"all"}>Tất cả</Radio>
                                <Radio value={"Đã đối soát"}>Đã đối soát</Radio>
                                <Radio value={"Chưa đối soát"}>Chưa đối soát</Radio>
                                </Space>
                            </Radio.Group>
                            </Col>
                        </Row>
                       
                        <Row gutter={[16, 16]}>
                        <Col span={12}><Title level={5}>Loại vé : vé cổng</Title></Col>
                            <Col span={24}  className={"wrap-center"}>
                                <Col span={12} style={{padding: "0"}}>
                                    <span style={{fontWeight:"bolder"}}>Từ ngày</span>
                                </Col>
                                <DatePicker onChange={onChange} format={dateFormat} />
                            </Col>
                        </Row>
                        <Row gutter={[16, 26]}>
                            <Col span={24} className={"wrap-center"}>
                                <Col span={12} style={{padding: "0"}}>
                                <span style={{fontWeight:"bolder"}}>Đến ngày</span>
                                </Col>
                                <DatePicker onChange={onChange1} format={dateFormat} />
                            </Col>
                        </Row>
                    {/* </Row> */}
                    <Row gutter={[16, 26]} className={"wrap-center-button"}>
                        <Button shape="round" size="large" style={{ float: "right",fontWeight:"bolder", backgroundColor: '#FFFFFF', borderRadius: "15px", borderColor: '#ff6600' }} onClick={filter}><span style={{ color: "#FF993C" }}>Lọc Vé</span></Button>
                    </Row>
                    
                            
                    </Sider>
                
            </Content>
        </>
    );


};
export default Doisoatve;