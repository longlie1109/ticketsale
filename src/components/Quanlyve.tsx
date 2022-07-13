import { Button, Dropdown, Space, Table, Tag, Modal, Layout, DatePicker, DatePickerProps, Input, Checkbox, Col, Row, Radio, RadioChangeEvent } from "antd";
import { collection, doc, DocumentData, getDoc, getDocs, onSnapshot, query, QueryDocumentSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect, useState, Fragment } from "react";
import { db } from "../firebase.config";
import type { ColumnsType } from 'antd/lib/table';
import { CSVLink } from "react-csv"
import { set } from "immer/dist/internal";
import moment, { Moment } from "moment";
import { MoreOutlined } from "@ant-design/icons";
import { RangePickerProps } from "antd/lib/date-picker";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
interface tickets {
    Id: string;
    BlockingCode: string;
    Date: string;
    ExpireDate: string;
    Gate: string;
    Status: string;
    TicketNumber: string;

}
const tagColor = (param: string) => {
    switch (param) {
        case 'used':
            return (<><Tag color='green'>{param}</Tag></>)

            break;
        case 'expire':
            return (<><Tag color='red'>{param}</Tag></>)

            break;
        default:
            return (<><Tag color='geekblue'>{param}</Tag></>)

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
    const [modalTaskId, setModalTaskId] = useState<tickets>({ Id: '', BlockingCode: '', Date: '', ExpireDate: '', Gate: '', Status: '', TicketNumber: '' });
    
    //useState lien quan den button loc ve.
    const [filterModal, setFilterModal] = useState(false);
    const [DateFrom, setDateFrom] = useState<moment.Moment>();
    const [DateTo, setDateTo] = useState<moment.Moment>();
    const [FilterModalGate,setFilterModalGate]=useState();
    const [FilterModalStatus,setFilterModalStatus]=useState('all');
    const radioButton = (e: RadioChangeEvent) => {
        console.log('radio checked', e.target.value);
        setFilterModalStatus(e.target.value);
    }
    const checkBox = (e: CheckboxChangeEvent) => {

    }
    
   
   
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

        setFilterModal(false);
    }
    const onChange1 = (
        value: DatePickerProps['value'] | RangePickerProps['value'],
        dateString: [string, string] | string,
    ) => {
        const time1 = moment('12/07/2022', 'DD/MM/YYYY');
        const time2 = moment(dateString[0], 'DD/MM/YYYY');
        const time3 = moment(dateString[1], 'DD/MM/YYYY')
        setDateFrom(time2);
        setDateTo(time3);
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
        console.log(moment(time1).isBetween(DateFrom, DateTo, "day"));
    };
    const onChange2 = (
        value: DatePickerProps['value'] | RangePickerProps['value'],
        dateString: [string, string] | string,
    ) => {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
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
            ticketResult.push({ Id: doc.id, BlockingCode: doc.get("BlockingCode"), Date: doc.get("Date"), ExpireDate: doc.get("ExpireDate"), Gate: doc.get("Gate"), Status: doc.get("Status"), TicketNumber: doc.get("TicketNumber") });

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
            <div>
                <h1>Danh Sách Vé</h1>
                <div className="search-inner">
                    <Input
                        placeholder="tìm theo số vé"
                        value={SearchValue}
                        onChange={e => {
                            const currValue = e.target.value;
                            setSearchValue(currValue);
                            const filteredData = dataSource.filter(entry =>
                                entry.TicketNumber.includes(currValue)
                            );
                            setDataSources(filteredData);
                        }}
                        style={{ float: "left", display: "inline", width: "144px" }}
                    />
                    <Button type="primary" shape="round" size="large" style={{ float: "right", display: "inline" }}><CSVLink
                        filename={"Expense_Table.csv"}
                        data={dataSource}
                        className="btn btn-primary">
                        Export to CSV
                    </CSVLink></Button>
                    <Button
                        type="primary"
                        shape="round"
                        size="large"
                        style={{ float: "right", display: "inline" }}
                        onClick={handleOpenModal}
                    >Lọc vé</Button>

                </div>
            </div>

            <Table key="quanlyve" dataSource={dataSources} columns={columns}></Table>
            <Modal title="Đổi ngày sử dụng vé" visible={isModalVisible} onOk={() => handleOk(modalTaskId.Id, DateData)} onCancel={handleCancel}>
                <p>Số vé :         {modalTaskId.TicketNumber}</p>
                <p>BookingCode:    {modalTaskId.BlockingCode}</p>
                <p>Cổng:           {modalTaskId.Gate}</p>
                <DatePicker onChange={onChange} placeholder={modalTaskId.Date} format="DD/MM/YYYY" />
            </Modal>
            <Modal title="Lọc vé" visible={filterModal} onOk={handleModal} onCancel={handleCancelModal}>

                <div style={{ display: "flex", flexWrap: "nowrap" }}>
                    <p style={{ float: "left", marginRight: "100px" }}>từ ngày</p>
                    <p style={{ float: "right", marginLeft: "175px" }}>đến ngày</p>
                </div>

                <div style={{ display: "flex", flexWrap: "nowrap" }}>
                    <DatePicker.RangePicker onChange={onChange1} onOk={onOk} format={dateFormat} />
                </div>
                <Space size={"middle"}>
                    <p>Tình trạng sử dụng </p>
                    <div>
                        <Radio.Group value={FilterModalStatus} onChange={radioButton}>
                            <Radio value={"all"}>Tất cả</Radio>
                            <Radio value={"used"}>Đã sử dụng</Radio>
                            <Radio value={"work"}>Chưa sử dụng</Radio>
                            <Radio value={"expire"}>Hết hạn</Radio>
                        </Radio.Group>
                    </div>
                </Space>
                <div>
                    <Checkbox.Group style={{ width: '100%' }}>
                        <p>Cổng check-in</p>
                        <div>
                            <Row>
                                <Col span={8}>
                                    <Checkbox value="A">A</Checkbox>
                                </Col>
                                <Col span={8}>
                                    <Checkbox value="B">B</Checkbox>
                                </Col>
                                <Col span={8}>
                                    <Checkbox value="C">C</Checkbox>
                                </Col>
                                <Col span={8}>
                                    <Checkbox value="D">D</Checkbox>
                                </Col>
                                <Col span={8}>
                                    <Checkbox value="E">E</Checkbox>
                                </Col>
                            </Row>
                        </div>
                    </Checkbox.Group>
                </div>


            </Modal>
        </>
        //  <DatePicker style={{ float: "left", marginRight: "100px" }} onChange={onChange1} format={dateFormat} />
        //  <DatePicker style={{ float: "right", marginLeft: "75px" }} onChange={onChange2} format={dateFormat} />
        //
    );


};
export default Quanlyve;