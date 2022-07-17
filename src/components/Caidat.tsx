import React, { useEffect, useState } from "react";
import { Button, DatePicker, Modal, Space, Table, Tag, Typography } from 'antd';
import { collection, DocumentData, getDocs, QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "../firebase.config";
import { ColumnsType } from "antd/lib/table";
import { MoreOutlined } from "@ant-design/icons";
const { Title } = Typography;
interface events {
    Id: string;
    Code: string;
    Date: string;
    ExpireDate: string;
    Price: string;
    Status: string;
    ComboPrice: string;
    Name:string;
}
const tagColor = (param: string) => {
    switch (param) {
        case 'Đang áp dụng':
            return (<><Tag color='green'>{param}</Tag></>)

            break;
        case 'Tắt':
            return (<><Tag color='red'>{param}</Tag></>)

            break;
        default:
            return (<><Tag color='geekblue'>{param}</Tag></>)

            break;
    }
}
const Caidat = () => {
    const [events, setEvents] = useState<events[]>([])
    const eventRef = collection(db, "caidat");
    const [modalTaskId, setModalTaskId] = useState<events>({Id:'',Code: '',Date: '',ExpireDate: '',Price: '',Status: '', ComboPrice: '', Name:'',});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const handleOk = () => {
        //updateTicket(id, newDate);
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const showModal = (data: events) => {
        setModalTaskId(data)
        setIsModalVisible(true);
    };
    
    const getEvents = async () => {
        const data = await getDocs(eventRef);
        const ticketResult: events[] = [];
        const result: QueryDocumentSnapshot<DocumentData>[] = [];
        data.docs.map((doc) => {
            result.push(doc);
            console.log(doc)
            ticketResult.push({ Id: doc.id,Name:doc.get('Name'), Code: doc.get("MaGoi"), Date: doc.get("Date"), ExpireDate: doc.get("ExpireDate"), Price: doc.get("Price"), Status: doc.get("Status"), ComboPrice: doc.get("ComboPrice") });

        });
        
        setEvents(ticketResult);
        setDataSources(ticketResult);
    };
    useEffect(() => {

        getEvents();

    }, [])
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
         
        },
        {
            title: 'Ngày hết hạn vé',
            dataIndex: 'ExpireDate',
            key: 'Ngày hết hạn vé',
           
        },
        {
            title: 'Status',
            dataIndex: 'Status',
            key: 'Status',
            render: (_, record, index) => (
                <>
                        <text>{record.Status}</text>
                        <Space size={"middle"}>
                        <Button icon={<MoreOutlined />}  onClick={() => showModal(record)}></Button>
                    </Space>
                </>

            ),
        },
    ];
    const dataSource: events[] = events;
    const [dataSources, setDataSources] = useState(dataSource);
    return (
        <>
        <Modal title="Đổi ngày sử dụng vé" visible={isModalVisible} onOk={() => handleOk()} onCancel={handleCancel}>
                
               
            </Modal>
        <Table key="quanlyve" dataSource={dataSources} columns={columns}></Table>
        </>
    );


};
export default Caidat;