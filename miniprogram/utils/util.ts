export const formatTime = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

const formatNumber = (n: number) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}

export const BASE_URL = (() => {

  // return 'http://127.0.0.1:8000';  // 测试环境
  return 'https://1065983258.dpdns.org:8000';  // 正式域名

})();

// 2. 接口路径枚举（集中管理，所有接口一目了然）
export const API = {
  // 项目相关
  PROGRAM_LIST: '/api/program/list',
  PROGRAM_DELETE: '/api/program/delete',
  PROGRAM_TOGGLE: '/api/program/toggle',
  PROGRAM_UPDATE: '/api/program/update',

  USER_LOGIN: '/api/user/login',
  UPLOAD_FILE: '/api/upload',
  // ...
};
