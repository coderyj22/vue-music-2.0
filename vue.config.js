const axios = require('axios')

module.exports = {
	devServer: {
		hot:true,
		before(app) {
			// 获取轮播图
			app.get('/api/getSlider', (req, res) => {
				let url = "https://u.y.qq.com/cgi-bin/musicu.fcg";
				axios.get(url, {
					headers: {
						origin: 'https://y.qq.com',
						referer: 'https://y.qq.com'
					},
					params: req.query
				}).then(response => {
					res.json(response.data)
				}).catch(err => {
					console.log(err)
				})
			})
			// 获取歌手信息
			app.get('/api/getSingers', (req, res) => {
				let url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
				axios.get(url, {
					headers: {
						referer: 'https://c.y.qq.com',
						host: 'c.y.qq.com'
					},
					params: req.query
				}).then(response => {
					res.json(response.data)
				}).catch(e => {
					console.log(e);
				})
			})
			// 获取歌手歌曲信息
			app.get('/api/getSingerDetail', (req, res) => {
				let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
				axios.get(url, {
					headers: {
						referer: 'https://c.y.qq.com',
						host: 'c.y.qq.com'
					},
					params: req.query
				}).then(response => {
					res.json(response.data)
				}).catch(e => {
					console.log(e)
				})
			})
			// get vkey
			app.get('/api/getSongvkey', (req, res) => {
				let url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
				axios.get(url, {
					headers: {
						origin: 'https://y.qq.com',
						referer: 'https://y.qq.com/portal/player.html'
					},
					params: req.query
				}).then(response => {
					res.json(response.data)
				}).catch(e => {
					console.log(e);
				})
			})
			// 获取歌词
			app.get('/api/getSongLyric', (req, res) => {
				let url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
				axios.get(url, {
					headers: {
						referer: 'https://y.qq.com/portal/player.html'
					},
					params: req.query
				}).then(response => {
					res.json(response.data)
				})
			})
			// 获取歌单歌曲
			app.get('/api/getSongList', (req, res) => {
				const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
				axios.get(url, {
					headers: {
						origin: 'https://y.qq.com',
						referer: 'https://y.qq.com/n/yqq/playlist'
					},
					params: req.query
				}).then(response => {
					res.json(response.data)
				})
			})
			//排行榜歌单
			app.get('/api/getTopList', (req, res) => {
				const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
				axios.get(url, {
					headers: {
						referer: 'https://c.y.qq.com'
					},
					params: req.query
				}).then(response => {
					res.json(response.data)
				})
			})
			//获取排行榜的歌曲
			app.get('/api/getMusicList', (req, res) => {
				const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
				axios.get(url, {
					headers: {
						referer: 'https://c.y.qq.com'
					},
					params: req.query
				}).then(response => {
					res.json(response.data)
				})
			})
			// 搜索热门
			app.get('/api/getHotKey', (req, res) => {
				const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
				axios.get(url, {
					headers: {
						origin: "https://y.qq.com",
						referer: "https://y.qq.com/m/index.html?tab=recommend"
					},
					params: req.query
				}).then(response => {
					res.json(response.data)
				})
			})
			//搜索
			app.get('/api/getSearch', (req, res) => {
				const url = 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp'
				axios.get(url, {
					headers: {
						origin: 'https://y.qq.com',
						referer: 'https://y.qq.com/portal/search.html'
					},
					params: req.query
				}).then(response => {
					res.json(response.data)
				})
			})
		}
	},
	configureWebpack: {
		resolve: {
			alias: {
				"base": "@/base",
				"components": "@/components",
				"views": "@/views",
				"assets": "@/assets",
				"network": "@/network"
			}
		}
	},

};
