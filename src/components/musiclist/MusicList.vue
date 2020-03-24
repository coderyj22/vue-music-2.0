<template>
  <div class="music-list">
    <div class="back" @click="clickBack">
      <i class="icon icon-back"/>
    </div>
    <h1 class="title">{{title}}</h1>
    <h2 class="sub-title" v-if="subTitle && subTitle.length" ref="subTitle">{{subTitle}}</h2>
    <h3 class="desc" v-if="desc" ref="desc" @click="clickDesc">简介: {{desc}}</h3>
    <div class="bg-img" :style="bgStyle" ref="bgImage">
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll :data="songs" class="list" ref="list" @scroll="scroll" :probe-type="3">
      <div class="song-list-wrapper">
        <song-list :rank="rank" v-show="show" @select="selectItem" :songs="songs"/>
      </div>
      <loading class="loading" v-show="!show"/>
    </scroll>
  </div>
</template>

<script>
import Scroll from "../../base/scroll/Scroll";
import SongList from "../songlist/SongList";
import Loading from 'base/loading/Loading'

import {playlistMixin} from "../../assets/js/mixin";
import {mapActions} from 'vuex'

const RESERVED_HEIGHT = 60

export default {
	name: "MusicList",
	mixins: [playlistMixin],
	components: {
		Scroll,
		SongList,
		Loading
	},
	props: {
		bgImg: {
			type: String,
			default: ''
		},
		songs: {
			type: Array,
			default() {
				return []
			}
		},
		title: {
			type: String,
			default: ""
		},
		subTitle: {
			type: String,
			default: ''
		},
		show: {
			type: Boolean,
			default: false
		},
		desc: {
			type: String,
			default: ''
		},
		rank: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		bgStyle() {
			return `background-image:url(${this.bgImg})`
		}
	},
	data() {
		return {
			scrollY: 0
		}
	},
	mounted() {
		this.imageHeight = this.$refs.bgImage.clientHeight
		this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
		this.$refs.list.$el.style.top = `${this.imageHeight}px`
	},
	watch: {
		scrollY(newY) {
			let zIndex = 0
			let scale = 1
			let blur = 0
			let translateY = Math.max(newY, this.minTranslateY)
			this.$refs.layer.style['transform'] = `translate3d(0, ${translateY}px, 0)`
			const percent = Math.abs(newY / this.imageHeight)
			if (newY > 0) {
				scale += percent
				zIndex = 10
			} else {
				blur = Math.min(20 * percent, 20)
			}
			this.$refs.filter.style['backdrop-filter'] = `blur(${blur}px)`
			if (newY < this.minTranslateY) {
				zIndex = 10
				this.$refs.bgImage.style.paddingTop = 0
				this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
			} else {
				this.$refs.bgImage.style.paddingTop = '80%'
				this.$refs.bgImage.style.height = 0
			}
			this.$refs.bgImage.style.zIndex = zIndex
			this.$refs.bgImage.style['transform'] = `scale(${scale})`
			this.desc ? this.$refs.desc.style.opacity = Math.max(0, 1 - percent * 10) : ''
			this.subTitle ? this.$refs.subTitle.style.opacity = Math.max(0, 1 - percent / 0.75) : ''
		}
	},
	methods: {
		scroll(pos) {
			this.scrollY = pos.y
		},
		clickBack() {
			this.$router.back()
		},
		selectItem(item, index) {
			this.selectPlay({
				list: this.songs,
				index: index
			})
		},
		handlePlaylist(playlist) {
			const bottom = playlist.length > 0 ? '60px' : ''
			this.$refs.list.$el.style.bottom = bottom
			this.$refs.list.refresh()
		},
		clickDesc() {
			console.log('clickDesc');
		},
		...mapActions([
			'selectPlay'
		])
	}
}
</script>

<style scoped lang="stylus">
  @import "~assets/stylus/variable"
  @import "~assets/stylus/mixin"
  .music-list
    position fixed
    top: 0
    bottom: 0
    width 100%
    height 100%
    z-index 100
    background-color $color-background

    .back
      position absolute
      left 1rem
      top 1rem
      z-index 11

      .icon
        display block
        padding 1rem
        font-size: 2.2rem
        color $color-theme

    .title
      position: absolute
      z-index 11
      width: 70%
      text-align center
      left 15%
      line-height 4rem
      height 4rem
      font-size: $font-size-large
      margin-top 1rem
      no-wrap()

    .sub-title
      color $color-text-m
      font-size $font-size-medium
      position absolute
      width 70%
      left 15%
      height 2rem
      line-height 2rem
      margin-top 5rem
      text-align center
      z-index 11
      no-wrap()

    .desc
      position absolute
      width: 60%
      left 20%
      margin-top 70%
      z-index 11
      color $color-text-standard-l
      font-size $font-size-medium
      line-height 2rem
      height 2rem
      no-wrap()

    .bg-img
      position relative
      height 0
      width: 100%
      padding-top 80%
      background-size cover

      .filter
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(7, 17, 27, 0.4);

    .bg-layer
      position relative
      height 100%
      background-color: $color-background


    .list
      position fixed
      width: 100%
      bottom: 0
      top: 0
      background-color: #222

      .song-list-wrapper
        padding 0 3rem

      .loading
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
