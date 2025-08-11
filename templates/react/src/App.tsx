import { useEffect, useState } from 'react';
import { Layout, Menu, ConfigProvider } from 'antd';
import { AuthProvider } from './components/Auth/AuthProvider';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

import zhCN from 'antd/es/locale/zh_CN';
import TopBar from './components/TopBar';
import styled from 'styled-components';
import leftBarBg from './assets/images/left_bar_bg.png';
import AppIcon from './components/Icon/index';
import { menuQueryMenu } from './api/member/role';
const { Sider, Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const ContentLayout = styled(Layout)`
  height: calc(100vh - 74px);
`;
const StyledSider = styled(Sider)`
  position: fixed;
  left: 0;
  top: 74px; // 顶部导航栏的高度
  bottom: 0;
  overflow: auto;
  width: 240px !important;
  min-width: 240px !important;
  max-width: 240px !important;
  
`;
const LeftBarImg = styled.img`
  width:100%;
  height:189px;
  position:absolute;
  left:0;
  bottom:0;
`
const RightContent = styled.div`
  margin-top: 74px;
  margin-left: 240px;
  width:calc(100vw - 240px);
  background: #F4F8FD;
  min-height: calc(100vh - 74px); // 减去顶部导航栏的高度
`
const StyledContent = styled(Content)`
  padding: 20px 16px 20px 16px;
  overflow-y: auto;
  height: calc(100vh - 74px);
`;

const CustomMenu = styled(Menu)`
  box-sizing: border-box;
  padding-top:10px;
  &.ant-menu {
    background: #fff;
  }
  .ant-menu-item{
    margin-inline:0;
    width:100%;
    font-size:16px;
    border-radius:0;
    position:relative;
    height:70px;
    line-height:70px;
    margin-block:0px;
  }
  .ant-menu-item .ant-menu-title-content{
    color: #8D949B;
  }
  .ant-menu-item .iconfont{
    margin-right:15px;
    color: #8D949B;
  }
  .ant-menu-item-selected {
    background: #DFEAF9 !important;
    color: #0E4CA2 !important;
    position: relative;
    font-weight: bold;
    font-size:16px;
  }
  .ant-menu-item-selected .ant-menu-title-content{
    color: #0E4CA2 !important;
  }
  .ant-menu-item-selected .iconfont{
    color: #0E4CA2 !important;
  }
  .ant-menu-item-selected .ant-menu-item-icon,
  .ant-menu-item-selected svg {
    color: #0E4CA2 !important;
    fill: #0E4CA2 !important;
  }
  .ant-menu-item-selected::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 5px;
    height: 100%;
    background: #0E4CA2;
    z-index: 1;
  }
  .ant-menu-item {
    color: #333;
    font-weight: 500;
  }
  .ant-menu-item .ant-menu-item-icon,
  .ant-menu-item svg {
    color: #333;
    fill: #333;
  }
`;

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const [tabs, setTabs] = useState([
  //   { key: '/dashboard', label: '数据预览', closable: false },
  //   { key: '/users', label: '首页', closable: false },
  //   // 可扩展更多标签
  // ]);
  
  // const selectedKeys = [location.pathname.startsWith('/') ? location.pathname.slice(1) : location.pathname];
  const menuItems = [
    {
      key: 'dashboard',
      icon: <AppIcon name="shuju9" size={22} />,
      label: '数据概览',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: 'approve',
      icon: <AppIcon name="shenhe" size={22} />,
      label: '办事审核',
      onClick: () => navigate('/approve'),
    },
    {
      key: 'aircraft',
      icon: <AppIcon name="feihangqibeian-01" size={22} />,
      label: '飞行器备案',
      onClick: () => navigate('/aircraft'),
    },
    {
      key: 'airline',
      icon: <AppIcon name="hangxianbeian-01" size={22} />,
      label: '航线备案',
      onClick: () => navigate('/airline'),
    },
    {
      key: 'user',
      icon: <AppIcon name="yonghu" size={22} />,
      label: '用户管理',
      onClick: () => navigate('/user'),
    },
    {
      key: 'analyize',
      icon: <AppIcon name="shujufenxi" size={22} />,
      label: '数据分析',
      onClick: () => navigate('/analyize'),
    },
    {
      key: 'team',
      icon: <AppIcon name="tuandui" size={22} />,
      label: '团队管理',
      onClick: () => navigate('/team'),
    },
    {
      key: 'notice',
      icon: <AppIcon name="yijin06-jifenzhengce" size={22} />,
      label: '政策通知',
      onClick: () => navigate('/notice'),
    },{
      key: 'setting',
      icon: <AppIcon name="xitongshezhi_fill" size={22} />,
      label: '系统设置',
      onClick: () => navigate('/setting'),
    },
  ];
  const [targetMenu, setTargetMenu] = useState<any>(menuItems);
  const selectedKey = menuItems.find(item =>
    location.pathname.startsWith(`/${item.key}`)
  )?.key;

  useEffect(() => {
    menuQueryMenu().then(res => {
      console.log(res, '菜单数据')
      localStorage.setItem('authList', JSON.stringify(res.data));
      const list = menuItems.filter((item) => res.data.some((v: any) => v.path === `/${item.key}`));
      setTargetMenu(list);
    }); 
  }, []);

  return (
    <ConfigProvider locale={zhCN}>
      <AuthProvider>
        <StyledLayout>
          <TopBar />
          <ContentLayout>
            <StyledSider theme="light">
              <CustomMenu
                mode="inline"
                selectedKeys={selectedKey ? [selectedKey] : []}
                items={targetMenu}
                style={{ height: '100%', borderRight: 0 }}
              />
              <LeftBarImg src={leftBarBg} />
            </StyledSider>
            <RightContent>
              <StyledContent>
                <Outlet />
              </StyledContent>
            </RightContent>
            
          </ContentLayout>
        </StyledLayout>
      </AuthProvider>
      
    </ConfigProvider>
    
  );
};

export default App;
