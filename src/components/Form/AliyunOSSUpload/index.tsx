import React from 'react';
import {  message, Button } from 'antd';
import Upload, {UploadProps} from 'antd/lib/upload';
import { CloudUploadOutlined } from '@ant-design/icons';
import { getAliOssToken } from '@/services/common'
import styles from './index.less'

type imgProps = {
    uid: number | string;
    id: number | string;
    url: string;
    name: string;
  }
  type valueProps = {
    fileList: imgProps[];
  }
interface UploadDraggertProps extends UploadProps{
    value?: any[];
    
    maxLength?: number; // 最大文件个数
    uploadButton?:any; // 上传按钮
    isOnlyUrl?:boolean; // 是否只保留url给后台 默认是
    // isFile?: boolean;
    // multiple?: boolean;
    // hasWarn?: boolean;
  }
class AliyunOSSUpload extends React.Component<UploadDraggertProps,any> {
    state = {
      fileList:this.props.value||[],
      OSSData: {
        accessId: "LTAI4FxVENyybwAA4cKFgV88",
        dir: "pxxx/",
        expire: "1609459200",
        host: "https://hb-peixun.oss-cn-hangzhou.aliyuncs.com",
        policy: "eyJleHBpcmF0aW9uIjoiMjAyMC0wNi0yNFQwOToyMjo1MloiLCJjb25kaXRpb25zIjpbWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsMCwxMDQ4NTc2MDAwXV19",
        signature: "1X4U9TnogYkTjU4NrAyY+fpViapM="
      }
    }

    async componentDidMount() {

      await this.init();
    }
  
    init = async () => {
      try {
        const res = await getAliOssToken();
        // const OSSData = this.mockGetOSSData();
        if(res && res.data){
            this.setState({
                OSSData:res.data,
              });
        }
        
      } catch (error) {
        message.error(error);
      }
    };
  
    // // Mock get OSS api
    // // https://help.aliyun.com/document_detail/31988.html
    mockGetOSSData = () => {
      return {
        dir: 'user-dir/',
        expire: '1577811661',
        host: '//www.mocky.io/v2/5cc8019d300000980a055e76',
        accessId: 'c2hhb2RhaG9uZw==',
        policy: 'eGl4aWhhaGFrdWt1ZGFkYQ==',
        signature: 'ZGFob25nc2hhbw==',
      };
    };
  
    onChange = ({ fileList }) => {
      const { onChange } = this.props;
      
      if (onChange) {
        onChange(fileList);
      }
      setTimeout(() => {
        this.setState({fileList})
      }, 1);
    };
  
    onRemove = file => {
      const { value, onChange } = this.props;
  
      const files = value.filter(v => v.url !== file.url);
  
      if (onChange) {
        onChange(files);
      }
    };
  
    transformFile = file => {
      const {isOnlyUrl=true} = this.props;
      const { OSSData } = this.state;
  
      const newFile = file;
        const suffix = file.name.slice(file.name.lastIndexOf('.'));
        const filename = Date.now() + suffix;
        newFile.url = `${OSSData.host}/${OSSData.dir}${filename}`;
        newFile.key = `${OSSData.dir}${filename}`;
        newFile.key = `${OSSData.dir}${filename}`;
        newFile.isOnlyUrl = isOnlyUrl
      return newFile;
    };
  
    getExtraData = file => {
      const { OSSData } = this.state;
  
      return {
        // key: file.url,
        key: file.key,
        OSSAccessKeyId: OSSData.accessId,
        policy: OSSData.policy,
        Signature: OSSData.signature,

      };
    };
  
    beforeUpload = async () => {
      const { OSSData } = this.state;
      const expire = OSSData.expire * 1000;
  
      if (expire < Date.now()) {
        await this.init();
      }
      return true;
    };

    // 图片后台只存了url
    transformValue = (data=[],isRollback=false)=>{
      const {isOnlyUrl=true} = this.props;
      if(Array.isArray(data)&&data[0]){
        return isRollback?data.map((item:any)=>{
          if(item&&item.url){
            return item.url
          }
          return item
          
        }):data.map(item=>{
          if(Object.prototype.toString.call(item)==="[object String]"){
            if(item){
              return {
                url:item,
                uid:item,
                id:item,
                name:item,
                // name:item.slice(item.lastIndexOf('/')+1),
                isOnlyUrl
              }
            }
            
          }
          if(Object.prototype.toString.call(item)==="[object Object]"){
            return {
              ...item,
              url:item.url,
              uid:item.uid||item.url,
              id:item.id||item.url,
              name:item.name,
              isOnlyUrl
            }
          }
          // return item
          
        })
      }
      return []
      

    }

    render() {
      const { value=[], disabled=false, maxLength=5,listType='picture-card',
        uploadButton=<Button>
        <CloudUploadOutlined /> 上传
      </Button>
      } = this.props;
      const { fileList } = this.state
      const props = {
        name: 'file',
        listType,
        fileList: this.transformValue(value),
        action: this.state.OSSData.host,
        onChange: this.onChange,
        onRemove: this.onRemove,
        transformFile: this.transformFile,
        data: this.getExtraData,
        beforeUpload: this.beforeUpload,
        disabled
      };
      return (
        <Upload {...props} className={styles.upload}>
          {
            ((value||[]).length<maxLength&&!disabled)?uploadButton:null
          }
          
        </Upload>
      );
    }
}
export default AliyunOSSUpload;
