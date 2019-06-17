const express = require('express')
const proxy = require('http-proxy-middleware')
const app = express ()

app.use(express.static(__dirname+'/dist'));


app.use('/api/getDiscList', proxy({ 
	target: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg', 
	changeOrigin: true,
	pathRewrite: {
  	'^/api/getDiscList': '',
	},
	onProxyReq(proxyReq, req, res) {
    proxyReq.setHeader('referer', 'https://y.qq.com//portal/playlist.html'),
    proxyReq.setHeader('host', 'c.y.qq.com')
  }
}))

app.use('/api/getRecommendSongs', proxy({ 
	target: 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg', 
	changeOrigin: true,
	pathRewrite: {
  	'^/api/getRecommendSongs': '',
	},
	onProxyReq(proxyReq, req, res) {
    proxyReq.setHeader('referer', 'https://y.qq.com//portal/playlist.html'),
    proxyReq.setHeader('host', 'c.y.qq.com')
  }
}))

app.use('/api/getLyrics', proxy({ 
	target: 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg', 
	changeOrigin: true,
	pathRewrite: {
  	'^/api/getLyrics': '',
	},
	onProxyReq(proxyReq, req, res) {
    proxyReq.setHeader('referer', 'https://y.qq.com/portal/player.html'),
    proxyReq.setHeader('host', 'c.y.qq.com')
  }
}))

app.use('/api/getSearchResult', proxy({ 
	target: 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp', 
	changeOrigin: true,
	pathRewrite: {
  	'^/api/getSearchResult': '',
	},
	onProxyReq(proxyReq, req, res) {
    proxyReq.setHeader('referer', 'https://m.y.qq.com/'),
    proxyReq.setHeader('host', 'c.y.qq.com')
  }
}))

app.listen(9000)
