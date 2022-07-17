import '../styles/header.css'
import { BellOutlined, HomeOutlined, MailOutlined, SettingOutlined, TagOutlined, WalletOutlined } from "@ant-design/icons";
import { Avatar, Button, Layout, Menu, Input } from "antd";
import { Outlet, Link } from "react-router-dom";
import { Headers } from './Headers';
import { Sidebar } from './Sidebar';

const { Search } = Input;
const { Footer, Sider, Content } = Layout;
const onSearch = (value: string) => console.log(value);
const Trangchu = () => {
  return (
    <Layout>
      <Headers />
      <Layout>
        <Sider style={{ color: '#f0f2f5', backgroundColor: "#f0f2f5" }}>
          <Sidebar />
        </Sider>
       
        <Layout>
          <Content className="site-layout-background">
            <Outlet />
          </Content>
         
        </Layout>
      </Layout>
      <Footer><p style={{float:'left',display:'flex',position:'absolute',left:'5px',top:'640px'}}>Copyright © 2020 Alta Software </p></Footer>
    </Layout>
  );

};


export default Trangchu;