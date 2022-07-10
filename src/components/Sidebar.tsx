import { HomeOutlined, SettingOutlined, TagOutlined, WalletOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import Sider from "antd/lib/layout/Sider";

<Sider style={{ color: 'red', float: 'right', margin: '16px 0 16px 24px' }}>
            <Menu>
              <Menu.Item ><span><HomeOutlined/><span>Trang chủ</span></span></Menu.Item>
              <Menu.Item><span><TagOutlined/><span>Quản lý vé</span></span></Menu.Item>
              <Menu.Item><span><WalletOutlined /><span>Đối soát vé</span></span></Menu.Item>
              <Menu.Item><span><SettingOutlined/><span>Cài đặt gói dịch vụ</span></span></Menu.Item>
            </Menu>;
</Sider>