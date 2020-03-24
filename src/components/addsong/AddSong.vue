<template>
  <transition name="slide" appear>
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <div class="title">添加歌曲到列表</div>
        <div class="close">
          <i @click="hide" class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" placeholder="搜索歌曲" @query="queryChange"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :switches="switches" :current-index="currentIndex" @switch="switchItem"></switches>
        <div class="list-wrapper">
          <scroll ref="songList" class="list-scroll" v-if="currentIndex === 0" :data="playHistory">
            <div class="list-inner">
              <song-list :songs="playHistory" @select="selectSong_"></song-list>
            </div>
          </scroll>
          <scroll ref="searchList" class="list-scroll" v-if="currentIndex === 1" :data="searchHistory">
            <div class="list-inner">
              <search-list @delete="deleteSearchHistory" @select="selectHistory" :searches="searchHistory"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest :query="query" :show-singer="showSinger" :loading="false" @select="selectSuggest"
                 @listScroll="blurInput"></suggest>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">成功添加歌曲当前歌曲当播放队列</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script>
import SearchBox from "../../base/searchbox/SearchBox";
import SongList from "../songlist/SongList";
import Scroll from "../../base/scroll/Scroll";
import Suggest from "../../views/search/childcpn/Suggest";
import Switches from "../../base/switches/Switches";
import SearchList from "../../base/searchlist/SearchList";
import TopTip from "../../base/toptip/TopTip";

import {Song} from "../../assets/js/myClass";
import {searchMixin} from "../../assets/js/mixin";
import {mapGetters, mapActions} from 'vuex'

export default {
	name: "AddSong",
	mixins: [searchMixin],
	components: {
		SearchBox,
		SongList,
		Scroll,
		Suggest,
		Switches,
    SearchList,
    TopTip
	},
	computed: {
		...mapGetters([
			'playlist',
			'playHistory'
		])
	},
	data() {
		return {
			showFlag: false,
			showSinger: false,
			currentIndex: 0,
			switches: [
				{name: '最近播放'},
				{name: '搜索历史'}
			]
		}
	},
	methods: {
		show() {
			this.showFlag = true
      setTimeout(()=>{
      	if(this.currentIndex === 0){
      		this.$refs.songList.refresh()
        }else{
      		this.$refs.searchList.refresh()
        }
      },20)
		},
		hide() {
			this.showFlag = false
		},
		selectSuggest() {
			this.saveSearch()
      this.showTip()
		},
		switchItem(index) {
			this.currentIndex = index
		},
		selectSong_(song, index) {
			if (index !== 0) {
				this.insertSong(new Song(song))
        this.showTip()
			}
		},
    showTip(){
	    this.$refs.topTip.show()
    },
		...mapActions([
			'insertSong'
		])
	}
}
</script>

<style scoped lang="stylus">
  @import "~assets/stylus/variable"
  @import "~assets/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background

    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s

    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)

    .header
      position: relative
      height: 44px
      text-align: center

      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text

      .close
        position: absolute
        top: 0
        right: 8px

        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px

    .shortcut

      .list-wrapper
        position: absolute
        top: 16.5rem
        bottom: 0
        width: 100%

        .list-scroll
          height: 100%
          overflow: hidden

          .list-inner
            padding: 2rem 3rem

    .search-result
      position: fixed
      top: 12.6rem
      bottom: 0
      width: 100%
      overflow hidden

    .tip-title
      text-align: center
      padding: 1.8rem 0
      font-size: 0

      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 0.4rem

      .text
        font-size: $font-size-medium
        color: $color-text
</style>

