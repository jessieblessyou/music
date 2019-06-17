export function searchHotKey (obj) {
  var data = {
    _: 1554799556883,
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
    'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg',
    {params: data, jsonp: 'jsonpCallback'}
  )
}

export function searchResult (obj, name, page, perpage) {
  var data = {
  	_: 1554801536216,
  	g_tk: 5381,
  	uin: 0,
  	format: 'json',
  	inCharset: 'utf8',
    outCharset: 'utf-8',
    w: name,
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    zhidaqu: 1,
    catZhida: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage: 0,
    n: 20,
    p: page,
    remoteplace: 'txt.mqq.all'

  }
  return obj.$http.get(
    '/api/getSearchResult', {params: data, jsonp: 'jsonpCallback'}
  )
}
