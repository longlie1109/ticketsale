import { Button, Dropdown, Space, Table, Tag, Modal, Layout, DatePicker, DatePickerProps, Input, Checkbox, Col, Row, Radio, RadioChangeEvent } from "antd";
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
interface tickets {
    Id: string;
    BlockingCode: string;
    Date: string;
    ExpireDate: string;
    Gate: string;
    Status: string;
    TicketNumber: string;

}
interface filterValue {
    Date: string,
    Status: string,
    Gate: string,
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

    // state lien quan den checkbox
    const plainOptions = ['C???ng 1', 'C???ng 2', 'C???ng 3', 'C???ng 4', 'C???ng 5'];
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
    //modal filter v??
    const handleOpenModal = () => {
        setFilterModal(true);
    }
    const handleCancelModal = () => {
        setFilterModal(false);
    }
    const handleModal = () => {

        const filteredData = dataSource.filter(entry => {
            if (FilterModalStatus == "all") {
                console.log("all")
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


    //modal update ng??y v??
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
            title: 'S??? V??',
            dataIndex: 'TicketNumber',
            key: 'S??? V??',
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
            title: 'Ng??y s??? d???ng',
            dataIndex: 'Date',
            key: 'Date',
            // render:(_, record) => (
            //       <text>{record.get("Date")}</text>
            //  ),
        },
        {
            title: 'Ng??y xu???t v??',
            dataIndex: 'ExpireDate',
            key: 'Ng??y xu???t v??',
            //   render:(_, record) => (
            //      <text>{record.get("ExpireDate")}</text>
            //  ),
        },
        {
            title: 'Gate',
            dataIndex: 'Gate',
            key: 'C???ng',
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
            <Title>Danh S??ch V??</Title>
                <div className="search-inner">
                    <Input
                        placeholder="t??m theo s??? v??"
                        className="search"
                        value={SearchValue}
                        suffix={<SearchOutlined/>}
                        onChange={e => {
                            const currValue = e.target.value;
                            setSearchValue(currValue);
                            const filteredData = dataSource.filter(entry =>
                                entry.TicketNumber.includes(currValue)
                            );
                            setDataSources(filteredData);
                        }}
                        style={{ float: "left", width: "280px" , backgroundColor: '#EDEDED',borderRadius:'15px'}}
                        
                    />
                    
                    <Button type="primary" shape="round" size="large" style={{ float: "right", display: "inline",backgroundColor:'#ff6600',borderRadius:"15px",borderColor:'#ff6600' }}><CSVLink
                        filename={"Expense_Table.csv"}
                        data={dataSource}
                        className="btn btn-primary">
                        Export to CSV
                    </CSVLink></Button>
                    <Button
                        type="primary"
                        shape="round"
                        size="large"
                        style={{ float: "right", display: "inline",backgroundColor:'#ff6600',borderRadius:"15px",borderColor:'#ff6600' }}
                        onClick={handleOpenModal}
                    >L???c v??</Button>

                </div>
            </div>

            <Table key="quanlyve" dataSource={dataSources} columns={columns}></Table>
            <Modal title="?????i ng??y s??? d???ng v??" visible={isModalVisible} onOk={() => handleOk(modalTaskId.Id, DateData)} onCancel={handleCancel}>
                <p>S??? v?? :         {modalTaskId.TicketNumber}</p>
                <p>BookingCode:    {modalTaskId.BlockingCode}</p>
                <p>C???ng:           {modalTaskId.Gate}</p>
                <DatePicker onChange={onChange} placeholder={modalTaskId.Date} format="DD/MM/YYYY" />
            </Modal>
            <Modal title="L???c v??" visible={filterModal} onOk={handleModal} onCancel={handleCancelModal}>

                <div style={{ display: "flex", flexWrap: "nowrap" }}>
                    <p style={{ float: "left", marginRight: "100px" }}>t??? ng??y</p>
                    <p style={{ float: "right", marginLeft: "175px" }}>?????n ng??y</p>
                </div>

                <div style={{ display: "flex", flexWrap: "nowrap" }}>
                    <DatePicker onChange={onChange1} onOk={onOk} format={dateFormat} />
                    <DatePicker onChange={onChange2} onOk={onOk} format={dateFormat} />
                </div>
                <Space size={"middle"}>
                    <p>T??nh tr???ng s??? d???ng </p>
                    <div>
                        <Radio.Group value={FilterModalStatus} onChange={radioButton}>
                            <Radio value={"all"}>T???t c???</Radio>
                            <Radio value={"used"}>???? s??? d???ng</Radio>
                            <Radio value={"work"}>Ch??a s??? d???ng</Radio>
                            <Radio value={"expire"}>H???t h???n</Radio>
                        </Radio.Group>
                    </div>
                </Space>
                <div>
                    <p>C???ng check-in</p>
                    <div>
                        <Col span={8}>
                            <Checkbox value="all" onChange={onCheckAllChange} indeterminate={indeterminate} checked={isCheckAll} >T???t c???</Checkbox>
                        </Col>
                        <Checkbox.Group style={{ width: '100%' }} onChange={checkBox} options={plainOptions} value={FilterModalGate} disabled={isCheckAll} />
                    </div>

                </div>


            </Modal>
        </>
        //  <DatePicker style={{ float: "left", marginRight: "100px" }} onChange={onChange1} format={dateFormat} />
        //  <DatePicker style={{ float: "right", marginLeft: "75px" }} onChange={onChange2} format={dateFormat} />
        //
    );


};
export default Quanlyve;