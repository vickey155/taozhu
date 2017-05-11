export const API_ROOT = (process.env.NODE_ENV === 'production')
  ? 'http://boss.etaozhu.com:8888/'
  :'http://192.168.1.180:8888/';




export const CookieDomain = (process.env.NODE_ENV === 'production')
  ? ''
  :'';


export const apiVersion = '1.0';
