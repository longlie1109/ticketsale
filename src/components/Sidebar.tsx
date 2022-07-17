import { HomeOutlined, SettingOutlined, TagOutlined, WalletOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import Sider from "antd/lib/layout/Sider";
import { Link } from "react-router-dom";

export const Sidebar = () => {
  const leftmenu = [
    {
      title: "Trang chủ",
      path: "/",
      icon: <HomeOutlined />,
    },
    {
      title: "Quản Lý vé",
      path: "/quanlyve",
      icon: <WalletOutlined />,
    },
    {
      title: "Đổi Soát Vé",
      path: "/doisoatve",
      icon: <TagOutlined />,
    },
    {
      title: "Cài Đặt",
      path: "/caidat",
      icon: <SettingOutlined />,
    }
  ]

  return (
    <div className="leftmenu">
      <ul>
        {
          leftmenu.map(e => { return <Link to={e.path} style={{ textDecoration: 'none' }}><li><div className='icon'>{e.icon}</div>{e.title}</li></Link> })
        }
      </ul>
    </div>
  )
}