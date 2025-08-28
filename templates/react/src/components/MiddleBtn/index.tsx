import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Button, Input, Select, TreeSelect } from 'antd';
import styled from 'styled-components';
import AppIcon from '../Icon/index';
import Auth from '../Auth/index';
import ExcelJS from 'exceljs';
const MiddleBtnWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;
const PartLeft = styled.div`
    display: flex;
    align-items: center;
`;
const PartRight = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
`;

export const CustomStatus = styled.div<{type: string}>`
    text-align: center;
    color: ${props => props.type === 'success'? '#07CB5F' : props.type === 'danger'? '#FB0000' : '#FEEFEF'};
`;

export const CustomTreeSelect = styled(TreeSelect)`
    .ant-select-selector{
        background: #F6F7F7 !important;
        border:none !important;
        border-radius: 0px !important;
        box-shadow: none !important;
    }
    .ant-select-selector:hover {
        background-color: #F6F7F7 !important;
        border: none !important;
        outline: none !important;
    }
    .ant-select-selector:focus-within {
        background-color: #F6F7F7 !important;
        border: none !important;
        outline: none !important;
    }
    .ant-select-selector:focus {
        box-shadow: none !important;
        background-color: #F6F7F7 !important;
        border: none !important;
        outline: none !important;
    }
    .ant-select-selection-placeholder{
        color: #80878E;
    }
`;
export const CustomSelect = styled(Select)`
    .ant-select-selection-placeholder{
        color: #80878E;
    }
    .ant-select-selector{
        background: #F6F7F7 !important;
        border:none !important;
        border-radius: 0px !important;
        box-shadow: none !important;
    }
    .ant-select-selector:hover {
        background-color: #F6F7F7 !important;
        border: none !important;
        outline: none !important;
    }
    .ant-select-selector:focus-within {
        background-color: #F6F7F7 !important;
        border: none !important;
        outline: none !important;
    }
    .ant-select-selector:focus {
        box-shadow: none !important;
        background-color: #F6F7F7 !important;
        border: none !important;
        outline: none !important;
    }
`;
export const CustomInput = styled(Input)`
    background: #F6F7F7 !important;
    border:none !important;
    border-radius: 0px !important;
    .ant-input-disabled{
        background: #F6F7F7 !important;
    }
    &::placeholder{
        color: #80878E;
    }
    &:hover {
        background-color: #F6F7F7 !important;
        border: none !important;
        outline: none !important;
    }
    &:focus-within {
        background-color: #F6F7F7 !important;
        border: none !important;
        outline: none !important;
    }
    &:focus {
        box-shadow: none !important;
        background-color: #F6F7F7 !important;
        border: none !important;
        outline: none !important;
    }
`;

export const PrimaryBtn = styled(Button)`
    background-color: #0E4CA2;
    height: 36px;
    color: #fff;
    min-width: 120px;
    
    border:none !important;
    &:hover {
        background-color: #0A3C81 !important;
        color: #fff !important;
    }
    &:focus {
        outline: none !important; /* 如果是焦点边框，取消默认的outline */
        border: none !important;   /* 确保边框为none */
    }
`;
export const NormalBtn = styled(Button)`
    border: 1px solid #0E4CA2;
    background-color: #fff;
    height: 36px;
    color: #0E4CA2;
    &:hover {
        background-color: #0A3C81 !important;
        color: #fff !important;
    }
    &:focus {
        outline: none !important; /* 如果是焦点边框，取消默认的outline */
        border:1px solid #0E4CA2 !important;   /* 确保边框为none */
    }
`;
export const DangerBtn = styled(Button)`
    border: 1px solid #E61E1E;
    background-color: #fff;
    height: 36px;
    color: #E61E1E;
    &:hover {
        background-color: #E61E1E !important;
        color: #fff !important;
        outline: none !important; /* 如果是焦点边框，取消默认的outline */
        border:1px solid #E61E1E !important;   /* 确保边框为none */
    }
    &:focus {
        outline: none !important; /* 如果是焦点边框，取消默认的outline */
        border:1px solid #E61E1E !important;   /* 确保边框为none */
    }
