import React from 'react';
import './App.css';
import { Layout, Avatar, Menu, Input, Button, Image } from 'antd';
import Title from 'antd/lib/typography/Title';
import SubMenu from 'antd/lib/menu/SubMenu';
import { BellOutlined, HomeOutlined, MailOutlined, SettingOutlined, TagOutlined, WalletOutlined } from '@ant-design/icons';
import MainRoutes from './routes/MainRoutes';
import {db} from "../src/firebase.config"


function App() {
  return (
    <div className="App">
     <MainRoutes/>
    </div>
  );
}

export default App;
