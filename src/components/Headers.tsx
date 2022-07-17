import { BellOutlined, GithubOutlined, MailOutlined, SearchOutlined } from "@ant-design/icons";
import { Avatar, Button, Layout } from "antd";
import { Input, Space } from 'antd';
import { Link } from "react-router-dom";
import '../styles/sidebar.css'

const onSearch = (value: string) => console.log(value);
const { Header, Sider, Content } = Layout;
const { Search } = Input;

export const Headers = () => {
    return ( <div className="header">
    <Link to='/'>
    <div className="logo">
    </div> 
    </Link>
    
    <input type='text' className='search'/>
    <SearchOutlined className="searchicon"/>

    <MailOutlined  className="mailicon" />

    <BellOutlined className="bellicon" />

    <GithubOutlined className="giticon"/>
        
</div>);
}  