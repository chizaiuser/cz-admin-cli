import React from 'react';
import { Modal } from 'antd';
import styled from 'styled-components';
import { PrimaryBtn, NormalBtn, DangerBtn } from '../MiddleBtn/index';
import Auth from '../Auth/index';
const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 0px;
    padding: 0;
  }
  .ant-modal-header {
    border-radius: 8px 8px 0 0;
    padding: 15px 20px 12px 20px;
    border-bottom: none;
    position: relative;
  }
    .ant-modal-header::before {
      content: "";
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% - 40px);
      height: 1px;
      background-color: #A9AFB5;
    }
  .ant-modal-title {
    font-size: 18px;
    font-weight: bold;
    color: #1763B5;
  }
  .ant-modal-close {
    top: 15px;
    right: 20px;
  }
  .ant-modal-body {
    padding: 19px 45px 0 45px;
  }
  .ant-modal-footer {
    display: flex;
    justify-content: center;
    gap: 50px;
    border-top: none;
    padding-bottom: 32px;
    padding-top: 24px;
  }
`;

interface CustomModalProps {
  open: boolean;
  title: string;
  width?: number | string;
  okCode?: string,
  cancelCode?: string,
  onCancel: () => void;
  onCustomCancel?: () => void;
  onOk?: () => void;
  okText?: string;
  cancelText?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  confirmLoading?: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
  open,
  title,
  width = 500,
  onCancel,
  onCustomCancel,
  onOk,
  okText = '保存',
  cancelText = '取消',
  children,
  footer,
  okCode = null,
  cancelCode = null,
  confirmLoading,
}) => {
  return (
    <StyledModal
      open={open}
      title={title}
      width={width}
      onCancel={onCancel}
      onOk={onOk}
      footer={
        (footer === 'normal' ? <>
          <Auth code={okCode}>
            <PrimaryBtn type="primary" onClick={onOk} loading={confirmLoading} style={{ width: 110, minWidth: 110 }}>
              {okText}
            </PrimaryBtn>
          </Auth>
            <Auth code={cancelCode}>
              <NormalBtn onClick={onCustomCancel ||onCancel} style={{ width: 110 }}>
                {cancelText}
              </NormalBtn>
            </Auth>
            
          </> : footer === 'reject' ? 
           <>
           <Auth code={okCode}>
            <PrimaryBtn type="primary" onClick={onOk} loading={confirmLoading} style={{ width: 110, minWidth: 110 }}>
              {okText}
            </PrimaryBtn>
           </Auth>
           <Auth code={cancelCode}>
            <DangerBtn onClick={onCustomCancel || onCancel} style={{ width: 110 }}>
              {cancelText}
            </DangerBtn>
           </Auth>
           
         </>
          : !footer ? null : footer)
        // footer !== undefined ? (
        //   footer
        // ) : (
        //   <>
        //     <PrimaryBtn type="primary" onClick={onOk} loading={confirmLoading} style={{ width: 120 }}>
        //       {okText}
        //     </PrimaryBtn>
        //     <NormalBtn onClick={onCancel} style={{ width: 120 }}>
        //       {cancelText}
        //     </NormalBtn>
        //   </>
        // )
      }
      centered
      destroyOnClose
      maskClosable={false}
    >
      {children}
    </StyledModal>
  );
};

export default CustomModal;