/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification, message } from 'antd';
import { getToken } from './authority';
// import { Redirect } from 'umi';
import { stringify } from 'querystring';
import { formatFormData } from './index';
import {roleMap} from '../../config/defaultSettings';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};

const token = getToken();
/**
 * 配置request请求时的默认参数
 */
const request = extend({
  method: 'post',
  prefix: roleMap[APP_ROLE].prefix, // '/api/admin', // 地址前缀
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  // data:{accessToken:token},
  // getResponse:true,
  headers: {
    Authorization: `Bearer ${token}`, // token
    accessToken: token
  },

});
// request interceptor, change url or options.
// 后台接口要求token 固定拼接在body里
request.interceptors.request.use((url, options) => {
  const {
    data = {}
  } = options
  // 统一处理请求参数格式
  const newData = formatFormData(data)
  return {
    url: `${url}`,
    options: {
      ...options, data: {
        ...newData,
        accessToken: token
      }
    },
  };
});



// 克隆响应对象做解析处理
request.interceptors.response.use(async(response) => {
  // 是否导出
  const isExport = response.url.includes('?export');
  if(isExport){

    // const blobUrl = await response.blob();
    // const url = URL.createObjectURL(blobUrl);
    // window.location.href = url;
    // const type = 'application/octet-stream'
    const blob = await response.blob()
    let fileName = response.headers.get('filename');
    if(!fileName){
      return message.error('下载失败,未获取到文件名称');
    }
    fileName = decodeURI(fileName);
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
      /*
       * IE workaround for "HTML7007: One or more blob URLs were revoked by closing
       * the blob for which they were created. These URLs will no longer resolve as
       * the data backing the URL has been freed."
       */
      window.navigator.msSaveBlob(blob, fileName);
    } else {
      const URL = window.URL || window.webkitURL
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      // safari doesn't support this yet
      if (typeof a.download === 'undefined') {
        window.location.href = objectUrl
      } else {
        a.href = objectUrl
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        a.remove();
        message.success(`${fileName} 已下载完成`);
      }
    }
    return false
  }
  const data = await response.clone().json();
  if (data && data.code === 0) {
    
    return response;
  }
  // 跳转登录页面
  if (data.code === 13001) {
    const queryString = stringify({
      redirect: window.location.href,
    });
    console.log('data===',JSON.stringify(data))
    window.location.href = `/user/login?${queryString}`;
    return false;
  }
  
  
  message.error(data.message || '请求失败')

});

export default request;

