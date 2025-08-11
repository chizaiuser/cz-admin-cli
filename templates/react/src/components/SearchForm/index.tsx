import React, { useState, useEffect, } from 'react';
import { Form, Input, Select, DatePicker, Button, Row, Col, Tree, Cascader } from 'antd';
import styled from 'styled-components';
import AppIcon from '../Icon';
// const { Option } = Select;
const { TreeNode } = Tree;
const AutoCol = styled(Col)`
    display: block;
    flex: 0 0 20%;
    max-width: 20%;
    .ant-col-4.8{
        display: block;
        flex: 0 0 20%;
        max-width: 20%;
    }
`
const StyledForm = styled(Form)`
    padding:0 20px 0 17px;
    .ant-form-item {
        margin-bottom: 0px;
    }
    .ant-input::placeholder{
        color:#8D949B;
        font-size:14px;
    }
    .ant-select-selection-placeholder{
        color:#8D949B;
        font-size:14px;
    }
    .ant-picker-input >input::placeholder{
        color:#8D949B;
        font-size:14px;
    }

  .ant-select, .ant-input, .ant-select-selector, .ant-picker {
    height: 36px;
    font-size: 16px;
    border-radius: 4px;
    border-color:#A9AFB5;
  }
    .ant-select-selector{
        border: 1px solid #A9AFB5 !important;
    }
  .ant-select-single .ant-select-selector {
    display: flex;
    align-items: center;
  }
    .ant-form-item-label{
        line-height:36px;
    }
  .ant-form-item-label > label {
    color: #333;
    font-size: 14px;
  }
    .ant-input{
        line-height: 40px;
    }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  .ant-btn {
    width: 106px;
    height: 36px;
    font-size: 16px;
    background: rgba(14,76,162,0.1);
    border-radius: 4px;
    border-color:transparent;
    font-weight: 550;
    color:#0E4CA2;
  }
    .i{
        font-weight: 550;
    }
    .ant-btn:hover {
        background: rgba(14,76,162,0.25) !important;
        border-color:transparent !important;
        color:#0E4CA2 !important;
    }
`;
export interface TreeDataProps {
    title: string;
    key: string;
    children?: {
        title: string;
        key: string;
        children?: any[];
    }[];
};
export interface TreeSelectProps {
    treeData: {
        title: string;
        key: string;
        children?: {
            title: string;
            key: string;
            children?: any[];
        }[];
    }[];
}

export const TreeSelect: React.FC<TreeSelectProps> = () => {
    const [treeData, setTreeData] = useState([]);
    const [value, setValue] = useState(undefined);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const onSelect = (selectedKeys: any, info: any) => {
        console.log('selected', selectedKeys, info);
        setValue(selectedKeys[0]); // 设置选中的值
        setDropdownVisible(false); // 关闭下拉菜单
    };
    
      // 展开/折叠节点时触发的事件
    const onExpand = (expandedKeys: any, info: any) => {
        console.log('expanded', expandedKeys, info);
    };
    const renderTreeNodes = (dataNode: any) => {
        return (
          <TreeNode title={dataNode.title} key={dataNode.key}>
            {dataNode.children &&
              dataNode.children.map((item: any) => renderTreeNodes(item))}
          </TreeNode>
        );
    };
    const dropdownRender = () => (
        <div>
          <Tree
            showLine
            defaultExpandAll
            onSelect={onSelect}
            onExpand={onExpand}
            treeData={treeData}
          >
            {treeData.map((item: any) => renderTreeNodes(item))}
          </Tree>
        </div>
    );
    // 递归转换数据
    const convertTreeData = (data: any[]) : any => {
        return data.map((item: any) => ({
            ...item,
            label: item.name,
            key: item.id,
            children: item.children ? convertTreeData(item.children) : [],
        }));
    };
    const deptInit = () => {
    }
    useEffect(() => {
        deptInit();
    }, [])
    return (
        <Select
            showSearch={false}
            value={value}
            style={{ width: '100%' }}
            popupRender={dropdownRender}
            onOpenChange={setDropdownVisible}
            open={dropdownVisible}
            placeholder="请选择"
        >
            {/* 这里可以放置一些默认的Select.Option，但在这个例子中我们用Tree替代了 */}
        </Select>
    );
}


