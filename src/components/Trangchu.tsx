import { BellOutlined, HomeOutlined, MailOutlined, SettingOutlined, TagOutlined, WalletOutlined } from "@ant-design/icons";
import { Avatar, Button, Layout, Menu,Input } from "antd"; 
import React from "react";
import { Outlet,Link } from "react-router-dom";

const { Search } = Input;
const { Header, Footer, Sider, Content } = Layout;
const onSearch = (value: string) => console.log(value);
const Trangchu = () => {
     return(
        <Layout>
        <Header style={{ backgroundColor: '#f5f2f0' }}>

          <img className="logo" src="https://s3-alpha-sig.figma.com/img/a28a/533d/5a3e93c0e43fdc7e0a0cde0d92a2c304?Expires=1658102400&Signature=PKl8VRLxKDQ1AdvvQMTaaxSi1kIpjTq~Zb37uKdzkWfuGv9yI4xRQX5LAcKkih-Xge8epYXAunMsPtABd--Z9uMZdtaEsN~rR8wsbYg-R7pK~nfjSqA747U51fP5BERphuYKDTcxdl7fpqP5zTOxzhuXqyPt1zgSAXR55qJ3L1YbVSUPCla-pdUXce91w3sjSlEGqtfJEPumgy61TaRQupou27lK7Sml2lWqPlCwQqcFaP3b6T6arcm50FPcuOesCOHjjJJI1QEiLr0Ej7N1Yi47NcGCO-Vr0NjtASFufLgnaA5oG97XugDdK5ag5grsonknarKk-hEjurbPeS8gWA__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA" />
          <Search placeholder="input search text" onSearch={onSearch} enterButton className='searchbar' style={{ float: 'left', display: 'inline', padding: '16px 0 16px 36px' }} />
          <Avatar style={{ float: 'right', display: 'inline' }} src='./avatar.png' />
          <Button type="text" ghost shape="default" icon={<BellOutlined />} style={{ float: 'right', display: 'inline' }} size='large' />
          <Button type="text" ghost shape="default" icon={<MailOutlined />} style={{ float: 'right', display: 'inline' }} size='large' />


        </Header>
        <Layout>
            
          <Sider style={{ color: 'red', float: 'right', margin: '16px 0 16px 24px' }}>
            <Menu>
              <Menu.Item ><span><HomeOutlined/><span><Link to="/">Trang Chủ</Link></span></span></Menu.Item>
              <Menu.Item><span><TagOutlined/><span><Link to="/quanlyve">Quản lý vé</Link></span></span></Menu.Item>
              <Menu.Item><span><WalletOutlined /><span><Link to="/doisoatve">Đối soát vé</Link></span></span></Menu.Item>
              <Menu.Item><span><SettingOutlined/><span><Link to="/caidat">Cài Đặt gói dịch vụ</Link></span></span></Menu.Item>
            </Menu>;
          </Sider>
          <Layout>
            <Outlet/>
          </Layout>
        </Layout>
      </Layout>
     );
        
    };
    

export default Trangchu;