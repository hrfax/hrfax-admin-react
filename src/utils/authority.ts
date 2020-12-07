import { Base64 } from 'js-base64';
import { reloadAuthorized } from './Authorized';
const localKey = Base64.encode('hrfax-authority');
// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(userInfo:any): string | string[] {
  const authority = localStorage.getItem(localKey);
  const soundCode:any = authority?Base64.decode(authority):''
  try {
    const authorityJson:any = JSON.parse(soundCode ? soundCode : '{}');
    return authorityJson['accessToken']? (userInfo?authorityJson[userInfo]:['user2']):'';
  } catch (error) {
    return ''
  }
}

export function setAuthority(authority: any): void {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  const baseString = Base64.encode(JSON.stringify(proAuthority))
  if(window.location.port === '8000'){
    localStorage.setItem('dev_info', JSON.stringify(proAuthority));
  }
  return localStorage.setItem(localKey, baseString);
  // auto reload
  // reloadAuthorized();
}
export const getToken = (key?:string) => {
  const authority = localStorage.getItem(localKey);
  const soundCode = authority?Base64.decode(authority):''
  if(soundCode && soundCode.indexOf('{') === 0){
    try {
      const authorityJson = JSON.parse(soundCode);
      return authorityJson[key || 'accessToken']
    } catch (error) {
      return null
    }
    
  }
  return null;
 
}