`;
export interface IMiddleBtnProps {
    leftBtn: {
        name: string,
        type: string,
        icon?: string,
        isExport?: boolean,
        dataSource?: any,
        code?: string,
        columns?: any,
        onClick?: () => void
    }[],
    selectCount: number,
    totalCount: number,
    isChoiced?: boolean,
    hideCount?: boolean,
    rightBtn?: {
        name: string,
        type: string,
        icon?: string,
        code?: string,
        onClick?: () => void
    }[],
}

// 将图片URL转换为base64
const urlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting URL to base64:', error);
    return '';
  }
};

// 获取文件扩展名
const getFileExtension = (url: string): string => {
  const match = url.match(/\.([^.]+)(?:\?|$)/);
  return match ? match[1].toLowerCase() : 'png';
};

export const exportExcelWithImages = async (
  dataSource: any[], 
  columns: any[], 
  name: string,
  imageConfig?: {
    columnIndex: number; // 图片所在列的索引
    imageUrls: string[]; // 图片URL数组，与数据行对应
    width?: number; // 图片宽度
    height?: number; // 图片高度
    defaultTitle?: string; // 图片列的默认标题
  }
) => {
  try {
    // 创建一个新的工作簿
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // 设置表头 - 处理空标题
    const headerTitles = columns.map((col: any, index: number) => {
      // 如果是图片列且标题为空，使用自定义默认标题或智能推断
      if (index === imageConfig?.columnIndex && (!col.title || col.title.trim() === '')) {
        return imageConfig.defaultTitle || '图片';
      }
      
      // 如果标题为空，根据列索引或dataIndex提供默认标题
      if (!col.title || col.title.trim() === '') {
        if (col.dataIndex === 'avatar' || col.dataIndex === 'image') return '图片';
        if (col.dataIndex === 'preview') return '预览';
        if (col.dataIndex === 'thumbnail') return '缩略图';
        if (col.dataIndex === 'photo') return '照片';
        return '图片'; // 默认标题
      }
      return col.title;
    });
    
    const headerRow = worksheet.addRow(headerTitles);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // 添加数据行
    for (let rowIndex = 0; rowIndex < dataSource.length; rowIndex++) {
      const row = dataSource[rowIndex];
      const rowValues = columns.map((col: any) => row[col.dataIndex]);
      const dataRow = worksheet.addRow(rowValues);
      
      // 如果有图片配置，处理图片
      if (imageConfig && imageConfig.imageUrls[rowIndex]) {
        const imageUrl = imageConfig.imageUrls[rowIndex];
        if (imageUrl) {
          try {
            // 转换图片URL为base64
            const base64 = await urlToBase64(imageUrl);
            if (base64) {
              // 移除base64前缀，只保留数据部分
              const base64Data = base64.split(',')[1];
              const extension = getFileExtension(imageUrl);
              
              // 添加图片到工作簿
              const imageId = workbook.addImage({
                base64: base64Data,
                extension: extension as 'png' | 'jpeg' | 'gif',
              });

              // 设置行高以适应图片
              const targetHeight = imageConfig.height || 80;
              dataRow.height = targetHeight;

              // 添加图片到指定列
              worksheet.addImage(imageId, {
                tl: { col: imageConfig.columnIndex, row: rowIndex + 1 }, // +1 因为有表头
                ext: { 
                  width: imageConfig.width || 80, 
                  height: targetHeight 
                },
              });
            }
          } catch (error) {
            console.error(`Error processing image at row ${rowIndex}:`, error);
          }
        }
      }
    }

    // 自动调整列宽
    columns.forEach((col: any, index: number) => {
      const column = worksheet.getColumn(index + 1);
      if (col.width) {
        column.width = col.width / 7; // 转换像素到Excel列宽
      } else {
        column.width = 15; // 默认列宽
      }
    });

    // 写入文件并保存
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${name}报表.xlsx`);
  } catch (error) {
    console.error('Error exporting Excel with images:', error);
  }
};

export const exportExcel1 = (dataSource: any, columns: any, name: string, imageUrls: string[]) => {
    // 创建一个新的工作簿
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
  
    // 生成表头
    worksheet.addRow(columns.map((col: any) => col.title));
  
    // 添加图片到工作表
    
    imageUrls.forEach((imageUrl, index) => {
      worksheet.getRow(index + 2).height = 100; // 设置行高以适应图片
        const imageId = workbook.addImage({
            base64: imageUrl,
            extension: 'png', // 或者 'jpg'，根据图片格式
        });
        worksheet.addImage(imageId, {
            tl: { col: 0, row: index + 2 },
            ext: { width: 100, height: 100 },
        });
    });
  
    // 添加数据行
    dataSource.forEach((row: any) => {
      const rowValues = columns.map((col: any) => row[col.dataIndex]);
      worksheet.addRow(rowValues);
    });
  
    // 写入文件并保存
    workbook.xlsx.writeBuffer().then(buffer => {
      saveAs(new Blob([buffer]), `${name}报表.xlsx`);
    }).catch(error => {
      console.error('Error exporting Excel:', error);
    });
};

