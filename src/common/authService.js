import cookie from 'react-cookie'
import { CookieDomain } from './../config/index'

//Cookie
let cookieConfig = {};
if(CookieDomain !== ''){
  cookieConfig = { domain: CookieDomain }
}

export function saveCookie(name,value) {
  cookie.save(name, value, cookieConfig)
}

export function getCookie(name) {
  return cookie.load(name)
}

export function removeCookie(name) {
  cookie.remove(name, cookieConfig)
}

export function signOut() {
  cookie.remove('tokenid', cookieConfig);
  cookie.remove('userid', cookieConfig);
  cookie.remove('tenantid', cookieConfig);
}
export function isLogin() {
  return !!cookie.load('token')
}
