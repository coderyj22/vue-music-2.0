<template>
  <transition name="slide">
    <div class="profile">
      <div class="back" @click="clickBack">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches :switches="switches" :current-index="currentIndex" @switch="selectItem"></switches>
      </div>
      <div class="play-btn" ref="playBtn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll class="list-scroll" ref="favoriteList" v-if="currentIndex === 0" :data="favoriteList">
          <div class="list-inner">
            <song-list :songs="favoriteList" @select="selectSong"></song-list>
          </div>
        </scroll>
        <scroll class="list-scroll" ref="playList" v-if="currentIndex === 1" :data="playHistory">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectSong"></song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultTitle"></no-result>
      </div>
    </div>
  </transition>
</template>

<script>

import Switches from "../../base/switches/Switches";
import Scroll from "../../base/scroll/Scroll";
import SongList from "../songlist/SongList";
import NoResult from "../../base/noresult/NoResult";
import {Song} from "../../assets/js/myClass";

import {mapGetters, mapActions} from 'vuex'
import {playlistMixin} from "../../assets/js/mixin";
import {currentIndex} from "../../store/getters";

export default {
	name: "Profile",
	mixins: [playlistMixin],
	components: {
		Switches,
		Scroll,
		SongList,
		NoResult
	},
	computed: {
		noResult() {
			if (this.currentIndex === 0) {
				return !this.favoriteList.length
			} else {
				return !this.playHistory.length
			}
		},
    noResultTitle(){
			if(this.currentIndex === 0){
				return '暂无收藏歌曲'
      }else{
				return '最近还没听过歌曲'
      }
    },
		...mapGetters([
			'favoriteList',
			'playHistory'
		])
	},
	data() {
		return {
			switches: [
				{name: '我喜欢的'},
				{name: '最近收听'}
			],
			currentIndex: 0
		}
	},
	methods: {
		clickBack() {
			this.$router.back()
		},
		selectItem(index) {
			this.currentIndex = index
		},
		selectSong(song) {
			this.insertSong(new Song(song))
		},
		random() {
			let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
			if(list.length === 0){
				return
      }
			list = list.map(item => {
				return new Song(item)
			})
			this.randomPlay(list)
		},
		handlePlaylist(playlist) {
			const bottom = playlist.length > 0 ? '60px' : '0'
			this.$refs.listWrapper.style.bottom = bottom
			this.$refs.favoriteList && this.$refs.favoriteList.refresh()
			this.$refs.playList && this.$refs.playList.refresh()
		},
		...mapActions([
			'insertSong',
			'randomPlay'
		])
	}
}
</script>

<style scoped lang="stylus">
  @import "~assets/stylus/variable"
  @import "~assets/stylus/mixin"
  .profile
    position fixed
    top: 0
    bottom: 0
    width 100%
    z-index 100
    background-color: $color-background

    &.slide-enter-active, &.slide-leave-active
      transition all 0.3s

    &.slide-enter, &.slide-leave-to
      transform translate3d(100%, 0, 0)

    .back
      position absolute
      top: 1.6rem
      left 0.5rem

      .icon-back
        padding 1rem
        font-size 2rem
        color $color-theme


    .switches-wrapper
      margin-top 1rem
      margin-bottom 3rem

    .play-btn
      width 13.5rem
      margin 0 auto
      text-align center
      padding 0.7rem
      border 0.1rem solid hsla(0, 0%, 100%, .5)
      border-radius 5rem
      font-size: 0
      color: hsla(0, 0%, 100%, .5);

      .icon-play
        margin-right 1rem
        font-size: $font-size-medium-l
        vertical-align middle
        display inline-block

      .text
        font-size $font-size-small
        vertical-align middle
        display inline-block

    .list-wrapper
      position absolute
      top 11rem
      bottom: 0
      width 100%

      .list-scroll
        height 100%
        overflow hidden

        .list-inner
          padding 2rem 3rem

    .no-result-wrapper
      position absolute
      top: 50%
      left 50%
      transform translate3d(-50%,-50%,0)
</style>
