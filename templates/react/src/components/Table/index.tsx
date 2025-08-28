import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import styled from 'styled-components';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];
export interface CommonTableRef {
    clearSelectKeys: () => void;
}
interface DataType {
    key: React.ReactNode;
    name: string;
    age: number;
    address: string;
    children?: DataType[];
}
const StyledTable = styled(Table)<{ height?: string | number }>`
    .ant-table-body{
        height: ${props => props.height};
    }
    .ant-table-body::-webkit-scrollbar,
.ant-table-content::-webkit-scrollbar,
.ant-table-body-inner::-webkit-scrollbar {
  width: 6px;
  height: 3px;
  background: #1E2B31;
}
.ant-table-body::-webkit-scrollbar-thumb,
.ant-table-content::-webkit-scrollbar-thumb,
.ant-table-body-inner::-webkit-scrollbar-thumb {
  background: #A3B7CC;
  border-radius: 5px;
}
  .ant-table-thead > tr > th {
    background: #DFEAF9;
    font-weight: bold;
    color: #0E4CA2;
    border-bottom: 1px solid #E6EAF0;
    text-align: center;
    border-inline-end: 1px solid  transparent !important;
  }
  .ant-table-tbody > tr > td {
    text-align: center;
    border-bottom: 1px solid #E6EAF0;
    color: #333;
    border-inline-end: 1px solid  transparent !important;
    padding: 15px 10px;
    }
  .ant-table-tbody > tr > td .ant-checkbox-inner {
    border-radius: 2px;
  }
  .ant-table-tbody > tr > td .ant-checkbox-checked .ant-checkbox-inner {
    background: #1763B5;
    border-color: #1763B5;
  }
  .ant-table-tbody .ant-table-placeholder{
    height: 450px;
  }
    .ant-table-tbody .ant-table-placeholder .ant-table-cell{
      border-bottom: none;
    }
  .ant-table-tbody > tr > td .ant-checkbox-checked .ant-checkbox-inner::after {
    border-color: #fff;
  }
  .ant-table-tbody > tr > td .ant-checkbox-wrapper {
    margin: 0;
  }
  .ant-table-pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
  }
  .ant-pagination-item-active {
    background: #1763B5;
    border-color: #1763B5;
  }
  .ant-pagination-item-active a {
    color: #fff !important;
  }
  .ant-pagination-item a {
    color: #1763B5;
  }
`;

const ActionLink = styled.a`
  color: #1763B5;
  margin-right: 12px;
  cursor: pointer;
  &:last-child {
    margin-right: 0;
  }
`;

export const OptionBtn = styled.a<{ autotype?: string }>`
    --ant-color-link:${props =>props.autotype === 'normal' ? '#4b96ff' : props.autotype === 'danger' ? '#e61e1e' :'#2ad382'};
    --ant-color-link-hover:${props =>props.autotype === 'normal' ? '#0e4ca2' : props.autotype === 'danger' ? '#820909' :'#11a35d'};
    color: var(--ant-color-link);
    margin-right: 12px;
    &:hover {
        color: var(--ant-color-link-hover);
    }
`;
function uniqueArrayByKey(array: { key: string, value: number, targetCount?: number, algorithmType?: string | number }[], key: string): { key: string, value: number, targetCount?: number, algorithmType?: string | number }[] {
    const seen = new Set();
    return array.filter((item: any) => {
        const keyValue = item[key];
        if (seen.has(keyValue)) {
            return false;
        } else {
            seen.add(keyValue);
            return true;
        }
    });
}
export interface CommonTableProps {
  columns: any[];
  dataSource: any[];
  rowKey?: string;
  pagination?: any;
  loading?: boolean;
  height?: string | number;
  updateSelectKey?: (key: React.Key[]) => void;
  updateSelectRowKey?: (key: any[]) => void;
  onChange?: (pagination: any, filters: any, sorter: any) => void;
}

