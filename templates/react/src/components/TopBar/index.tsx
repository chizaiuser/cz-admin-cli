import { Layout, Dropdown, Space, Typography } from 'antd';
import { LogoutOutlined, DownOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useNavigate } from'react-router-dom';
import styled from 'styled-components';
import topBg from '../../assets/images/top_bg.png';
import topBannerIcon from '../../assets/images/top_banner_icon.png';
import userAvatarImg from '../../assets/images/user_avatar.png';
import { getConfig } from '../../api/setting/name';

const { Header } = Layout;
const { Text } = Typography;

const StyledHeader = styled(Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  background: url(${topBg}) no-repeat center center;
  background-size: cover;
  height: 74px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  &>img{
    width: 40px;
    height: 40px;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 43px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right:43px;
`;

const WeatherTime = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 12px;
  line-height: 20px;
  color: rgba(255, 255, 255, 0.85);
  padding-right:40px;
  border-right:1px solid rgba(255, 255, 255, 0.5);
`;
const StyledText1 = styled(Text)`
  color: #fff;
`;
const StyledText = styled.span`
  color: #fff;
  font-family: 'Weiruanyahei';
`;

const UserAvatar = styled.img`
    width: 43px;
    height: 43px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const TopBar = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('公安民用驾驶航空器备案管理平台');
  const [logoUrl, setLogoUrl] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    getConfig({}).then((res) => {
      const data = res.data;
      setTitle(data.title);
      setLogoUrl(data.logoUrl);
      console.log(res, '更新数据');
    })

    return () => clearInterval(timer);
  }, []);

  const userMenuItems = [
    {
      key: '3',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatDateTime = (date: Date) => {
    const dateStr = formatDate(date);
    const timeStr = formatTime(date);
    return `${dateStr} ${timeStr}`;
  };

  return (
    <StyledHeader>
      <LeftSection>
        <img src={logoUrl ||topBannerIcon} alt="" />
        <StyledText style={{ fontSize: '30px' }}>
          {title}
        </StyledText>
      </LeftSection>

      <RightSection>
        <WeatherTime>
          <div>{formatDateTime(currentTime)}</div>
        </WeatherTime>

        <Dropdown
          menu={{
            items: userMenuItems,
            onClick: () => {
              localStorage.removeItem('token');
              localStorage.removeItem('refresh_token');
              localStorage.removeItem('username');
              navigate('/login');
            },
          }}
          placement="bottomRight"
        >
          <Space style={{ cursor: 'pointer' }}>
            <UserAvatar src={userAvatarImg} />
            <UserInfo>
              <StyledText1 strong>管理员</StyledText1>
            </UserInfo>
            <DownOutlined style={{ color: '#fff', fontSize: '12px' }} />
          </Space>
        </Dropdown>
      </RightSection>
    </StyledHeader>
  );
};

export default TopBar;
