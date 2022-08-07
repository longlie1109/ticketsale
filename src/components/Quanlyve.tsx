import { Button, Dropdown, Space, Table, Tag, Modal, Layout, DatePicker, DatePickerProps, Input, Checkbox, Col, Row, Radio, RadioChangeEvent, Divider } from "antd";
import { collection, doc, DocumentData, getDoc, getDocs, onSnapshot, query, QueryDocumentSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect, useState, Fragment } from "react";
import { db } from "../firebase.config";
import type { ColumnsType } from 'antd/lib/table';
import { CSVLink } from "react-csv"
import moment, { Moment } from "moment";
import { MoreOutlined, SearchOutlined } from "@ant-design/icons";
import { RangePickerProps } from "antd/lib/date-picker";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import '../styles/header.css'
import { Typography } from 'antd';
const { Title } = Typography;
const { Footer, Sider, Content } = Layout;
const style: React.CSSProperties = { padding: '8px 0' };
interface tickets {
    Id: string;
    BlockingCode: string;
    Date: string;
    ExpireDate: string;
    Gate: string;
    Status: string;
    TicketNumber: string;
    Event: string;
}
interface filterValue {
    Date: string,
    Status: string,
    Gate: string,
}
const tagColor = (param: string) => {
    switch (param) {
        case 'used':
            return (<><Tag color='green' icon={"•"}>Đã sử dụng</Tag></>)

            break;
        case 'expire':
            return (<><Tag color='red' icon={"•"}>Hết hạn</Tag></>)

            break;
        default:
            return (<><Tag color='geekblue' icon={"•"} >Chưa sử dụng</Tag></>)

            break;
    }
}

