import { Button, Dropdown, Space, Table, Tag } from "antd";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import React, { useEffect, useState, Fragment } from "react";
import { db } from "../firebase.config";
import type { ColumnsType } from 'antd/lib/table';
import { text } from "node:stream/consumers";
import { JsxElement } from "typescript";

interface tickets {
    BlockingCode: string;
    Date: string;
    ExpireDate: string;
    Gate: string;
    Status: string;
    TicketNumber: string;

}
const tagColor = (param: tickets) => {
    switch (param.Status) {
        case 'used':
            return (<><Tag color='green'>{param.Status}</Tag></>)

            break;
        case 'expire':
            return (<><Tag color='red'>{param.Status}</Tag></>)

            break;
        default:
            return (<><Tag color='geekblue'>{param.Status}</Tag></>)

            break;
    }
}

const Quanlyve = () => {
    const [tickets, setTickets] = useState<tickets[]>([]);
    const ticketRef = collection(db, "quanlyve");
    let color = "green";
    useEffect(() => {
        const getTickets = async () => {
            const data = await getDocs(ticketRef);
            console.log(data);
            setTickets(data.docs.map((doc) => ({ ...doc.data() as tickets, id: doc.id })));
        };
        getTickets();

    }, []);
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
        },
        {
            title: 'Số Vé',
            dataIndex: 'TicketNumber',
            key: 'Số Vé',
        },
        {
            title: 'Status',
            dataIndex: 'Status',
            key: 'Status',
            render: (text: string, record) => (
                tagColor(record)

            )
        },
        {
            title: 'Ngày sử dụng',
            dataIndex: 'Date',
            key: 'Ngày sử dụng',
        },
        {
            title: 'Ngày xuất vé',
            dataIndex: 'ExpireDate',
            key: 'Ngày xuất vé',
        },
        {
            title: 'Gate',
            dataIndex: 'Gate',
            key: 'Cổng',
            render: (_, record) => (
                <Space size="middle">
                    <a>Invite {record.Gate}</a>
                    <Dropdown.Button onClick={handleButtonClick} overlay={menu}>
                        Dropdown
                    </Dropdown.Button>
                </Space>
            ),
        },
    ];
    const dataSource: tickets[] = tickets;
    return (
        <Table key="quanlyve" dataSource={dataSource} columns={columns} />
        //<div>{tickets.map((ticket,index)=>{return <div key={index}><h1>{ticket.BlockingCode}</h1></div>})}</div>
    );


};
export default Quanlyve;