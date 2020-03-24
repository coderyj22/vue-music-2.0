<template>
  <transition name="slide" appear>
    <music-list :rank="rank" :show="isShowList" :songs="songs" :title="this.topList.topTitle" :bg-img="bgImg"/>
  </transition>
</template>

<script>
import MusicList from "../musiclist/MusicList";

import {getMusicList} from "../../network/rank";
import {getvkey} from "../../network/singer";
import {createSong} from '../../assets/js/myClass'
import {mapGetters} from 'vuex'
import {ERR_OK} from "../../network/config";

export default {
	name: "TopList",
	components: {
		MusicList
	},
	computed: {
		title() {
			return this.topList.topTitle
		},
		bgImg() {
			// return this.topList.picUrl
      if(this.songs.length){
      	return this.songs[0].image
      }
		},
		...mapGetters([
			'topList'
		])
	},
	created() {
		this._getMusicList()
	},
	data() {
		return {
			songs: [],
      isShowList:false,
      rank:true
		}
	},
	methods: {
		_getMusicList() {
			if(!this.topList.id){
				this.$router.push('/rank')
				return
      }
			getMusicList(this.topList.id).then(res => {
				if (res.code === ERR_OK) {
					this.songs = this.normalizedSongs(res.songlist)
				}
			})
		},
		normalizedSongs(list) {
			let ret = []
			list.forEach((item, index) => {
				let musicData = item.data
				getvkey(musicData.songmid).then(res => {
					if (res.code === ERR_OK) {
						const purl = res.req_0.data.midurlinfo[0].purl
						if (purl) {
							ret.push(createSong(musicData, purl))
						}
						if (index === list.length - 1) {
							this.isShowList = true
						}
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
