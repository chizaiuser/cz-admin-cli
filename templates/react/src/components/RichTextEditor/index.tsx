import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // 引入quill的样式
import styled from 'styled-components';

const EditorWrapper = styled.div`
  .ql-toolbar {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border-color: #d9d9d9;
    background: #fafafa;
  }
  .ql-container {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    border-color: #d9d9d9;
    min-height: 300px;
    font-size: 14px;
  }
  .ql-editor {
    min-height: 300px;
  }
  .ql-editor.ql-blank::before {
      font-style: normal;
      color: #bfbfbf;
  }
`;

// 定义工具栏模块 (可按需增删"插件")
const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'align': [] }],
    ['link', 'image'],
    ['clean']
  ],
};

// 定义支持的格式
const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'indent', 'link', 'image', 'align'
];

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  return (
    <EditorWrapper>
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || '请输入内容...'}
      />
    </EditorWrapper>
  );
};

export default RichTextEditor; 