import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

export function lyrics (id) {
  var data = {
    pcachetime: '1554096697296',
    songmid: id,
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0
  }
  return Vue.http.get(
    '/api/getLyrics', {params: data, jsonp: 'jsonpCallback'}
  )
}
