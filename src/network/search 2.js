import axios from 'axios'
import {commonParams} from "./config";

export function getHotKey() {
	const url = '/api/getHotKey'
	const data = {
		data: {
			"comm": {
				"g_tk": 5381,
				"uin": 1052670316,
				"format": "json",
				"inCharset": "utf-8",
				"outCharset": "utf-8",
				"notice": 0,
				"platform": "h5",
				"needNewCode": 1
			},
			"MusicHallHomePage": {
				"module": "music.musicHall.MusicHallPlatform",
				"method": "MobileWebHome",
				"param": {"ShelfId": [101, 102, 161]}
			},
			"hotkey": {
				"module": "tencent_musicsoso_hotkey.HotkeyService",
				"method": "GetHotkeyForQQMusicMobile",
				"param": {"remoteplace": "txt.miniapp.wxada7aab80ba27074", "searchid": "1559616839293"}
			}
		},
		cgiKey: 'GetHomePage'
	}
	return axios.get(url, {
		params: data
	}).then(res => {
		return Promise.resolve(res.data)
	})
}

export function Search(query, page, num, zhida) {
	const url = '/api/getSearch'
	const data = {
		ct: 24,
		qqmusic_ver: 1298,
		new_json: 1,
		remoteplace: 'txt.yqq.song',
		searchid: 65026303157127701,
		t: 0,
		aggr: 1,
		cr: 1,
		catZhida: zhida ? 1 : 0,
		lossless: 0,
		flag_qc: 0,
		p: page,
		n: num,
		w: query,
		g_tk: 2064441524,
		loginUin: 1052670316,
		hostUin: 0,
		format: 'json',
		inCharset: 'utf8',
		outCharset: 'utf-8',
		notice: 0,
		platform: 'yqq.json',
		needNewCode: 0,
	}
	return axios.get(url, {
		params: data
	}).then(res => {
		return Promise.resolve(res.data)
	})
}
