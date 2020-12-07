import { message } from 'antd';
import request from './request';
import { getToken } from './authority';


export const fetchFile = async (url: string, file: File | Blob, requestData: object = {}, headers: object = {}) => {
    const data: FormData = new FormData()
    // eslint-disable-next-line no-unused-expressions
    file && data.append('file', file)
    // console.log(file);
    for (let key in requestData) {
        data.append(key, requestData[key])
    }
    const fetchUrl = `/api${url}`
 
    const opt= {
      credentials: 'include',
      headers: {
          // 'Content-Type': 'multipart/form-data',   //应后台接口接受方式问题， 去除手动添加格式
          'authorization': `bearer ${getToken()}`,
          ...headers,
      },
      method: 'POST',
      body: data,
  }
    let json: any;
    try {
        // let response = await fetch(request);
        const response = await request(url, {
          ...opt
        });
        json = await response.json();
        if (Number(json.code) === 99999) {
            window.location.href = '/';
            return;
        } 
        if(Number(json.code) !== 0) {
            // eslint-disable-next-line consistent-return
            return message.error(json.message || json.msg);
        } 
        // eslint-disable-next-line consistent-return
        return json;
    } catch (error) {
        let msg;
        switch (error.toString()) {
            case 'TypeError: Failed to fetch':
                msg = '请求失败';
                break;
            case 'timeout':
                msg = '请求超时';
                break;
            default:
                msg = '导入失败';
        }
        // message.error(msg);
        json = { code: 1, status: 1, msg, };
    }
    // console.log('下面return json')
    // return await json
}