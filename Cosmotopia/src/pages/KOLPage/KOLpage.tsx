import {
  AppleOutlined,
  AreaChartOutlined,
  AuditOutlined,
  BorderOutlined,
  ContactsOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuOutlined,
  ProductOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  SolutionOutlined,
  UserOutlined
} from '@ant-design/icons';
import cosmeLogo from '@/assets/logo/cosme_logo_2.png';
import { ConfigProvider, Layout, Menu, theme } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import helper from '@/helpers/index';
import __helpers from '@/helpers';

import { logout } from '@/redux/auth.slice';
import './styles.css';
import { RootState } from '@/redux/store';
function getItem(label: any, key: any, icon: any, children: any) {
  return {
    key,
    icon,
    label,
    children
  };
}
export default function KOLPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { Header, Content, Sider } = Layout;
  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken();
  // if (user?.role == "MEMBER") {
  //   navigate("/");
  // }
  const [items, setItems] = useState([]);
  const [key, setKey] = useState();
  const location = useLocation();
  const currentURI =
    location.pathname.split('/')[location.pathname.split('/').length - 1];
  const token = __helpers.cookie_get('AT');
  const userCookie = __helpers.cookie_get('user');

  const userObject =
    token && userCookie ? JSON.parse(userCookie) : { role: 'Guest' };

  const dataOpen = JSON.parse(localStorage.getItem('keys')) ?? [];

  const [openKeys, setOpenKeys] = useState(dataOpen);

  useEffect(() => {
    setItems([
      getItem('Tổng quan', 'tongquan'),
      getItem('Danh sách ', 'danhsach'),
      //   getItem('Chiến dịch', 'category'),
      //   getItem('Hỗ trợ', 'order'),
      getItem('Tạo liên kết', 'createLink'),
      getItem('Quản lý số dư', 'ballance'),
      getItem('Thông tin cá nhân', 'profile')
    ]);
  }, []);

  const handleSubMenuOpen = (keyMenuItem) => {
    setOpenKeys(keyMenuItem);
  };
  const handleSelectKey = (keyPath) => {
    setKey(keyPath);
  };

  useEffect(() => {
    localStorage.setItem('keys', JSON.stringify(openKeys));
  }, [openKeys]);

  useEffect(() => {
    handleSubMenuOpen([...openKeys, key]);
  }, [currentURI]);
  // const handleClick = () => {
  //   navigate("/");
  //   window.scrollTo({
  //     top: 0,
  //     behavior: "smooth",
  //   });
  // };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        style={{ backgroundColor: 'white' }}
        collapsed={false}
        width={250}
        className="pt-5"
        // style={{ backgroundColor: "yellow" }}
      >
        <ConfigProvider
          theme={{
            components: {
              Menu: {
                itemHoverBg: '#none', // Màu nền khi hover
                // itemHoverColor: '#d46b08' // Màu chữ khi hover
                itemPaddingInline: '32px',
                itemActiveBg: '#none',
                itemBg: '#none',
                itemSelectedBg: 'transparent',
                itemSelectedColor: '#none',
                // fontFamily: 'Monsterrat, sans-serif',
              }
            }
          }}
        >
          <Menu
            // style={{ backgroundColor: '#CDC9C9' }}
            defaultSelectedKeys={['profile']}
            mode="inline"
            selectedKeys={currentURI}
            inlineIndent={32}
            openKeys={openKeys}
            onOpenChange={handleSubMenuOpen}
            // items={items}
          >
            {items.map((item) =>
              item.children ? (
                <Menu.SubMenu
                  key={item.key}
                  icon={item.icon}
                  title={item.label}
                >
                  {item.children.map((subItem) => (
                    <Menu.Item
                      key={subItem.key}
                      // icon={subItem.icon}
                      title={subItem.label}
                      onClick={(e) => handleSelectKey(e.keyPath[1])}
                    >
                      <Link
                        to={`/dashboard/${subItem.key}`}
                        className="block w-full text-center"
                      >
                        {subItem.label}
                      </Link>
                    </Menu.Item>
                  ))}
                </Menu.SubMenu>
              ) : (
                <Menu.Item
                  className="mb-6 block pb-6 pt-6"
                  key={item.key}
                  icon={item.icon}
                >
                  {/* <p class="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
  Thống kê
</p> */}
                  <Link
                    className={` menu-item block text-center text-base ${currentURI == item.key ? 'isSelected' : ''} `}
                    to={`/kol/${item.key}`}
                  >
                    {item.label}
                  </Link>
                </Menu.Item>
              )
            )}
          </Menu>
        </ConfigProvider>
      </Sider>
      <Layout>
        <Header
          style={{ background: colorBgContainer, boxSizing: 'border-box' }}
          className="mt-2"
        >
          <div
            style={{
              textAlign: 'center',

              position: 'relative'
            }}
            className="flex items-center justify-between px-4"
          >
            <div
              style={{
                // position: 'absolute',
                // left: '20px',
                textAlign: 'left',
                color: 'black',
                border: 'none',
                // borderRadius: '5px',
                // padding: '10px 12px',
                fontSize: '15px',
                lineHeight: '23px'
              }}
            >
              <span>
                Hi👋:{'  '} {`${userObject?.firstName} ${userObject?.lastName}`}
                {/* {user?.name} */}
              </span>
              <p>
                Role:{`${userObject?.role}`}
                {/* {getRole(user?.role)} */}
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <img
                src={cosmeLogo}
                alt=""
                style={{ maxWidth: '200px' }}
                // onClick={handleClick}
              />
              {/* <p style={{ maxWidth: '200px', marginBottom: '16px' }}>
                COMESTICS
              </p> */}
            </div>
            <div>
              <HomeOutlined
                type="primary"
                onClick={() => {
                  // helper.cookie_delete('AT');
                  // dispatch(logout());
                  navigate('/');
                }}
                style={{
                  // position: 'absolute',
                  // right: '30px',
                  // top: '15px',
                  backgroundColor: '#1677ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '6px 12px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  height: '35px',
                  lineHeight: '23px'
                }}
              />
            </div>
          </div>
        </Header>
        <Content
          style={{ margin: '0 16px', display: 'flex', flexDirection: 'column' }}
        >
          {/* <Breadcrumb>
              {location.pathname.split("/").map((path, index, paths) => {
                const url = paths.slice(0, index + 1).join("/");
                console.log(url);
                return (
                  <Breadcrumb.Item key={path}>
                    <span to={`/${url}`}>{path}</span>
                  </Breadcrumb.Item>
                );
              })}
            </Breadcrumb> */}
          <div
            style={{
              marginTop: 24,
              padding: '24px 48px',
              marginBottom: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Outlet style={{ flexGrow: 1, display: 'flex' }} />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
