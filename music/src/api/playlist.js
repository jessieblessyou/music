export function playlist (obj) {
  var data = {
    picmid: 1,
    rnd: Math.random(),
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 29
  }
  return obj.$http.get(
    '/api/getDiscList', {params: data, jsonp: 'jsonpCallback'}
  )
}
