<template>
  <transition name="slide" appear>
    <music-list :desc="desc" :show="isShowList" :songs="songs" :title="title" :bg-img="bgImg"
                :sub-title="subTitle"></music-list>
  </transition>
</template>

<script>
import MusicList from "../musiclist/MusicList";

import {getSongList} from "../../network/recommend";
import {mapGetters} from 'vuex'
import {ERR_OK} from "../../network/config";
import {getvkey} from "../../network/singer";
import {createSongRec} from "../../assets/js/myClass";

export default {
	name: "Disc",
	components: {
		MusicList
	},
	computed: {
		title() {
			return this.disc.title
		},
		bgImg() {
			return this.disc.cover
		},
		subTitle() {
			return this.disc.username
		},
		...mapGetters([
			'disc'
		])
	},
	created() {
		this._getSongList()
	},
	mounted() {

	},
	data() {
		return {
			songs: [],
			desc: '',
			isShowList: false
		}
	},
	methods: {
		_getSongList() {
			if (!this.disc.content_id) {
				this.$router.push('/recommend')
			}
			getSongList(this.disc.content_id).then(res => {
				if (res.code === ERR_OK) {
					this.desc = res.cdlist[0].desc
					this.songs = this._normalizeSongs(res.cdlist[0].songlist)
				}
			})
		},
		_normalizeSongs(list) {
			let ret = []
			list.forEach((item, index) => {
				const {mid} = item
				getvkey(mid).then(res => {
					const purl = res.req_0.data.midurlinfo[0].purl
					if (purl) {
						// console.log(purl);
						ret.push(createSongRec(item, purl))
					}
					if (index === list.length - 1) {
						this.isShowList = true
					}

				})
			})
			return ret
		}
	}
}
</script>

<style scoped lang="stylus">
  .slide-enter-active, .slide-leave-active
    transition all 0.4s

  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
