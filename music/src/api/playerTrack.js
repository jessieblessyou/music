export function playerTrack (obj, mid) {
  var data = {
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    ct: 24,
    singermid: mid,
    order: 'listen',
    begin: 0,
    num: 30,
    songstatus: 1
  }
  return obj.$http.jsonp(
    'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg',
    {params: data, jsonp: 'jsonpCallback'}
  )
}
