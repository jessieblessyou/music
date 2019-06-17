export function toplist (obj) {
  var data = {
    _: 1554602110225,
    g_tk: 5381,
    uin: 0,
    format: 'jsonp',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1
  }
  return obj.$http.jsonp(
    'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg',
    {params: data, jsonp: 'jsonpCallback'}
  )
}

export function topDiscInfo (obj, id) {
  var data = {
    g_tk: 1928093487,
    topid: id,
    tpl: 3,
    type: 'top',
    uin: 0,
    format: 'jsonp',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    page: 'detail'
  }
  return obj.$http.jsonp(
    'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg',
    {params: data, jsonp: 'jsonpCallback'}
  )
}
