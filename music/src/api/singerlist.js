export function singerlist (obj) {
  var data = {
    g_tk: 1928093487,
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    format: 'jsonp',
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  }
  return obj.$http.jsonp(
    'https://c.y.qq.com/v8/fcg-bin/v8.fcg',
    {params: data, jsonp: 'jsonpCallback'}
  )
}
