import * as types from './mutation-types'
import {playMode} from "../assets/js/config";
import {saveSearch, deleteSearch, deleteAllSearch, savePlay, saveFavorite, deleteFavorite} from "../assets/js/cache";
import {shuffle} from "../assets/js/util";

export const selectPlay = function ({commit}, {list, index}) {
	commit(types.SET_SEQUENCE_LIST, list);
	commit(types.SET_PLAYLIST, list);
	commit(types.SET_CURRENT_INDEX, index);
	commit(types.SET_FULLSCREEN_STATE, true);
	commit(types.SET_PLAYING_STATE, true);
};

export const randomPlay = ({commit}, list) => {
	commit(types.SET_PLAY_MODE, playMode.random);
	commit(types.SET_SEQUENCE_LIST, list);
	console.log(list);
	let randomList = shuffle(list)
	commit(types.SET_PLAYLIST, randomList)
	commit(types.SET_CURRENT_INDEX, 0)
	commit(types.SET_FULLSCREEN_STATE, true)
	commit(types.SET_PLAYING_STATE, true)
}

export const insertSong = ({commit, state}, song) => {
	let playlist = state.playlist.slice()
	let sequenceList = state.sequenceList.slice()
	let currentIndex = state.currentIndex
	// 记录当前歌曲
	let currentSong = playlist[currentIndex]
	// 查找当前列表是否有待插入的歌曲
	let fpIndex = findIndex(playlist, song)
	// 因为是插入歌曲，所以索引加1
	currentIndex++
	// 插入这首歌到当前索引
	playlist.splice(currentIndex, 0, song)
	// 如果已经包含了这首歌
	if (fpIndex > -1) {
		// 如果当前插入的歌曲大于列表中的序号
		if (currentIndex > fpIndex) {
			playlist.splice(fpIndex, 1)
			currentIndex--
		} else {
			playlist.splice(fpIndex + 1, 1)
		}
	}
	let currentSIndex = findIndex(sequenceList, currentSong) + 1
	let fsIndex = findIndex(sequenceList, song)
	sequenceList.splice(currentSIndex, 0, song)
	if (fsIndex > -1) {
		if (currentSIndex > fsIndex) {
			sequenceList.splice(fsIndex, 1)
		} else {
			sequenceList.splice(fsIndex + 1, 1)
		}
	}
	commit(types.SET_PLAYLIST, playlist)
	commit(types.SET_SEQUENCE_LIST, sequenceList)
	commit(types.SET_CURRENT_INDEX, currentIndex)
	commit(types.SET_FULLSCREEN_STATE, true)
	commit(types.SET_PLAYING_STATE, true)
}

export function findIndex(list, song) {
	return list.findIndex(item => {
		return item.mid === song.mid
	})
}

export const saveSearchHistory = ({commit}, query) => {
	commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = ({commit}, query) => {
	commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const deleteAllSearchHistory = ({commit}) => {
	commit(types.SET_SEARCH_HISTORY, deleteAllSearch())
}

export const deleteSong = ({commit, state}, song) => {
	let sequenceList = state.sequenceList.slice()
	let playlist = state.playlist.slice()
	let currentIndex = state.currentIndex
	let sIndex = findIndex(sequenceList, song)
	let pIndex = findIndex(playlist, song)
	sequenceList.splice(sIndex, 1)
	playlist.splice(pIndex, 1)
	if (currentIndex > pIndex || currentIndex === sequenceList.length) {
		currentIndex--
	}
	commit(types.SET_CURRENT_INDEX, currentIndex)
	commit(types.SET_PLAYLIST, playlist)
	commit(types.SET_SEQUENCE_LIST, sequenceList)
	
	const playingState = playlist.length > 0
	commit(types.SET_PLAYING_STATE, playingState)
}

export const clearAllSongs = ({commit}) => {
	commit(types.SET_PLAYING_STATE, false)
	commit(types.SET_PLAYLIST, [])
	commit(types.SET_SEQUENCE_LIST, [])
	commit(types.SET_CURRENT_INDEX, -1)
}

export const savePlayHistory = ({commit}, song) => {
	commit(types.SET_PLAY_HISTORY, savePlay(song))
}

export const saveFavoriteList = ({commit}, song) => { //添加一首歌曲到收藏
	commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export const deleteFavoriteList = ({commit}, song) => { // 取消一首歌曲收藏
	commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}
