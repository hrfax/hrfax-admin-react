import request from '@/utils/request';

// 获取阿里OSS临时token
export async function getAliOssToken(data?:any) {
  return request('/common/getAliOssToken');
}
// 获取省或直辖市清单
export async function getTopicAreas(data:any) {
  return request('/common/getTopicAreas', {
    data,
  });
}
// 根据当前行政单位Id获取隶属
export async function getAreasByParentId(data:any) {
  return request('/common/getAreasByParentId', {
    data,
  });
}