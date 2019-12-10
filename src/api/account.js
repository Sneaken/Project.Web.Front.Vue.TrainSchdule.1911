import request from '../utils/request'
import rsa from '../utils/crtypto/rsa'
import { parseTime } from '../utils'
import crypto from 'crypto'
function formatPsw(username, rawPsw) {
  const md5 = crypto.createHash('md5')
  md5.update(username)
  var tmpraw = parseTime(new Date(), '{yyyy}{mm}{dd}') + rawPsw + md5.digest('hex')
  return rsa.encrypt(tmpraw)
}
/**
 * 登录账号
 * @param { {
 * username: String,
 * password: any,
 * RememberMe: Boolean,
 * Verify: { Code: any }
 * } } params
 */
export function login(params) {
  params.password = formatPsw(params.username, params.password)
  return request.post('account/login', params)
}

/**
 * 登出
 */
export function logout() {
  return request.post('account/logout')
}

/**
 * 移除用户
 * @param { {
 * id: String,
 * Auth: {
 *   Code: String,
 *   AuthByUserID: String
 * }
 * } } params
 */
export function removeAccount(params) {
  return request.delete('account/Remove', params)
}

/**
 * 注册
 * @param { {
 * Data: {
 *   id: String,
 *   realName: String,
 *   company: String,
 *   duties: String,
 *   phone: String,
 *   homeAddress: String,
 *   homeDetailAddress: String,
 *   email: String,
 *   password: String,
 *   confirmpassword: String
 * },
 * Auth: {
 *   Code: String,
 *   AuthByUserID: String
 * },
 * Verify: {
 *   Code: String
 * }
 * } } params
 */
export function register(params) {
  params.password = formatPsw(params.username, params.password)
  params.confirmpassword = formatPsw(params.username, params.confirmpassword)
  return request.post('account/register', params)
}

/**
 * 修改用户密码
 * @param {*} params
 */
export function accountPassword(params) {
  params.newPassword = formatPsw(params.id, params.newPassword)
  params.confirmNewPassword = formatPsw(params.id, params.confirmNewPassword)
  params.oldPassword = formatPsw(params.id, params.oldPassword)
  return request.post('/account/password', params)
}

/**
 * 获取用户信息
 * @description 在account的api中用来验证用户是否登录，并且实时更新用户的基本信息
 */
export function getUserInfo() {
  return request.get('/users/base')
}

/**
 * 获取权限
 * @param {{
 * id: String,
 * Auth: {
 *   Code: String,
 *   AuthByUserID: String
 * },
 * }} params
 */
export function getPermission(params) {
  return request.get('account/Permission', {
    params
  })
}

/**
 * 新增权限
 * @param {{
 * id: String,
 * Auth: {
 *   Code: String,
 *   AuthByUserID: String,
 * },
 * newPermission: String
 * }} params
 */
export function postPermission(params) {
  return request.post('account/Permission', params)
}

/**
 * 修改授权码
 * @param { {
 * NewKey: String,
 * ModifyUserId: String,
 * Auth: {
 *   Code: String,
 *   AuthByUserID: String,
 * },
 * } } params
 */
export function postAuthKey(params) {
  return request.post('account/AuthKey', params)
}

/**
 * 获取授权码
 */
export function getAuthKey() {
  return request.get('account/AuthKey', { responseType: 'arraybuffer' }).then(res => {
    Promise.resolve(res.url)
  })
}
