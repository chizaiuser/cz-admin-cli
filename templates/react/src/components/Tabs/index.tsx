import React from'react';
import { Tabs } from 'antd';
import styled from 'styled-components';
const DivContent = styled.div`
    padding:0 20px;
`;
const StyledTabs = styled(Tabs)`
  .ant-tabs-tab{
    color: #8D949B;
    font-weight: 550;
    font-size: 16px;
  }
   .ant-tabs-tab-active .ant-tabs-tab-btn{
    color: #0E4CA2 !important;
  }
    .ant-tabs-ink-bar{
        background: #0E4CA2 !important;
    }
`;

interface ITabs {
    tabs: {
        key: string;  // 将 'keys' 修改为 'key'
        label: string;  // 将 'title' 修改为 'label'
    }[];
    activeKey: string,
    onTabClick: (key: string) => void;
}
const PagesTabs: React.FC<ITabs> = ({tabs, onTabClick, activeKey}) => {
    return (
        <DivContent>
            <StyledTabs items={tabs} onTabClick={onTabClick} activeKey={activeKey}></StyledTabs>
        </DivContent>
    )
};

export default PagesTabs;