export const exportExcel = (dataSource: any,columns:any, name:string) => {
    // 1. 生成表头和数据
    const header = columns.map((col: any) => col.title);
    const data = dataSource.map((row:any) => columns.map((col: any) => row[col.dataIndex]));
  
    // 2. 组装 sheet 数据
    const sheetData = [header, ...data];
  
    // 3. 创建 worksheet 和 workbook
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
    // 4. 导出
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `${name}报表.xlsx`);
}


const MiddleBtn: React.FC<IMiddleBtnProps> = ({
    leftBtn,
    selectCount,
    totalCount,
    rightBtn,
    hideCount = false,
    isChoiced = false
}) => {
    const [activeBtn, setActiveBtn] = useState<string | null>(null);
    const onRightClick = (event: any, item: any) => {
        event.stopPropagation();
        item.onClick && item.onClick();
        setActiveBtn(item.name);
    }
    return(
        <MiddleBtnWrapper>
            <PartLeft>
                {
                    leftBtn.map((btn) => {
                        if (btn.type === 'primary') {
                            return (
                                <Auth code={btn.code || null} key={btn.name}>
                                    <PrimaryBtn style={{marginRight: '20px'}} key={btn.name}
                                        onClick={btn.onClick}
                                    >
                                        {btn.icon && <AppIcon name={btn.icon} size={14}/>}
                                        {btn.name}</PrimaryBtn>
                                </Auth>
                                
                            )
                        }
                        return (
                            <Auth code={btn.code || null} key={btn.name}>
                                <NormalBtn key={btn.name} style={{marginRight: '20px'}} onClick={btn.onClick}>{btn.name}</NormalBtn>
                            </Auth>
                        )
                    })

                }
                {!hideCount && (<span style={{color: '#8D949B', marginLeft: '10px'}}>已选择{selectCount}条，共{totalCount}条</span>)}
                
            </PartLeft>
            <PartRight>
                {rightBtn &&
                    rightBtn.map((btn) => {
                        const isActive = isChoiced ? activeBtn === btn.name : false;
                        return (
                            <Auth code={btn.code} key={btn.name}>
                                <NormalBtn 
                                    style={{
                                        marginLeft: '10px',
                                        background: isActive ? '#0E4CA2' : '#fff',
                                        color: isActive ? '#fff' : '#0E4CA2',
                                        border: isActive ? 'none' : '1px solid #0E4CA2'
                                    }} key={btn.name} onClick={(e) => onRightClick(e, btn)}>{btn.icon && <AppIcon name={btn.icon} size={14} />} {btn.name}</NormalBtn>
                            </Auth>
                            
                        )
                    })
                }
            </PartRight>
        </MiddleBtnWrapper>
    );
};

export default MiddleBtn;

/*
使用示例：

// 1. 基本用法 - 导出带图片的Excel
const handleExportWithImages = async () => {
  const imageConfig = {
    columnIndex: 2, // 图片放在第3列（索引从0开始）
    imageUrls: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.png',
      'https://example.com/image3.gif'
    ],
    width: 100,
    height: 80,
    defaultTitle: '头像' // 自定义图片列标题
  };
  
  await exportExcelWithImages(dataSource, columns, '用户列表', imageConfig);
};

// 2. 在表格组件中使用
const columns = [
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '年龄', dataIndex: 'age', key: 'age' },
  { title: '头像', dataIndex: 'avatar', key: 'avatar' }, // 图片列
  { title: '部门', dataIndex: 'department', key: 'department' }
];

const dataSource = [
  { id: 1, name: '张三', age: 25, avatar: 'https://example.com/avatar1.jpg', department: '技术部' },
  { id: 2, name: '李四', age: 30, avatar: 'https://example.com/avatar2.png', department: '产品部' }
];

// 导出时指定图片配置
const exportData = async () => {
  const imageUrls = dataSource.map(item => item.avatar);
  await exportExcelWithImages(dataSource, columns, '员工信息', {
    columnIndex: 2, // 头像列
    imageUrls: imageUrls,
    width: 60,
    height: 60,
    defaultTitle: '头像' // 图片列标题
  });
};

// 3. 在按钮点击事件中使用
<Button onClick={exportData}>导出Excel（含图片）</Button>
*/