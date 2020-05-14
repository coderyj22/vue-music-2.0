import {commonParams} from "./config";
import axios from "axios";

export function getSingers() {
  const url = '/api/getSingers'

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    g_tk: 1664029744
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getSingerDetail(singermid,begin,end) {
  const url = '/api/getSingerDetail'
  const data = Object.assign({}, commonParams, {
    g_tk: 1664029744,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: "listen",
    begin: begin,
    num: end,
    songstatus: 1,
    singermid: singermid
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getvkey(songmid) {
  const url = '/api/getSongvkey'
  const data = Object.assign({},commonParams,{
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    data: `{"req":{"module":"CDN.SrfCdnDispatchServer","method":"GetCdnDispatch","param":{"guid":"1316275760","calltype":0,"userip":""}},"req_0":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey","param":{"guid":"1316275760","songmid":["${songmid}"],"songtype":[0],"uin":"0","loginflag":1,"platform":"20"}},"comm":{"uin":0,"format":"json","ct":24,"cv":0}}`
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getSongLyric(songId) {
  const url = '/api/getSongLyric'
  const data = Object.assign({}, commonParams, {
    pcachetime: 1578297556315,
    songmid: songId,
    g_tk: 2064441524,
    loginUin: 1052670316,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf - 8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0,
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