export interface SearchFormItem {
  label: string;
  name: string;
  type: 'input' | 'select' | 'date' | 'area' | 'custom';
  options?: { label: string; value: string }[]; // for select
  placeholder?: string;
  rules?: any[];
  render?: () => React.ReactNode; // for custom
  colSpan?: number; // 1~6, 默认1
  labelCol?: { span: number; offset?: number }; // 标签的位置
  filterOption?: false
}

export interface SearchFormProps {
  items: SearchFormItem[];
  onFinish: (values: any) => void;
  onReset?: () => void;
  initialValues?: any;
  loading?: boolean;
  endSpan?: number; // 最后一列的span
  endOffset?: number; // 最后一列的offset
}

const SearchForm: React.FC<SearchFormProps> = ({
  items,
  onFinish,
  onReset,
  initialValues,
  loading,
  endSpan,
  endOffset,
}) => {
  const [form] = Form.useForm();
  const [renderItems, setRenderItems] = useState(items);
  const [originCompanyOptions, setOriginCompanyOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState<any[]>([]);
  // 默认一行6列
  const getColSpan = (item: SearchFormItem) => {
    if (item.colSpan) return item.colSpan;
    return 4.8;
  };

  const handleChange = (value: string, name: string, obj: any) => {
  }
  const init =  async () => {
  }

  useEffect(() => {
    init();
  }, [])

  

  

  
  
  const onSearch = (value: string, name: string) => {
  }

  const labelCol = { span: 8, offset: 0 };
  const filterOption = (inputValue: any, options: any) => {
    // options.value.includes(inputValue)
    return options.label.includes(inputValue);
  }
  return (
    <StyledForm
      form={form}
      onFinish={onFinish}
      initialValues={initialValues}
    >
      <Row gutter={32}>
        {renderItems.map((item) => (
          <AutoCol span={getColSpan(item)} key={item.name} style={{marginBottom:16, paddingLeft: 0, paddingRight: 0 }}>
            <Form.Item
              label={item.label}
              name={item.name}
              rules={item.rules}
              labelCol={item.labelCol || labelCol}
            >
              {item.type === 'input' && (
                <Input placeholder={item.placeholder || `请输入${item.label}`} />
              )}
              {item.type === 'select' && (
                <Select showSearch placeholder={item.placeholder || `请选择${item.label}`} filterOption={item.name === 'manufacturer' ? false : filterOption} onChange={(value) => handleChange(value, item.name, item)}
                    onSearch={(value) => onSearch(value, item.name)}
                    options={item.options}    
                >
                  {/* {item.options?.map((opt) => (
                    <Option value={opt.value} key={opt.value}>
                      {opt.label}
                    </Option>
                  ))} */}
                </Select>
              )}
              {
                item.type === 'area' && (
                  <Cascader 
                    options={areaOptions}
                    placeholder={item.placeholder || `请选择${item.label}`}
                  />
                )
              }
              {item.type === 'date' && (
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder={item.placeholder || `请选择${item.label}`}
                  value-format="YYYY-MM-DD"
                />
              )}
              {item.type === 'custom' && item.render && item.render()}
            </Form.Item>
          </AutoCol>
        ))}
        <Col span={endSpan || 4} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', marginBottom: 16 }}>
          <ButtonGroup style={{ position:'relative', transform: `translateX(${endOffset || 0}px)`}}>
            <Button htmlType="submit" loading={loading}>
               <AppIcon name='shaixuan' size={16}/>  筛选
            </Button>
            <Button onClick={() => { form.resetFields(); onReset?.(); }}>
            <AppIcon name='reset' size={16}/>  重置
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
    </StyledForm>
  );
};

export default SearchForm;