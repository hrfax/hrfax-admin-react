/* eslint-disable react/sort-comp */
import React from 'react';
import { Upload, Button, Spin,message } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
import { fetchFile } from '@/utils';

const styles = require('./index.less');

type imgProps = {
  uid: number | string;
  id: number | string;
  url: string;
  name: string;
}
type valueProps = {
  fileList: imgProps[];
}
interface UploadFiletProps {
  value?: valueProps;
  beforeUpload?: (file: File) => Promise<boolean> | boolean;
  name?: string;  // 发到后台的文件参数名 默认file
  action?: string;  // 上传的地址  默认/resume/photo/upload
  accept?: any;
  data?: any; // 发送后台的额外参数
  headers?: object; // 设置上传的请求头部，IE10 以上有效
  onChange?: (files: imgProps[]) => void;
  tip?: string; // 文件格式说明文案
  singleUpload?: boolean; // 判断是否覆盖上传
  removeFile?: (file: object) => void; // 删除文件
  listType?: any;
  disabled?: boolean;
  showUploadList?: boolean; // 判断是否显示上传列表
  maxLength?: number;
}
class UploadFile extends React.Component<UploadFiletProps, any>{
  static getDerivedStateFromProps(nextProps, prevState) {
    if ('value' in nextProps) {
      return {
        fileList: nextProps.value ? nextProps.value.map((item) => { item.uid = item.id; return item }) : [] || [],
      }
    }
    return null;
  }

  static defaultData = { maxSize: 16, needSuffix: '.pdf,.jpg,.png,.bmp,.jpeg,.doc,.docx,.xls,.xlsx,.ppt,.pptx' }
  
  constructor(props: Readonly<UploadFiletProps>) {
    super(props);
    this.state = {
      loading: false,
      fileList: [],
    }
  }
  
  beforeUpload = (file: File) => {
    this.setState({ loading: true });
    const { data={} } = this.props;
    const isLt5M = file.size / 1024 / 1024 < (data.maxSize || 16);
    if (!isLt5M) {
      message.error(`单个文件大小不得超过${data.maxSize || 16}M`);
    }
    this.setState({
      loading: false,
    })
    return isLt5M;
  }

  uploadHandler = async (option) => {
    const { data = UploadFile.defaultData, action = '/common/upload-file', headers = undefined, singleUpload = false } = this.props;
    const beforeUpload = this.props.beforeUpload ? this.props.beforeUpload(option.file) : this.beforeUpload(option.file);
    if (beforeUpload === true || beforeUpload === undefined) {
      this.setState({ loading: true });
      const response = await fetchFile(action, option.file, data, headers);
      this.setState({ loading: false });
      if (response&&response.code === 0) {
        let { fileList } = this.state;
        if (singleUpload) {
          fileList = [{ uid: option.file.uid, id: response.data.id, url: response.data.url, name: response.data.name, ossKey: response.data.ossKey }];
        } else {
          fileList.push({ uid: option.file.uid, id: response.data.id, url: response.data.url, name: response.data.name, ossKey: response.data.ossKey })
        }
        if (this.props.onChange) {
          this.props.onChange(fileList)
        } else {
          this.setState({
            fileList,
          })
        }
      } else {
        message.error('上传失败');
      }
    } else {
      // eslint-disable-next-line no-console
      console.error('Avatar beforeUpload get false')
    }

  }

  render() {
    const { loading, fileList } = this.state;
    const { tip, accept, listType = "text", removeFile, disabled = false, children, showUploadList = true,maxLength=5 } = this.props;

    return <Spin spinning={loading}>
      <Upload
        disabled={fileList.length >= maxLength}
        accept={accept || '.pdf,.jpg,.png,.bmp,.jpeg,.doc,.docx,.xls,.xlsx,.ppt,.pptx'}
        customRequest={(options) => { this.uploadHandler(options) }}
        fileList={fileList}
        listType={listType}
        className={styles.fileUpload}
        onRemove={removeFile}
        showUploadList={showUploadList}
      >
        {children ? children : <Button style={{ width: 113 }} disabled={disabled}>
          <CloudUploadOutlined /> 上传
        </Button>}
        {tip ? <p className="ant-upload-text">{tip}</p> : null}
      </Upload>
    </Spin>
  }
}

export default UploadFile;