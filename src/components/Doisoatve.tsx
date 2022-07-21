import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Layout, Table, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import { collection, DocumentData, getDocs, QueryDocumentSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { db } from "../firebase.config";
import '../styles/header.css'

interface tickets {
    Id: string;
    BlockingCode: string;
    Date: string;
    ExpireDate: string;
    Gate: string;
    Status: string;
    TicketNumber: string;

}
const { Search } = Input;
const Doisoatve = () => {
    const [tickets, setTickets] = useState<tickets[]>([])
    const ticketRef = collection(db, "quanlyve");
    const { Header, Content, Footer, Sider } = Layout;
    const { Title } = Typography;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => {
        setIsModalVisible(true);
    };
    const getTickets = async () => {
        const data = await getDocs(ticketRef);
        const ticketResult: tickets[] = [];
        const result: QueryDocumentSnapshot<DocumentData>[] = [];
        data.docs.map((doc) => {
            result.push(doc);
            //console.log(doc)
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
                   
                </>

            ),
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
                        style={{ float: "left", width: "280px", backgroundColor: '#EDEDED', borderRadius: '15px' }} />

                    <Button type="primary" shape="round" size="large" style={{ float: "right", display: "inline", backgroundColor: '#ff6600', borderRadius: "15px", borderColor: '#ff6600' }}>
                        <CSVLink
                            filename={"Expense_Table.csv"}
                            data={dataSources}
                            className="btn btn-primary">
                            Export to CSV
                        </CSVLink></Button>
                    <Button
                        type="primary"
                        shape="round"
                        size="large"
                        style={{ float: "right", display: "inline", backgroundColor: '#ff6600', borderRadius: "15px", borderColor: '#ff6600' }}
                        onClick={showModal}
                    >Thêm gói vé</Button>
                </div>
            </div>
            <Table key="quanlyve" dataSource={dataSources} columns={columns}></Table>
            </Content>
            
        </Content>
        <Content className="filter-background">
            <Sider className="side">Side bar</Sider>
        </Content>
    </>
    );


};
export default Doisoatve;