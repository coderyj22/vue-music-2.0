import {mapActions, mapGetters, mapMutations} from 'vuex'
import {playMode} from "./config";
import {shuffle} from "./util";

export const playlistMixin = {
	computed: {
		...mapGetters([
			'playlist'
		])
	},
	watch: {
		playlist(newList) {
			this.handlePlaylist(newList)
		}
	},
	mounted() {
		this.handlePlaylist(this.playlist)
	},
	activated() {
		this.handlePlaylist(this.playlist)
	},
	methods: {
		handlePlaylist() {
			throw new Error('component must implement handlePlaylist method')
		}
	}
}

export const playerModeMixin = {
	computed: {
		iconMode() {
			return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
		},
		...mapGetters([
			'sequenceList',
			'mode',
			'playlist',
			'currentSong'
		])
	},
	methods: {
		changeMode() {
			const mode = (this.mode + 1) % 3
			this.setPlayMode(mode)
			let list = null
			if (mode === playMode.random) {
				list = shuffle(this.sequenceList)
			} else {
				list = this.sequenceList
			}
			this.resetCurrentIndex(list)
			this.setPlaylist(list)
		},
		resetCurrentIndex(list) {
			let index = list.findIndex(item => {
				return item.mid === this.currentSong.mid
			})
			this.setCurrentIndex(index)
		},
		...mapMutations({
			setPlaylist: "SET_PLAYLIST",
			setCurrentIndex: 'SET_CURRENT_INDEX',
			setPlayMode: 'SET_PLAY_MODE'
		})
	}
}

export const searchMixin = {
	computed: {
		...mapGetters([
			'searchHistory'
			
		])
	},
	data() {
		return {
			query: ''
		}
	},
	methods: {
		blurInput() {
			this.$refs.searchBox.blur()
		},
		saveSearch() {
			this.saveSearchHistory(this.query)
		},
		queryChange(query) {
			this.query = query
		},
		selectHistory(item) {
			this.$refs.searchBox.setQuery(item)
		},
		selectSong(item) {
			console.log(item);
			this.$refs.searchBox.setQuery(item.title)
		},
		...mapActions([
			'saveSearchHistory',
			'deleteSearchHistory'
		]),
	}
}

export const favoriteMixin = {
	computed:{
		...mapGetters([
			'favoriteList'
		])
	},
	methods:{
		toggleFavorite(song){
			if(this.isFavorite(song)){
				this.deleteFavoriteList(song)
			}else{
				this.saveFavoriteList(song)
			}
		},
		getFavoriteIcon(song){
			return this.isFavorite(song) ? 'icon-like' : 'icon-not-like'
		},
		isFavorite(song){
			const index = this.favoriteList.findIndex(item => {
				return item.mid === song.mid
			})
			return index > -1
		},
		...mapActions([
			'saveFavoriteList',
			'deleteFavoriteList'
		])
	}
}
