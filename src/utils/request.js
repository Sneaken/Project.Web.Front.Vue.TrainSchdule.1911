import axios from 'axios'
import {
  Message
} from 'element-ui'
import qs from 'qs'
import {
  setTimeout
} from 'timers'

// 数据存储
export const cache = {
  data: {},
  set(key, data) {
    this.data[key] = data
  },
  get(key) {
    return this.data[key]
  },
  clear(key) {
    delete this.data[key]
  }
}

// 建立唯一的key值
export const buildUniqueUrl = (url, method, params = {}, data = {}) => {
  const paramStr = (obj) => {
    if (toString.call(obj) === '[object Object]') {
      return JSON.stringify(Object.keys(obj).sort().reduce((result, key) => {
        result[key] = obj[key]
        return result
      }, {}))
    } else {
      return JSON.stringify(obj)
    }
  }
  url += `?${paramStr(params)}&${paramStr(data)}&${method}`
  return url
}

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASEURL, // api 的 base_url
  withCredentials: true, // 跨域请求时发送 cookies
  timeout: 30 * 1000 // request timeout
})

// const getCache = (config) => {
//   const defaultOptions = {
//     time: 600 * 1000 // 设置为0，不清除缓存
//   }
//   const index = buildUniqueUrl(config.url, config.method, config.params, config.data)
//   var responsePromise = cache.get(index)
//   if (!responsePromise) {
//     if (defaultOptions.time !== 0) {
//       setTimeout(() => {
//         cache.clear(index)
//       }, defaultOptions.time)
//     }
//   }
//   return {
//     index, responsePromise
//   }
// }
// TODO 增加缓存功能
// request interceptor
service.interceptors.request.use(
  config => {
    if (config.headers['Content-Type'] === 'application/urlencoded') {
      config.data = qs.stringify(config.data)
    }
    // var cacher = getCache(config)
    // if (cacher.responsePromise) {
    //   console.log('检测到缓存')
    //   console.log(service.interceptors.request)
    // }
    // config.cacheIndex = cacher.index
    return config
  },
  error => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get information such as headers or status
   * Please return  response => response
   */
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 XMLHttpRequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    if (response.config.responseType === 'arraybuffer') {
      const data = response.data
      if (!data) {
        return Promise.reject('图片加载失败')
      }
      return Promise.resolve({
        msg: null,
        status: 0,
        url: 'data:image/png;base64,' + btoa(
          new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        )
      })
    }
    const res = response.data
    // cache.set(response.config.cacheIndex, res)

    if (res.status === 0) {
      return Promise.resolve(res.data)
    } else {
      if (!response.config.respondErrorIngore) {
        Message({
          message: res.message,
          type: 'error',
          duration: 5 * 1000
        })
        if (res.data && res.data.list) {
          const list = res.data.list
          for (var i = 0; i < list.length; i++) {
            setTimeout((errItem) => {
              Message({
                message: errItem.key + ':' + errItem.message,
                type: 'error',
                duration: 5 * 1000
              })
            }, (i + 1) * 2000, list[i])
          }
        }
      }
      return Promise.reject(res)
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
