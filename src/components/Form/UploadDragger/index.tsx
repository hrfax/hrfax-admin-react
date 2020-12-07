/* eslint-disable no-unused-expressions */
import React from 'react';
import { Upload, Spin, Modal, Icon, message } from 'antd';
import { fetchFile, getApiDomain } from '@/utils';
const { Dragger } = Upload;
const { confirm } = Modal;
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
interface UploadDraggertProps {
  value?: valueProps;
  beforeUpload?: (file: File) => Promise<boolean> | boolean;
  name?: string;  // 发到后台的文件参数名 默认file
  action?: string;  // 上传的地址  默认/resume/photo/upload
  accept?: any;
  data?: any;  // 发送后台的额外参数
  headers?: object; // 设置上传的请求头部，IE10 以上有效
  onChange?: (files: imgProps[], file?: File) => void;
  tip?: string; // 文件格式说明文案
  singleUpload?: boolean; // 判断是否覆盖上传
  removeFile?: (file: object) => void; // 删除文件
  listType?: any;
  disabled?: boolean;
  showUploadList?: boolean; // 判断是否显示上传列表
  maxLength?: number; // 最大文件个数
  isFile?: boolean;
  multiple?: boolean;
  hasWarn?: boolean;
}
class UploadDragger extends React.Component<UploadDraggertProps, any>{
  static getDerivedStateFromProps(nextProps: { value: any[]; }) {
    if ('value' in nextProps) {
      return {
        // eslint-disable-next-line no-param-reassign
        fileList: nextProps.value ? nextProps.value.map((item) => { item.uid = item.id; return item }) : [] || [],
      }
    }
    return null;
  }

  // eslint-disable-next-line react/sort-comp
  static defaultData = { maxSize: 16, needSuffix: '.pdf,.jpg,.png,.bmp,.jpeg,.doc,.docx,.xls,.xlsx,.ppt,.pptx' }

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      fileList: [],
    }
  }

  beforeUpload = (file: File) => {
    this.setState({ loading: true });
    const { data = {} } = this.props;
    const isLt5M = file.size / 1024 / 1024 < (data.maxSize || 16);
    if (!isLt5M) {
      message.error(`单个文件大小不得超过${data.maxSize || 16}M`);
    }
    this.setState({
      loading: false,
      file,
    })
    return isLt5M;
  }

  uploadHandler = async (option: { file: Blob; }) => {
    const { data = UploadDragger.defaultData, action = '/common/upload-file', headers = undefined, singleUpload = false, isFile = false } = this.props;
    const beforeUpload = this.props.beforeUpload ? this.props.beforeUpload(option.file) : this.beforeUpload(option.file);
    if (beforeUpload === true || beforeUpload === undefined) {
      this.setState({ loading: true });
      const response = await fetchFile(action, option.file, data, headers);
      this.setState({ loading: false });
      if (response&&response.code === 0) {
        // eslint-disable-next-line prefer-const
        let { fileList, file } = this.state;
        const {ossKey} = response.data
        const {
          id,
          url = `${getApiDomain()}/longbo-gateway/open/oss/download?ossKey=${ossKey}`,
          name,
          createUser
        } = response.data
        const fileData = { uid: option.file.uid, id, url, name, ossKey, createUser }
        if (singleUpload) {
          fileList = [fileData];
        } else {
          fileList.push(fileData)
        }
        if (this.props.onChange) {
          this.props.onChange(fileList, file)
        } else {
          this.setState({
            fileList,
          })
        }
      } else {
        message.error('上传失败');
      }
    } else {
      console.error('Avatar beforeUpload get false')
    }

  }

  onRemove = (file: object) => {
    const {
      fileList
    } = this.state;
    const {
      removeFile,
      onChange
    } = this.props
    const filterList = fileList.filter((item: { id: any; }) => item.id != file.id)

    if (removeFile && typeof removeFile === 'function') {

      onChange && onChange(filterList)
      removeFile(file)
    } else {
      onChange && onChange(filterList)
      this.setState({ fileList: filterList })
    }
  }

  render() {
    const { loading, fileList } = this.state;
    const { tip = "支持：.pdf，.jpg，.jpeg，.png，.bmp", accept, listType = "text", removeFile, onChange, disabled = false, multiple = true, children, showUploadList = true, maxLength = 20, hasWarn = false } = this.props;

    return <Spin spinning={loading}>

      <Dragger
        disabled={fileList.length >= maxLength}
        accept={accept || '.pdf,.jpg,.png,.bmp,.jpeg'}
        customRequest={(options) => { this.uploadHandler(options) }}
        fileList={fileList}
        listType={listType}
        multiple={multiple}
        className={styles.uploadDragger}
        // disabled={disabled}
        // onRemove={removeFile}
        onRemove={(file: any) => {
          if (hasWarn) {
            confirm({
              title: '请确认是否删除',
              // content: 'Some descriptions',
              onOk: () => {
                this.onRemove(file)
              },
              okText: '确定',
              cancelText: '取消'
            });
          } else {
            this.onRemove(file)
          }
        }}
        showUploadList={showUploadList}
      >
        {children ? children : <p className="ant-upload-drag-text">
          <Icon type="cloud-upload" />上传
        </p>}
        {tip ? <p className="ant-upload-tip">{tip}</p> : null}
      </Dragger>
    </Spin>
  }
}

export default UploadDragger;