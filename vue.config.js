const path = require('path')

function resolve(dir) {
	return path.join(__dirname, dir)
}

module.exports = {
	devServer: {
		hot: true,
		open: true,
		proxy: {
			'/getSlider': {
				target: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					'^/getSlider': '',
				},
				headers: {
					origin: 'https://y.qq.com',
					referer: 'https://y.qq.com',
				},
			},
			'/getSongList': {
				target:
					'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					'^/getSongList': '',
				},
				headers: {
					origin: 'https://y.qq.com',
					referer: 'https://y.qq.com/n/yqq/playlist',
				},
			},
			'/getHotKey': {
				target: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					'^/getHotKey': '',
				},
				headers: {
					origin: 'https://y.qq.com',
					referer: 'https://y.qq.com/m/index.html?tab=recommend',
				},
			},
			'/getSearch': {
				target: 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp',
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					'^/getSearch': '',
				},
				headers: {
					origin: 'https://y.qq.com',
					referer: 'https://y.qq.com/portal/search.html',
				},
			},
			'/getSingers': {
				target: 'https://c.y.qq.com/v8/fcg-bin/v8.fcg',
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					'^/getSingers': '',
				},
				headers: {
					origin: 'https://y.qq.com',
					referer: 'https://y.qq.com',
				},
			},
			'/getSingerDetail': {
				target: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg',
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					'^/getSingerDetail': '',
				},
				headers: {
					host: 'https://c.y.qq.com',
					referer: 'https://c.y.qq.com',
				},
			},
			'/getSongvkey': {
				target: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					'^/getSongvkey': '',
				},
				headers: {
					origin: 'https://y.qq.com',
					referer: 'https://y.qq.com/portal/player.html',
				},
			},
			'/getSongLyric': {
				target: 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg',
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					'^/getSongLyric': '',
				},
				headers: {
					referer: 'https://y.qq.com/portal/player.html',
				},
			},
			'/getTopList': {
				target: 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg',
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					'^/getTopList': '',
				},
				headers: {
					referer: 'https://c.y.qq.com',
				},
			},
			'/getMusicList': {
				target: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg',
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					'^/getMusicList': '',
				},
				headers: {
					referer: 'https://c.y.qq.com',
				},
			},
		},
	},
	// configureWebpack: {
	//   resolve: {
	//     alias: {
	//       base: '@/base',
	//       components: '@/components',
	//       views: '@/views',
	//       assets: '@/assets',
	//       network: '@/network',
	//     },
	//   },
	// },
	chainWebpack: (config) => {
		config.when(process.env.NODE_ENV === 'production', (config) => {
			// 生产配置
			config.set('externals', {
				vue: 'Vue',
				axios: 'axios',
			})
		})
		// 开发和生产依赖配置项
		config.resolve.alias
			.set('@', resolve('src'))
			.set('components', resolve('src/components'))
			.set('views', resolve('src/views'))
			.set('assets', resolve('src/assets'))
			.set('base', resolve('src/base'))
			.set('network', resolve('src/network'))
	},
}
