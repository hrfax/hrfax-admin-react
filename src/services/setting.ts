/* eslint-disable react-hooks/rules-of-hooks */
import request from '@/utils/request';
import { useRequest } from '@umijs/hooks';

export async function queryRule(data:any): Promise<any> {
  return request('/om/grade/search', {
    data,
  });
}
export async function updateRule(data:any): Promise<any> {
  return request('/om/grade/update',{
    data
  });
}
export async function addRule(data:any): Promise<any> {
  return request('/om/grade/create',{
    data
  });
}
export async function removeRule(): Promise<any> {
  return request('/notices');
}
// 根据评级ID获取数据
export async function queryGradeOne(data:any): Promise<any> {
  return request('/om/grade/one',{
    data
  });
}

export async function queryProduct(data:any): Promise<any> {
  return request('/base/production/search', {
    data,
  });
}
export async function updateProduct(data:any): Promise<any> {
  return request('/base/production/update',{
    data
  });
}
export async function addProduct(data:any): Promise<any> {
  return request('/base/production/create',{
    data
  });
}
// 操作记录
export async function queryProductLog(data:any): Promise<any> {
  return request('/base/production/log', {
    data,
  });
}
// 查询关联的资方名称
export async function queryProductFunder(data:any): Promise<any> {
  return request('/base/production/associate/funder', {
    data,
  });
}
// 查询平台账户
export async function queryPlatformOne(data?:any): Promise<any> {
  return request('/om/platform/one', {
    data,
  });
}
// 操作记录 type 1 资方 2机构 3产品
export async function queryLog(data?:any): Promise<any> {
  return request('/base/log', {
    data,
  });
}

// 字典
export async function queryDict(data?:any): Promise<any> {
  return request('/om/dict', {
    data,
  });
}

