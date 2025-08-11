import React from "react";
import { Upload, Button } from "antd";
import { ButtonGroup } from '../SearchForm/index';
import AppIcon from '../Icon/index';

interface UploadFileProps {
    value?: any[],
    action?: string,
    onChange?: (val: any) => void,
    beforeUpload?: (file: any) => void,
    multiple?: boolean,
    accept?: string
}

const UploadFile: React.FC<UploadFileProps> = ({
    value = [],
    onChange,
    beforeUpload,
    action,
    multiple,
    accept = ".pdf,.doc,.docx,image/*"
}) => {
    const handleChange = (info: any) => {
        if (multiple) {
            onChange && onChange(info.fileList);
        } else {
            onChange && onChange([info.file]);
        }
    }
    return (
        <Upload
            action={action || '/admin/attachment/uploadFile'}
            fileList={value}
            multiple={multiple}
            accept={accept}
            beforeUpload={beforeUpload}
            onChange={handleChange}
        >
            <ButtonGroup>
                <Button> 
                    <AppIcon name="shangchuanwenjian" size={16} color="#0E4CA2"></AppIcon>
                    上传文件</Button>
            </ButtonGroup>
        </Upload>
    )
};

export default UploadFile;