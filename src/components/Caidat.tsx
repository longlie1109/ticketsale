import React, { useEffect, useState } from "react";
import { Button, Checkbox, Col, DatePicker, DatePickerProps, Divider, Input, Layout, Modal, Row, Select, Space, Table, Tag, TimePicker, TimePickerProps, Typography } from 'antd';
import { addDoc, collection, doc, DocumentData, getDocs, QueryDocumentSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { ColumnsType } from "antd/lib/table";
import { FormOutlined, MoreOutlined, SearchOutlined } from "@ant-design/icons";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import moment, { Moment } from "moment";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { CSVLink } from "react-csv";
import '../styles/header.css'
const { Title } = Typography;
const { Footer, Sider, Content } = Layout;
interface events {
    Id: string;
    Code: string;
    Date: string;
    ExpireDate: string;
    Price?: string;
    Status: string;
    ComboPrice?: string;
    Name: string;
    DateHour: string;
    ExpireDateHour: string;
}
const tagColor = (param: string) => {
    switch (param) {
        case 'Đang áp dụng':
            return (<><Tag color='green'  icon={"•"} >{param}</Tag></>)

            break;
        case 'Tắt':
            return (<><Tag color='red'  icon={"•"}>{param}</Tag></>)

            break;
        default:
            return (<><Tag color='grey'  icon={"•"}>{param}</Tag></>)

            break;
    }
}
const Caidat = () => {
    const [events, setEvents] = useState<events[]>([])
    const eventRef = collection(db, "caidat");
    const [modalTaskId, setModalTaskId] = useState<events>({ Id: '', Code: '', Date: '', ExpireDate: '', Price: '', Status: 'Đang áp dụng', ComboPrice: '', Name: '', DateHour: '', ExpireDateHour: '' });
    const [isModalVisible, setIsModalVisible] = useState(false);
    //state input form
    const [codeForm, setCodeForm] = useState(modalTaskId.Code);
    const [dateForm, setDateForm] = useState(modalTaskId.Date);
    const [expireDateForm, setExpireDateForm] = useState(modalTaskId.ExpireDate);
    const [priceForm, setPriceForm] = useState(modalTaskId.Price);
    const [statusForm, setStatusForm] = useState(modalTaskId.Status);
    const [comboPriceForm, setComboPriceForm] = useState(modalTaskId.ComboPrice);
    const [name, setName] = useState(modalTaskId.Name);
    const [dateHour, setDateHour] = useState(modalTaskId.DateHour);
    const [expireDateHour, setExpireDateHour] = useState(modalTaskId.ExpireDateHour);
    const [isChecked, setIsCheck] = useState(false);
    const [isCheckedCombo, setIsCheckedCombo] = useState(false);
    //state add modal
    const [filterModal, setFilterModal] = useState(false);
    const [codeFormAdd, setCodeFormAdd] = useState("");
    const [dateFormAdd, setDateFormAdd] = useState("");
    const [expireDateFormAdd, setExpireDateFormAdd] = useState("");
    const [priceFormAdd, setPriceFormAdd] = useState("");
    const [statusFormAdd, setStatusFormAdd] = useState("");
    const [comboPriceFormAdd, setComboPriceFormAdd] = useState("");
    const [nameAdd, setNameAdd] = useState("");
    const [dateHourAdd, setDateHourAdd] = useState("");
    const [expireDateHourAdd, setExpireDateHourAdd] = useState("");

    // function trong modal cập nhật
    const handleOk = (id: string) => {
        updateEvent(id);
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const showModal = (data: events) => {
        //nhớ set state
        setModalTaskId(data)
        setName(data.Name)
        setCodeForm(data.Code)
        setDateForm(data.Date)
        setDateHour(data.DateHour)
        setExpireDateForm(data.ExpireDate)
        setExpireDateHour(data.ExpireDateHour)
        setComboPriceForm(data.ComboPrice)
        setPriceForm(data.Price)
        setStatusForm(data.Status)
        setIsModalVisible(true);
    };
    //checkbox
    const onChange = (checkedValues: CheckboxValueType[]) => {
        console.log('checked = ', checkedValues);

    };
    //select option
    const { Option } = Select;
    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
        setStatusForm(value);
    };
    const handleChange1 = (value: string) => {
        console.log(`selected ${value}`);
        setStatusFormAdd(value);
    };
    //datepicker
    const onChange1: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
        setDateForm(dateString)
    };
    const onChange2: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
        setExpireDateForm(dateString)
    };
    const onChange3 = (time: Moment | null, timeString: string) => {
        console.log(time, timeString);
        setDateHour(timeString);
    };
    const onChange4 = (time: Moment | null, timeString: string) => {
        console.log(time, timeString);
        setExpireDateHour(timeString);
    };
    const onChange5 = (e: CheckboxChangeEvent) => {
        console.log('checked = ', e.target.checked);
        setIsCheck(!isChecked);
    };

    const onChange6 = (e: CheckboxChangeEvent) => {
        console.log('checked = ', e.target.checked);
        setIsCheckedCombo(!isCheckedCombo);
    };
    //update event.
    const updateEvent = async (id: string) => {
        const data = doc(db, "caidat", id);
        const newFields = { Code: codeForm, Date: dateForm, ExpireDate: expireDateForm, Price: priceForm, Status: statusForm, ComboPrice: comboPriceForm, Name: name, DateHour: dateHour, ExpireDateHour: expireDateHour };
        await updateDoc(data, newFields);
        console.log(newFields);
    }
    //ADD EVENT
    const addEvent = async () => {
        const data = collection(db, "caidat");
        const newFields = { Code: codeFormAdd, Date: dateFormAdd, ExpireDate: expireDateFormAdd, Price: priceFormAdd, Status: statusFormAdd, ComboPrice: comboPriceFormAdd, Name: nameAdd, DateHour: dateHourAdd, ExpireDateHour: expireDateHourAdd };
        await addDoc(data, newFields)
    }


    //FUNCTION MODAL ADD EVENT :
    const showModalAdd = () => {
        setFilterModal(true);
    };
    const handleOpenModal = () => {
        addEvent();
        setFilterModal(false);
    }
    const handleCancelModal = () => {
        setFilterModal(false);
    }
    const onChange7: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
        setExpireDateFormAdd(dateString)
    };
    const onChange8: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
        setDateFormAdd(dateString)
    };
    const onChange9 = (time: Moment | null, timeString: string) => {
        console.log(time, timeString);
        setDateHourAdd(timeString);
    };
    const onChange10 = (time: Moment | null, timeString: string) => {
        console.log(time, timeString);
        setExpireDateHourAdd(timeString);
    };
    //get firebase data
    const getEvents = async () => {
        const data = await getDocs(eventRef);
        const ticketResult: events[] = [];
        const result: QueryDocumentSnapshot<DocumentData>[] = [];
        data.docs.map((doc) => {
            result.push(doc);
            console.log(doc)
            ticketResult.push({ Id: doc.id, Name: doc.get('Name'), Code: doc.get("Code"), Date: doc.get("Date"), ExpireDate: doc.get("ExpireDate"), Price: doc.get("Price"), Status: doc.get("Status"), ComboPrice: doc.get("ComboPrice"), DateHour: doc.get("DateHour"), ExpireDateHour: doc.get("ExpireDateHour"), });

        });

        setEvents(ticketResult);
        setDataSources(ticketResult);
    };
    useEffect(() => {

        getEvents();

    }, [isModalVisible,filterModal])
    const columns: ColumnsType<events> = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (text: string, events: events) => (dataSource.indexOf(events) + 1)

        },
        {
            title: 'Mã gói',
            dataIndex: 'Code',
            key: 'Code',
            //  render:(_, record) => (
            //      <text>{record.get("BlockingCode")}</text>
            //  ),
        },
        {
            title: 'Tên Gói',
            dataIndex: 'Name',
            key: 'Name',
            // render:(_, record) => (
            //      <text>{record.get("TicketNumber")}</text>
            //   ),
        },
        {
            title: 'Giá vé',
            dataIndex: 'Price',
            key: 'Price',
        },
        {
            title: 'Gía vé theo combo',
            dataIndex: 'ComboPrice',
            key: 'ComboPrice',
        },
        {
            title: 'Ngày áp dụng',
            dataIndex: 'Date',
            key: 'Ngày áp dụng',
            render: (_, record) => (
                <>
                    <Space>
                        <span>{record.Date}</span>
                        <span>{record.DateHour}</span>
                    </Space>
                </>
            ),

        },
        {
            title: 'Ngày hết hạn vé',
            dataIndex: 'ExpireDate',
            key: 'Ngày hết hạn vé',
            render: (_, record) => (
                <>
                    <Space>
                        <span>{record.ExpireDate}</span>
                        <span>{record.ExpireDateHour}</span>
                    </Space>
                </>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'Status',
            key: 'Status',
            render: (_, record, index) => (
               tagColor(record.Status)

            ),
        },
        {
            title: '',
            dataIndex: '',
            key: '',
            render: (_, record) => (
                <>
                    <Space size={"middle"}>
                        <Button type="link" danger icon={<FormOutlined />} onClick={() => showModal(record)}>Cập nhật</Button>
                    </Space>
                </>
            ),
        },
    ];
    const dataSource: events[] = events;
    const [dataSources, setDataSources] = useState(dataSource);
    return (
        <>
            <Content className="site-layout-background">
                <div>
                    <Title>Danh Sách sự kiện</Title>
                    <div className="search-inner">
                        <Input
                            placeholder="tìm theo số vé"
                            className="search"
                            suffix={<SearchOutlined />}
                            style={{ float: "left", width: "280px", backgroundColor: '#EDEDED', borderRadius: '15px' }} />
                        <Space size={"small"} style={{ float: "right" }}>
                            <Button type="primary" shape="round" size="large" style={{ float: "right",fontWeight:"bolder", backgroundColor: '#FFFFFF', borderRadius: "15px", borderColor: '#ff6600' }}>
                                <CSVLink
                                    filename={"Expense_Table.csv"}
                                    data={dataSources}
                                    className="btn btn-primary">
                                    <span style={{ color: "#FF993C" }}>Export to CSV</span>
                                </CSVLink></Button>
                            <Button
                                type="primary"
                                shape="round"
                                size="large"
                                style={{ float: "right", backgroundColor: '#FFFFFF', borderRadius: "15px", borderColor: '#ff6600' }}
                                onClick={showModalAdd}
                            >
                                <span style={{ color: "#FF993C",fontWeight:"bolder" }}>Thêm gói vé</span>
                            </Button>
                        </Space>
                    </div>
                </div>
                <Modal
                    visible={isModalVisible} className="caidat-modal"
                    onOk={() => handleOk(modalTaskId.Id)} onCancel={handleCancel}
                    title={[
                        <div className="container">
                            <div className="center">
                                <p><b></b>Đổi ngày sử dụng vé</p>
                            </div>
                        </div>
                    ]}
                    footer={[
                        <div className="container">
                            <div className="center">
                                <Button key="cancel" onClick={handleCancel} className="button-cancel">
                                    Hủy
                                </Button>,
                                <Button key="save" type="primary" onClick={() => handleOk(modalTaskId.Id)}
                                    className="button-ok">
                                    Lưu
                                </Button></div></div>,
                    ]}
                >
                    <Row>

                        <Col span={12} style={{ fontFamily: "tabular-nums", fontSize: "16px", fontWeight: "500" }}><b>Mã sự kiện</b></Col>
                        <Col span={12} style={{ fontFamily: "tabular-nums", fontSize: "16px", fontWeight: "500" }}><b>Tên sự kiện</b></Col>

                    </Row>
                    <Row>
                        <Col span={12}><input placeholder={modalTaskId.Code} defaultValue={modalTaskId.Code} onChange={(event) => (setCodeForm(event.target.value))} value={modalTaskId.Code} />  </Col>
                        <Col span={12}><input placeholder={modalTaskId.Name} defaultValue={modalTaskId.Name} onChange={(event) => (setName(event.target.value))} value={modalTaskId.Name} />  </Col>
                    </Row>
                    <Row>
                        <Col span={12}> <p>Ngày áp dụng</p></Col>
                        <Col span={12}> <p>Ngày hết hạn</p></Col>
                    </Row>
                    <Row>
                        <Col span={12}> <DatePicker onChange={onChange1} />
                            <TimePicker onChange={onChange3} defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} /></Col>
                        <Col span={12}><DatePicker onChange={onChange2} />
                            <TimePicker onChange={onChange4} defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} /> </Col>
                    </Row>
                    <Divider orientation="left">Giá vé áp dụng</Divider>
                    <Row>
                        <Checkbox value="Price" onChange={onChange5}>giá vé đơn</Checkbox>
                        <input placeholder={modalTaskId.Price} defaultValue={modalTaskId.Price} onChange={(event) => { setPriceForm(event.target.value) }} disabled={!isChecked} />
                    </Row>
                    <Row>
                        <Checkbox value="Combo" onChange={onChange6}>giá vé combo</Checkbox>
                        <input placeholder={modalTaskId.ComboPrice} defaultValue={modalTaskId.ComboPrice} onChange={(event) => setComboPriceForm(event.target.value)} disabled={!isCheckedCombo} />
                    </Row>
                    <Divider orientation="left">Tình trạng</Divider>
                    <Select style={{ width: 200 }} onChange={handleChange}>
                        <Option value="Tắt">Tắt</Option>
                        <Option value="Đang áp dụng">Đang áp dụng</Option>
                    </Select>
                </Modal>

                <Modal
                    className="caidat-add" visible={filterModal} onOk={handleOpenModal} onCancel={handleCancelModal}
                    title={[
                        <div className="container">
                            <div className="center">
                                <p><b>Thêm gói vé</b></p>
                            </div>
                        </div>
                    ]}
                    footer={[
                        <div className="container">
                            <div className="center">
                                <Button key="cancel" onClick={handleCancelModal} className="button-cancel">
                                    Hủy
                                </Button>,
                                <Button key="save" type="primary" onClick={handleOpenModal}
                                    className="button-ok">
                                    Lưu
                                </Button></div></div>,
                    ]}>
                    <Row>

                        <Col span={12} style={{ fontFamily: "tabular-nums", fontSize: "16px", fontWeight: "500" }}><b>Mã sự kiện</b></Col>
                        <Col span={12} style={{ fontFamily: "tabular-nums", fontSize: "16px", fontWeight: "500" }}><b>Tên sự kiện</b></Col>

                    </Row>
                    <Row>
                        <Col span={12}><input onChange={(event) => (setCodeFormAdd(event.target.value))} /></Col>
                        <Col span={12}> <input onChange={(event) => (setNameAdd(event.target.value))} /></Col>
                    </Row>
                    
                    <Row>
                        <Col span={12}> <p>Ngày áp dụng</p></Col>
                        <Col span={12}> <p>Ngày hết hạn</p></Col>
                    </Row>
                   <Row>
                    <Col span={12}><DatePicker onChange={onChange8} />
                    <TimePicker onChange={onChange9} defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} /></Col>
                    <Col span={12}><DatePicker onChange={onChange7} />
                    <TimePicker onChange={onChange10} defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} /></Col>
                   </Row>
                   <Divider orientation="left">Giá vé áp dụng</Divider>
                   <Row>
                    <Checkbox value="Price" onChange={onChange5}>giá vé đơn</Checkbox>
                    <input onChange={(event) => { setPriceFormAdd(event.target.value) }} disabled={!isChecked} />
                   </Row>
                   <Row>
                   <Checkbox value="Combo" onChange={onChange6}>giá vé combo</Checkbox>
                   <input onChange={(event) => setComboPriceFormAdd(event.target.value)} disabled={!isCheckedCombo} />
                   </Row>
                   <Divider orientation="left">Tình trạng</Divider>
                    <Select style={{ width: 200 }} onChange={handleChange1}>
                        <Option value="Tắt">Tắt</Option>
                        <Option value="Đang áp dụng">Đang áp dụng</Option>
                    </Select>

                </Modal>
                <Table key="quanlyve" dataSource={dataSources} columns={columns}></Table>
            </Content>
        </>
    );


};
export default Caidat;