const { Search } = Input;
const Quanlyve = () => {
    //const [tickets, setTickets] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
    const [tickets, setTickets] = useState<tickets[]>([])
    const ticketRef = collection(db, "quanlyve");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const dateFormat = 'DD/MM/YYYY';
    const [DateData, setDateData] = useState('');
    const [modalTaskId, setModalTaskId] = useState<tickets>({ Id: '', BlockingCode: '', Date: '', ExpireDate: '', Gate: '', Status: '', TicketNumber: '', Event: '' });

    // state lien quan den checkbox
    const plainOptions = ['Cổng 1', 'Cổng 2', 'Cổng 3', 'Cổng 4', 'Cổng 5'];
    const [indeterminate, setIndeterminate] = useState(true);
    const [isCheckAll, setIsCheckAll] = useState(false);
    //useState lien quan den button loc ve.
    const [filterModal, setFilterModal] = useState(false);
    const [DateFrom, setDateFrom] = useState(new Date());
    const [DateTo, setDateTo] = useState(new Date());
    const [FilterModalGate, setFilterModalGate] = useState<CheckboxValueType[]>();
    const [FilterModalStatus, setFilterModalStatus] = useState('all');

    const radioButton = (e: RadioChangeEvent) => {
        console.log('radio checked', e.target.value);
        setFilterModalStatus(e.target.value);
    }
    const checkBox = (checkedValues: CheckboxValueType[]) => {
        // console.log('checked = ', checkedValues);
        setFilterModalGate(checkedValues);
        setIndeterminate(!!checkedValues.length && checkedValues.length < plainOptions.length);
        setIsCheckAll(checkedValues.length === plainOptions.length);
        // console.log('array checked : ' , FilterModalGate);     
    }

    // useEffect(() =>{
    //    console.log (FilterModalGate);
    // },[FilterModalGate])
    const onCheckAllChange = (e: CheckboxChangeEvent) => {
        setIsCheckAll(!isCheckAll);
        setFilterModalGate(e.target.checked ? plainOptions : []);
        setIndeterminate(false);

    };
    ///
    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        // console.log(dateString);
        setDateData(dateString);
    };
    //modal filter vé
    const handleOpenModal = () => {
        setFilterModal(true);
    }
    const handleCancelModal = () => {
        setFilterModal(false);
    }
    const handleModal = () => {

        const filteredData = dataSource.filter(entry => {
            if (FilterModalStatus == "all") {
                //console.log("all")
                return ((
                    FilterModalGate?.includes(entry.Gate)
                    && moment(entry.Date, dateFormat).toDate() > DateFrom
                    && moment(entry.Date, dateFormat).toDate() < DateTo))
            }
            else {
                return ((
                    entry.Status == FilterModalStatus
                    && FilterModalGate?.includes(entry.Gate)
                    && moment(entry.Date, dateFormat).toDate() > DateFrom
                    && moment(entry.Date, dateFormat).toDate() < DateTo))

            }
        }
        );
        setDataSources(filteredData);
        setFilterModal(false);
    }
    const onChange1: DatePickerProps['onChange'] = (date, dateString) => {
        //console.log(moment(date).toDate());
        setDateFrom(moment(date).toDate());
    };
    const onChange2: DatePickerProps['onChange'] = (date, dateString) => {
        // console.log(date, dateString);
        setDateTo(moment(date).toDate());
    };

    const onOk = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
        console.log('onOk: ', value);
    };


    //modal update ngày vé
    const showModal = (data: tickets) => {
        setModalTaskId(data)
        setDateData(data.Date);
        setIsModalVisible(true);
    };
    const handleOk = (id: string, newDate: string) => {
        updateTicket(id, newDate);
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const updateTicket = async (id: string, date: string) => {
        const data = doc(db, "quanlyve", id);
        const newFields = { Date: date };
        await updateDoc(data, newFields);
    }
    const getTickets = async () => {
        const data = await getDocs(ticketRef);
        const ticketResult: tickets[] = [];
        const result: QueryDocumentSnapshot<DocumentData>[] = [];
        data.docs.map((doc) => {
            result.push(doc);
            console.log(doc)
            ticketResult.push({ Id: doc.id, BlockingCode: doc.get("BlockingCode"), Date: doc.get("Date"), ExpireDate: doc.get("ExpireDate"), Gate: doc.get("Gate"), Status: doc.get("Status"), TicketNumber: doc.get("TicketNumber"), Event: doc.get("Event") });

        });
        //ticketResult.map ((tick) =>{console.log(tick)})

        // set it to state
        //setTickets(result);
        setTickets(ticketResult);
        setDataSources(ticketResult);
    };
    useEffect(() => {

        getTickets();

    },[isModalVisible])

    const columns: ColumnsType<tickets> = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (text: string, tickets: tickets) => (dataSource.indexOf(tickets) + 1)

        },
        {
            title: 'BlockingCode',
            dataIndex: 'BlockingCode',
            key: 'BlockingCode',
            //  render:(_, record) => (
            //      <text>{record.get("BlockingCode")}</text>
            //  ),
        },
        {
            title: 'Số Vé',
            dataIndex: 'TicketNumber',
            key: 'Số Vé',
            // render:(_, record) => (
            //      <text>{record.get("TicketNumber")}</text>
            //   ),
        },
        {
            title: 'Sự kiện',
            dataIndex: 'Event',
            key: 'Sự kiện',
        },
        {
            title: 'Status',
            dataIndex: 'Status',
            key: 'Status',
            render: (_, record) => (
                tagColor(record.Status)
            ),
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
            title: 'Ngày xuất vé',
            dataIndex: 'ExpireDate',
            key: 'Ngày xuất vé',
            //   render:(_, record) => (
            //      <text>{record.get("ExpireDate")}</text>
            //  ),
        },
        {
            title: 'Gate',
            dataIndex: 'Gate',
            key: 'Cổng',
            render: (_, record, index) => (
                <>
                    <Space size={"middle"}>
                        <text>{record.Gate}</text>
                        <Button icon={<MoreOutlined />} onClick={() => showModal(record)} ></Button>
                    </Space>
                </>

            ),
        },
    ];

    //const dataSource:QueryDocumentSnapshot<DocumentData>[] = tickets;
    //<Table key="quanlyve" dataSource={dataSource} columns={columns} />
    const dataSource: tickets[] = tickets;
    const [dataSources, setDataSources] = useState(dataSource);
    const [SearchValue, setSearchValue] = useState('');
    const [FilteredData, SetFilteredData] = useState(dataSource);

    return (
        <>
            <Content className="site-layout-background">
                <div>
                    <Title>Danh Sách Vé</Title>
                    <div className="search-inner">

                        <Input
                            placeholder="tìm theo số vé"
                            className="search"
                            value={SearchValue}
                            suffix={<SearchOutlined />}
                            onChange={e => {
                                const currValue = e.target.value;
                                setSearchValue(currValue);
                                const filteredData = dataSource.filter(entry =>
                                    entry.TicketNumber.includes(currValue)
                                );
                                setDataSources(filteredData);
                            }}
                            style={{ float: "left", width: "280px", backgroundColor: '#EDEDED', borderRadius: '15px' }}

                        />
                        <Space size={"small"} style={{ float: "right" }}>
                            <Button type="primary" shape="round" size="large" style={{ float: "right", fontWeight:"bolder",backgroundColor: '#FFFFFF', borderRadius: "15px", borderColor: '#ff6600' }}><CSVLink
                                filename={"Expense_Table.csv"}
                                data={dataSource}
                                className="btn btn-primary">
                                <p style={{color:"#FF993C"}}>Export to CSV</p>
                            </CSVLink></Button>
                            <Button
                                
                                shape="round"
                                size="large"
                                style={{ float: "right", backgroundColor: '#FFFFFF',fontWeight:"bolder", borderRadius: "15px", borderColor: '#ff66000' }}
                                onClick={handleOpenModal}
                            ><span style={{ color: "#FF993C",fontWeight:"bolder" }}>Lọc vé</span>
                            </Button>
                        </Space>
                    </div>
                </div>

                <Table key="quanlyve" dataSource={dataSources} columns={columns}></Table>
                <Modal visible={isModalVisible} onCancel={handleCancel} style={{ borderRadius: '15px' }}
                    footer={[
                        <div className="container">
                            <div className="center">
                                <Button key="cancel" onClick={handleCancel} className="button-cancel">
                                    Hủy
                                </Button>,
                                <Button key="save" type="primary" onClick={() => handleOk(modalTaskId.Id, DateData)}
                                    className="button-ok">
                                    Lưu
                                </Button></div></div>,
                    ]}
                    title={[
                        <div className="container">
                            <div className="center">
                                <p><b></b>Đổi ngày sử dụng vé</p>
                            </div>
                        </div>

                    ]}
                    width={600}>
                    <Row gutter={[12, 10]}>
                        <Col className="gutter-row" span={6}>
                            <div style={style}>Số vé:</div>
                        </Col>
                        <Col className="gutter-row" span={16}>
                            <div style={style}>{modalTaskId.TicketNumber}</div>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <div style={style}>Sự kiện:</div>
                        </Col>
                        <Col className="gutter-row" span={16}>
                            <div style={style}>{modalTaskId.Event}</div>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <div style={style}>Cổng:</div>
                        </Col>
                        <Col className="gutter-row" span={16}>
                            <div style={style}>{modalTaskId.Gate}</div>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <div style={style}>Ngày hết hạn:</div>
                        </Col>
                        <Col className="gutter-row" span={16}>
                            <div style={style}><DatePicker onChange={onChange}
                                placeholder={modalTaskId.Date} format="DD/MM/YYYY"
                            /></div>
                        </Col>

                    </Row>

                </Modal>


                <Modal visible={filterModal} onOk={handleModal} onCancel={handleCancelModal} style={{ borderRadius: '15px' }}
                
                footer={[
                    <div className="container">
                        <div className="center">
                            <Button key="cancel" onClick={handleCancelModal} className="button-cancel">
                                Hủy
                            </Button>,
                            <Button key="save" type="primary" onClick={handleModal}
                                className="button-ok">
                                Lọc
                            </Button></div></div>,
                ]}
                title={[
                    <div className="container">
                        <div className="center">
                            <p><b></b>Đổi ngày sử dụng vé</p>
                        </div>
                    </div>

                ]}
                width={500}
                >
                
                    <Row>
                        
                        <Col span={12} style={{fontFamily:"tabular-nums",fontSize:"16px",fontWeight:"500"}}><b>Từ ngày</b></Col>
                        <Col span={12} style={{fontFamily:"tabular-nums",fontSize:"16px",fontWeight:"500"}}><b>Đến ngày</b></Col>
                        
                    </Row>
                    <Row>
                        <Col span={12}>  <DatePicker onChange={onChange1} onOk={onOk} format={dateFormat} /></Col>
                        <Col span={12}>    <DatePicker onChange={onChange2} onOk={onOk} format={dateFormat} /></Col>
                    </Row>
                    <Divider orientation="left">Tình trạng sử dụng</Divider>

                    <Space size={"large"} direction="horizontal">
                        <div>
                            <Radio.Group value={FilterModalStatus} onChange={radioButton}>
                                <Radio value={"all"}>Tất cả</Radio>
                                <Radio value={"used"}>Đã sử dụng</Radio>
                                <Radio value={"work"}>Chưa sử dụng</Radio>
                                 <Radio value={"expire"}>Hết hạn</Radio>
                            </Radio.Group>
                        </div>
                    </Space>
                    <Divider orientation="left">Cổng check-in</Divider>
                    <Row gutter={[16, 24]}>
                        <Col className="gutter-row" span={6}>
                        <Checkbox value="all" onChange={onCheckAllChange} indeterminate={indeterminate} checked={isCheckAll} >Tất cả</Checkbox>
                        </Col>
                        <Col className="gutter-row" span={16}>
                        <Checkbox.Group style={{ width: '100%' }} onChange={checkBox} options={plainOptions} value={FilterModalGate} disabled={isCheckAll} />
                        </Col>
                        
                    </Row>


                </Modal>
            </Content>
        </>
        //  <DatePicker style={{ float: "left", marginRight: "100px" }} onChange={onChange1} format={dateFormat} />
        //  <DatePicker style={{ float: "right", marginLeft: "75px" }} onChange={onChange2} format={dateFormat} />
        //
    );


};
export default Quanlyve;