const CommonTable = forwardRef<CommonTableRef, CommonTableProps>(({
  columns,
  dataSource,
  rowKey = 'id',
  pagination,
  loading,
  height,
  onChange,
  updateSelectKey,
  updateSelectRowKey
}, ref) => {
    // const [checkStrictly, setCheckStrictly] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [allCheckListMap, setAllCheckListMap] = useState<any>([]);
    const rowSelection: TableRowSelection<DataType> = {
        onSelect: (record:any, selected, selectedRows) => {
          console.log(record, selected, selectedRows, '选择行的信息');
            if (selected) {
                const newList = allCheckListMap.concat([record]);
                const noReapeatList =uniqueArrayByKey(newList, rowKey);
                const rowList = noReapeatList.map((item:any) => item[rowKey]);
                console.log(rowList, noReapeatList, '选择行的key');
                setSelectedRowKeys(rowList)
                setAllCheckListMap(noReapeatList);
            } else {
                const filterNow = allCheckListMap.filter((item:any) => item[rowKey]!== record[rowKey]);
                setAllCheckListMap(filterNow);
                setSelectedRowKeys(filterNow.map((item:any) => item[rowKey]))
            }
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            if (selected) {
                const newList = allCheckListMap.concat(dataSource);
                const noReapeatList =uniqueArrayByKey(newList, rowKey);
                const rowList = noReapeatList.map((item:any) => item[rowKey]);
                setSelectedRowKeys(rowList)
                setAllCheckListMap(noReapeatList);
            } else {
                const filterNow = allCheckListMap.filter((item:any) => !dataSource.some((item2:any) => item2[rowKey] === item[rowKey]));
                setSelectedRowKeys(filterNow.map((item:any) => item[rowKey]))
                setAllCheckListMap(filterNow);
            }
          console.log(selected, selectedRows, changeRows, '选择所有行的信息');
        },
    };
    const clearSelectKeys = () => {
        setSelectedRowKeys([]);
        setAllCheckListMap([]);
    }
    useImperativeHandle(ref, () => ({
        clearSelectKeys,
        // 还可以暴露更多方法
    }));
    useEffect(() => {
        updateSelectKey && updateSelectKey(selectedRowKeys);
    }, [selectedRowKeys])

    useEffect(() => {
      updateSelectRowKey && updateSelectRowKey(allCheckListMap);
    }, [allCheckListMap])
    const customRowSelection = {
        ...rowSelection,
        selectedRowKeys,
        checkStrictly: true as boolean,
        onChange: (newSelectedRowKeys: React.Key[], selectedRows: unknown[], info: { type: any; }) => {
          console.log(newSelectedRowKeys, selectedRows, info, '更改单个行');
            // 这里你可以断言 selectedRows 的类型为 DataType[]
            // setSelectedRowKeys(newSelectedRowKeys);
            // updateSelectKey && updateSelectKey(newSelectedRowKeys);
            // console.log(selectedRowKeys, selectedRows as DataType[], info, '更改全部分页');
            // if(info.type === 'single') {
            //     const rowKeys = rowKey || 'id';
            //     const newList = allCheckListMap.concat(selectedRows);
            //     if (selectedRows.some((item) => item[rowKeys] === row[rowKeys])) {
            //         allCheckListMap.value = uniqueArrayByKey(newList, rowKeys);
            //     } else {
            //         const filterNow = allCheckListMap.value.filter((item) => item[rowKeys]!== row[rowKeys])
            //         const repeatList = filterNow.concat(val);
            //         allCheckListMap.value = uniqueArrayByKey(repeatList, rowKeys);
            //     }
            // }
        },
    } as TableRowSelection<any>;
  return (
    <StyledTable
        rowSelection={customRowSelection}
        height={height}
        columns={columns}
        dataSource={dataSource}
        rowKey={rowKey}
        pagination={{
          ...pagination,
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        loading={loading}
        onChange={onChange}
        scroll={{ y: height }}
        bordered={false}
    />
  );
});

export default CommonTable;
export { ActionLink };