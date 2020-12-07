import request from '@/utils/request';
import md5 from 'js-md5';

export interface LoginParamsType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

export async function fakeAccountLogin(data: any) {
  return request('/user/login', {
    method: 'POST',
    data:{
      ...data,
      password:md5(data.password)
    }
    // data: {
    //   LoginAgent: "WEB",
    //   account: "00009528",
    //   password: "Hhu9WGzB74ENr0pIviyUBGmiet/cLcIObGW7Fso/YuNVfiTgYZoWFdG+xIMWPI458n3ZI+XmRpUIl78Wq7FGOtt6cV6lfweh773DKE3GWbxMnW/XHQjfVnK+1odNv8amhO7j0lVgVc0S8aJHNgS2+SYmCtN91KVFA1XIjpMzT7E="
    // },
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/login/captcha?mobile=${mobile}`);
}
