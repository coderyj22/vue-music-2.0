import storage from 'good-storage'

const SEARCH_KEY = "__search__"
const SEARCH_MAX_LENGTH = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LEN = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LEN = 200

export function saveSearch(query) {
	let searches = storage.get(SEARCH_KEY, [])
	insertArray(searches, query, (item) => {
		return item === query
	}, SEARCH_MAX_LENGTH)
	storage.set(SEARCH_KEY, searches)
	return searches
}

function insertArray(arr, val, compare, maxLen) {
	const index = arr.findIndex(compare)
	if (index === 0) {
		return
	}
	if (index > 0) {
		arr.splice(index, 1)
	}
	arr.unshift(val)
	if (maxLen && arr.length > maxLen) {
		arr.pop()
	}
}

export function loadSearch() {
	return storage.get(SEARCH_KEY, [])
}

export function deleteSearch(query) {
	let searches = storage.get(SEARCH_KEY, [])
	deleteFromArray(searches, (item) => {
		return item === query
	})
	storage.set(SEARCH_KEY, searches)
	return searches
}

function deleteFromArray(arr, compare) {
	const index = arr.findIndex(compare)
	if (index > -1) {
		arr.splice(index, 1)
	}
}

export function deleteAllSearch() {
	storage.remove(SEARCH_KEY)
	return []
}

export function savePlay(song) {  // 存入本地播放
	let songs = storage.get(PLAY_KEY, [])
	insertArray(songs, song, (item) => {
		return item.mid === song.mid
	}, PLAY_MAX_LEN)
	storage.set(PLAY_KEY, songs)
	return songs
}

export function loadPlay() {  // 读取本地播放
	return storage.get(PLAY_KEY, [])
}

export function saveFavorite(song) {
	let songs = storage.get(FAVORITE_KEY, [])
	insertArray(songs, song, item => {
		return song.mid === item.mid
	}, FAVORITE_MAX_LEN)
	storage.set(FAVORITE_KEY, songs)
	return songs
}

export function deleteFavorite(song) {
	let songs = storage.get(FAVORITE_KEY, [])
	deleteFromArray(songs, item => {
		return item.mid === song.mid
	})
	storage.set(FAVORITE_KEY, songs)
	return songs
}

export function loadFavorite() {
	return storage.get(FAVORITE_KEY, [])
}

