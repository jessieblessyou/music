export function recommend (obj) {
  var data = {
    _: 1551753685716,
    g_tk: 5381,
    uin: 0,
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1
  }
  return obj.$http.jsonp(
    'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',
    {params: data, jsonp: 'jsonpCallback'}
  )
}

export function cdInfo (obj, id) {
  var data = {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid: id,
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
  return obj.$http.get(
    '/api/getRecommendSongs', {params: data, jsonp: 'jsonpCallback'}
  )
}
