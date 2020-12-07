import { Settings as ProSettings } from '@ant-design/pro-layout';

type DefaultSettings = ProSettings & {
  pwa: boolean;
};
// const { APP_ROLE } = process.env;
const { APP_ROLE } = process.env;
// console.log('APP_ROLE====',APP_ROLE)


export const roleMap={
  admin:{
    title:'hrfax-管理平台',
    prefix: '/api'
  },
  
}
export const appRoleInfo = roleMap[APP_ROLE||'admin']||{};

const proSettings: DefaultSettings = {
  navTheme: 'dark',
  // 拂晓蓝
  primaryColor: '#6b59c9',
  layout: 'sidemenu',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  menu: {
    locale: true,
  },
  // 开始获取不到process.env title在使用的时候被重置了 这里设置无效
  title: `${appRoleInfo.title}`,
  pwa: false,
  iconfontUrl: '',

};

export type { DefaultSettings };

export default proSettings;
