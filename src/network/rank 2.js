import axios from 'axios'
import {commonParams} from "./config";

export function getTopList() {
	const url = '/api/getTopList'

	const data = Object.assign({}, commonParams, {
		platform: 'h5',
		needNewCode: 1,
		g_tk: 67232076,
		format: 'json'
	})

	return axios.get(url, {
		params: data
	}).then(res => {
		return Promise.resolve(res.data)
	})
}

// 获取排行榜的歌曲
export function getMusicList(topid) {
	const url = '/api/getMusicList'

	const data = Object.assign({}, commonParams, {
		page: 'detail',
		platform: 'h5',
		topid: topid,
		type: 'top',
		tpl: 3,
		needNewCode: 1,
		uin: 0,
		format: 'jsonp',
		notice: 0,
		g_tk: 1117927041
	})

	return axios.get(url, {
		params: data
	}).then(res => {
		return Promise.resolve(res.data)
	})
}
