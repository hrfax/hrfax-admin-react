import request from '@/utils/request';

export async function query(): Promise<any> {
  return request('/users');
}

export async function queryCurrent(data:any): Promise<any> {
  return request('/user/getUserInfo',{data});
}
export async function changePassword(data:any): Promise<any> {
  return request('/user/changePassword',{data});
}

export async function queryNotices(): Promise<any> {
  return request('/notices');
}
// 用户列表
export async function searchUsers(data:any): Promise<any> {
  return request('/user/searchUsers', {
    data,
  });
}
// 用户新增
export async function createNewUser(data:any): Promise<any> {
  return request('/user/createNewUser', {
    data,
  });
}
// 用户删除
export async function removeUser(data:any): Promise<any> {
  return request('/user/removeUser', {
    data,
  });
}
// 用户编辑
export async function editUserInfo(data:any): Promise<any> {
  return request('/user/editUserInfo', {
    data,
  });
}

