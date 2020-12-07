/* eslint-disable no-plusplus */
/* eslint-disable no-cond-assign */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-param-reassign */
import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import { Route } from '@/models/connect';
import { Base64 } from 'js-base64';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */
export const getAuthorityFromRouter = <T extends Route>(
  router: T[] = [],
  pathname: string,
): T | undefined => {
  const authority = router.find(
    ({ routes, path = '/', target = '_self' }) =>
      (path && target !== '_blank' && pathRegexp(path).exec(pathname)) ||
      (routes && getAuthorityFromRouter(routes, pathname)),
  );
  if (authority) return authority;
  return undefined;
};

export const getRouteAuthority = (path: string, routeData: Route[]) => {
  let authorities: string[] | string | undefined;
  routeData.forEach((route) => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      }
      // exact match
      if (route.path === path) {
        authorities = route.authority || authorities;
      }
      // get children authority recursively
      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};
const type = (obj) => {
  const types = Object.prototype.toString.call(obj).split(' ');
  return types.length >= 2 ? types[1].slice( 0, types[1].length - 1 ) : '';
};


const buildParams = ( prefix, obj, add ) => {
  let name;

  if ( Array.isArray( obj ) ) {
      // Serialize array item.
      obj.forEach( ( i, v ) => {
          // Item is non-scalar (array or object), encode its numeric index.
          buildParams( `${prefix  }[${   typeof v === "object" ? i : ""  }]`, v, add );
      });

  } else if ( type( obj ) === "Object" ) {
      // Serialize object item.
      for ( name in obj ) {
          buildParams( `${prefix  }[${  name  }]`, obj[ name ], add );
      }
  } else {
      // Serialize scalar item.
      add( prefix, obj );
  }
}


// key/values into a query string
export const enCodeChar = ( data ) => {
const r20 = /%20/g;
let prefix;
const s= [];
const add = ( key, value ) => {
    // If value is a function, invoke it and return its value
    value = type( value ) === 'function' ? value() : value;
    if(value === null || value === undefined) return;
    s[ s.length ] = `${encodeURIComponent( key )  }=${  encodeURIComponent( value )}`;
};
for ( prefix in data ) {
    buildParams( prefix, data[ prefix ], add );
}
// Return the resulting serialization
return s.join( "&" ).replace( r20, "+" );
};





/**
* 
* @param OldData 数据源
* @param label 变量名
* @param value 变量
* @param children 子元素名
*/
export function formatTreeData(OldData, label, value, children?,isMerge=false) {
const getChildren = (children) => {
  const newChildren = []
  for (let i = 0, len = children.length; i < len; i++) {
    newChildren.push(getObj(children[i]));
  }
  return newChildren;
}

const getObj = (data) => {
  const obj = {
    ...data,
    label: data[label],
    value: isMerge?`${data[value]}_${data[label]}`:data[value],
    key: data[value],
  };
  if (data[children]) {
    obj.children = getChildren(data[children])
  }
  return obj;
}
return getChildren(OldData);
}

export const formatDataToAntd = (data: any[], label = 'name', value = 'id', children = 'children', labelInValue = false) => {
  return data.map(item => {
    if (item[children]) {
      const c = formatDataToAntd(item[children], label, value, children, labelInValue)
      if (children !== 'children') {
        delete item[children]
      }
      return {
        ...item,
        label: item[label],
        value: labelInValue ? `${item[label]}-${item[value]}` : item[value],
        children: c,
      }
    } else {
      return {
        ...item,
        label: item[label],
        value: labelInValue ? `${item[label]}-${item[value]}` : item[value],
      }
    }
  })
}
/**
 * Function formatMoney 数值转或货币格式
 *  -@param {Number} number 要转换的数值
 *  -@param {Number} places 保留小数点位数
 *  -@param {String} symbol 货币符号
 *  -@param {String} thousand 间隔符
 *  -@param {String} decimal 小数位符号
 * Return {String}
 */
export const formatMoney = (num, places = 2, symbol = '元', symbolAfter=true, thousand = ",", decimal = ".") => {
  num = num || 0;
  places = !isNaN(places = Math.abs(places)) ? places : 2;
  symbol = symbol !== undefined ? symbol : "元";

  const negative = num < 0 ? "-" : "";
    const i: any = `${parseInt(num = Math.abs(+num || 0).toFixed(places), 10)  }`;
    const j: any = i.length > 3 ? i.length % 3 : 0;
  if(symbolAfter){
    return negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${  thousand}`) + (places ? decimal + Math.abs(num - i).toFixed(places).slice(2) : "")+symbol;
  }
  return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${  thousand}`) + (places ? decimal + Math.abs(num - i).toFixed(places).slice(2) : "");
}

// formatMoney 的值 转为 number
export const moneyToNumber = (val) => { 
  const num = val.trim();
  const ss = num.toString();
  if (ss.length === 0) {
    return 0;
  }
  return Number(ss.replace(/,/g, ""));
}
// 两小浮点小数相加
export function accAdd(arg1, arg2) {
  let r1; let r2; let m; let c;
  try {
    r1 = arg1.toString().split(".")[1].length;
  }
  catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  }
  catch (e) {
    r2 = 0;
  }
  c = Math.abs(r1 - r2);
  m = Math.pow(10, Math.max(r1, r2));
  if (c > 0) {
    let cm = Math.pow(10, c);
    if (r1 > r2) {
      arg1 = Number(arg1.toString().replace(".", ""));
      arg2 = Number(arg2.toString().replace(".", "")) * cm;
    } else {
      arg1 = Number(arg1.toString().replace(".", "")) * cm;
      arg2 = Number(arg2.toString().replace(".", ""));
    }
  } else {
    arg1 = Number(arg1.toString().replace(".", ""));
    arg2 = Number(arg2.toString().replace(".", ""));
  }
  return (arg1 + arg2) / m;
}
export const digitUppercase = (n)=> {
  const fraction = ['角', '分'];
  const digit = [
      '零', '壹', '贰', '叁', '肆',
      '伍', '陆', '柒', '捌', '玖'
  ];
  const unit = [
      ['元', '万', '亿','兆','京'],
      ['', '拾', '佰', '仟']
  ];
  const head = n < 0 ? '负' : '';
  n = Math.abs(n);
  let s = '';
  for (let i = 0; i < fraction.length; i++) {
      s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
  }
  s = s || '整';
  n = Math.floor(n);
  for (let i = 0; i < unit[0].length && n > 0; i++) {
      let p = '';
      for (let j = 0; j < unit[1].length && n > 0; j++) {
          p = digit[n % 10] + unit[1][j] + p;
          n = Math.floor(n / 10);
      }
      s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }
  return head + s.replace(/(零.)*零元/, '元')
      .replace(/(零.)+/g, '零')
      .replace(/^整$/, '零元整');
}
export const setSessionStorage = (name:string,data:any)=>{
  sessionStorage.setItem(name, Base64.encode(JSON.stringify(data)));
}
export const getSessionStorage = (name:string)=>{
  const data = sessionStorage.getItem(name);
  const soundCode = data?Base64.decode(data):''
  if(soundCode){
    return JSON.parse(soundCode)
  }
  return null
}
