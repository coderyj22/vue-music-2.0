<template>
  <div class="player" v-show="playlist.length>0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image" alt="">
        </div>
        <div class="top">
          <div class="back">
            <i class="icon-back" @click="clickBack"></i>
          </div>
          <h2 class="title">{{currentSong.name}}</h2>
          <h3 class="subtitle" @click="toSinger">{{currentSong.singer}}</h3>
<!--          <div class="volume-increment" @click="changeVolume(true)">+</div>-->
<!--          <div class="volume-decrement" @click="changeVolume(false)">-</div>-->
        </div>
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image" alt="">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric" class="current-lyric">
                <p ref="lyricLine"
                   :class="{'current':currentLineNum === index}"
                   class="text"
                   v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow === 'cd'}"/>
            <span class="dot" :class="{'active':currentShow === 'lyric'}"/>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChang="percentChang"/>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon icon-left">
              <i :class="iconMode" @click="changeMode"></i>
            </div>
            <div class="icon icon-left">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon icon-center">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon icon-right">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon icon-right">
              <i @click="toggleFavorite(currentSong)" :class="getFavoriteIcon(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="clickMini">
        <div class="icon">
          <img width="40" height="40" :src="currentSong.image" :class="cdCls" alt="">
        </div>
        <div class="detail">
          <h3 class="mini-song-name">{{currentSong.name}}</h3>
          <h4 class="mini-sing-name">{{currentSong.singer}}</h4>
        </div>
        <div class="control">
          <!--          <progress-circle>-->
          <i @click.stop="togglePlaying" class="mini-icon" :class="miniIcon"></i>
          <!--          </progress-circle>-->
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="mini-icon icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio ref="audio" @timeupdate="timeUpdate" :src="currentSong.url" @canplay="ready" @error="error"
           @ended="playEnd"></audio>
    <playlist ref="playlist"></playlist>
  </div>
</template>

<script>
import ProgressBar from "../../base/progressbar/ProgressBar";
import ProgressCircle from "../../base/progresscircle/ProgressCircle";
import Scroll from "../../base/scroll/Scroll";
import Playlist from "../playlist/Playlist";

import {mapGetters} from 'vuex'
import {mapMutations, mapActions} from 'vuex'
import {playMode} from "../../assets/js/config";
import {shuffle} from "../../assets/js/util";
import {playerModeMixin,favoriteMixin} from "../../assets/js/mixin";

import animations from 'create-keyframe-animation'
import LyricParser from 'lyric-parser'

export default {
	name: "Player",
	mixins: [playerModeMixin,favoriteMixin],
	components: {
		ProgressBar,
		ProgressCircle,
		Scroll,
		Playlist
	},
	computed: {
		...mapGetters([
			'fullScreen',
			'playing',
			'currentIndex'
		]),
		playIcon() {
			return this.playing ? 'icon-pause' : 'icon-play'
		},
		miniIcon() {
			return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
		},
		cdCls() {
			return this.playing ? 'play' : 'play pause'
		},
		percent() {
			return this.currentTime / this.currentSong.duration
		},
		iconMode() {
			return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
		}
	},
	watch: {
		currentSong(newSong, oldSong) {
			if (!newSong.mid) {
				return
			}
			if (newSong.mid === oldSong.mid) {
				return
			}
			if (this.mode === playMode.random) {
				let list = shuffle(this.sequenceList)
				this.resetCurrentIndex(list)
				this.setPlaylist(list)
			}
			if (this.currentLyric) {
				this.currentLyric.stop()
			}
			this.$nextTick(() => {
				this.$refs.audio.play()
				this.currentSong._getSongLyric()
				this.getLyric()
			})
		},
		playing(newPlaying) {
			const audio = this.$refs.audio
			this.$nextTick(() => {
				newPlaying ? audio.play() : audio.pause()
			})
		}
	},
	data() {
		return {
			canPlay: false,
			currentTime: 0,
			currentLyric: null,
			currentLineNum: 0,
			currentShow: 'cd',
			playingLyric: null,
			volume: 1.0
		}
	},
	created() {
		this.touch = {}
	},
	methods: {
		changeVolume(flag) {
			if (flag) {
				this.volume += 0.1

			} else {
				this.volume -= 0.1
			}
			this.volume = Math.max((Math.min(1, this.volume)), 0)
			console.log(this.volume);
			this.$refs.audio.volume = this.volume

		},
		getLyric() {
			this.currentSong._getSongLyric().then(lyric => {
				this.currentLyric = new LyricParser(lyric, this.handleLyric)
				if (this.playing) {
					this.currentLyric.play()
				}
			}).catch(() => {
				this.currentLyric = null
				this.playingLyric = '抱歉!暂无歌词'
				this.currentLineNum = 0
			})
		},
		handleLyric({lineNum, txt}) {
			this.currentLineNum = lineNum
			if (lineNum > 5) {
				let lineEl = this.$refs.lyricLine[lineNum - 5]
				this.$refs.lyricList.scrollToElement(lineEl, 1000)
			} else {
				this.$refs.lyricList.scrollTo(0, 0, 1000)
			}
			this.playingLyric = txt
		},
		toSinger() {
			console.log('跳转到当前歌手页面');
			console.log(this.currentSong);
		},
		playEnd() {
			if (this.mode === playMode.loop) {
				this.loop()
			} else {
				this.next()
			}
		},
		loop() {
			this.$refs.audio.currentTime = 0
			this.$refs.audio.play()
			if (this.currentLyric) {
				this.currentLyric.seek(0)
			}
		},
		timeUpdate(e) {
			this.currentTime = e.target.currentTime
		},
		clickBack() {
			this.setFullScreen(false)
		},
		clickMini() {
			this.setFullScreen(true)
		},
		prev() {
			if (!this.canPlay) {
				return
			}
			if (this.playlist.length === 1) {
				this.loop()
			} else {
				let index = this.currentIndex - 1
				if (index === -1) {
					index = this.playlist.length - 1
				}
				if (!this.playing) {
					this.togglePlaying()
				}
				this.setCurrentIndex(index)
			}
			this.canPlay = false
		},
		next() {
			if (!this.canPlay) {
				return
			}
			if (this.playlist.length === 1) {
				this.loop()
			} else {
				let index = this.currentIndex + 1
				if (index === this.playlist.length) {
					index = 0
				}
				if (!this.playing) {
					this.togglePlaying()
				}
				this.setCurrentIndex(index)
			}
			this.canPlay = false
		},
		ready() {
			this.canPlay = true
			this.savePlayHistory(this.currentSong)
		},
		error() {
			this.canPlay = true
		},
		enter(el, done) {
			const {x, y, scale} = this._getPosAndScale()
			let animation = {
				'0%': {
					transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
				},
				'60%': {
					transform: `translate3d(0,0,0) scale(1.1)`
				},
				'100%': {
					transform: `translate3d(0,0,0) scale(1)`
				}
			}
			animations.registerAnimation({
				name: 'move',
				animation,
				presets: {
					duration: 500,
					easing: 'linear'
				}
			})
			animations.runAnimation(this.$refs.cdWrapper, 'move', done)
			this.$refs.cdWrapper.addEventListener('transitionend', done)
		},
		afterEnter() {
			animations.unregisterAnimation('move')
			this.$refs.cdWrapper.style.animation = ''
		},
		leave(el, done) {
			const {x, y, scale} = this._getPosAndScale()
			this.$refs.cdWrapper.style.transition = 'all 0.5s'
			this.$refs.cdWrapper.style['transform'] = `translate3d(${x}px,${y}px,0) scale(${scale})`
			this.$refs.cdWrapper.addEventListener('transitionend', done)
		},
		afterLeave() {
			this.$refs.cdWrapper.style.transition = ''
			this.$refs.cdWrapper.style.transform = ''
		},
		_getPosAndScale() {
			const targetWidth = 40
			const paddingLeft = 40
			const paddingBottom = 30
			const paddingTop = 80
			const width = window.innerWidth * 0.8
			const scale = targetWidth / width
			const x = -(window.innerWidth / 2 - paddingLeft)
			const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
			return {
				x,
				y,
				scale
			}
		},
		togglePlaying() {
			if (!this.canPlay) {
				return
			}
			if (this.currentLyric) {
				this.currentLyric.togglePlay()
			}
			this.setPlaying(!this.playing)
		},
		percentChang(percent) {
			const currentTime = percent * this.currentSong.duration
			this.$refs.audio.currentTime = currentTime
			if (!this.playing) {
				this.togglePlaying()
			}
			if (this.currentLyric) {
				this.currentLyric.seek(currentTime * 1000)
			}
		},
		format(interval) {
			interval = interval | 0
			const minute = interval / 60 | 0
			const second = this._pad(interval % 60)
			return `${minute}:${second}`
		},
		_pad(num, n = 2) {
			let len = num.toString().length
			while (len < n) {
				num = '0' + num
				len++
			}
			return num
		},
		middleTouchStart(e) {
			this.touch.initiated = true
			const touch = e.touches[0]
			this.touch.startX = touch.pageX
			this.touch.startY = touch.pageY
		},
		middleTouchMove(e) {
			if (!this.touch.initiated) {
				return
			}
			const touch = e.touches[0]
			this.touch.deltaX = touch.pageX - this.touch.startX
			this.touch.deltaY = touch.pageY - this.touch.startY
			if (Math.abs(this.touch.deltaY) > Math.abs(this.touch.deltaX)) {
				// console.log('deltaY > deltaX return')
				return
			}
			const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
			const width = Math.min(0, Math.max(-window.innerWidth, left + this.touch.deltaX))
			console.log(width);
			this.touch.percent = Math.abs(width / window.innerWidth)
			this.$refs.lyricList.$el.style['transform'] = `translate3d(${width}px, 0, 0)`
			this.$refs.lyricList.$el.style['transitionDuration'] = `0`
			this.$refs.middleL.style.opacity = 1 - this.touch.percent
			this.$refs.middleL.style['transitionDuration'] = `0`
		},
		middleTouchEnd(e) {
			this.touch.initiated = false
			let offsetWidth
			let opacity
			if (this.currentShow === 'cd') {
				if (this.touch.percent > 0.1) {
					offsetWidth = -window.innerWidth
					this.currentShow = 'lyric'
					opacity = 0
				} else {
					offsetWidth = 0
					opacity = 1
				}
				// this.$refs.lyricList.$el.
			} else {
				if (this.touch.percent < 0.9) {
					offsetWidth = 0
					this.currentShow = 'cd'
					opacity = 1
				} else {
					offsetWidth = -window.innerWidth
					opacity = 0
				}
			}

			this.$refs.lyricList.$el.style['transform'] = `translate3d(${offsetWidth}px, 0, 0)`
			this.$refs.lyricList.$el.style['transitionDuration'] = '300ms'
			this.$refs.middleL.style.opacity = opacity
			this.touch = {}
			this.touch.initated = false
		},
		showPlaylist() {
			this.$refs.playlist.show()
		},
		...mapMutations({
			setFullScreen: 'SET_FULLSCREEN_STATE',
			setPlaying: 'SET_PLAYING_STATE',
		}),
		...mapActions([
			'savePlayHistory'
		])
	},
}
</script>

<style scoped lang="stylus">
  @import "~assets/stylus/variable"
  @import "~assets/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background

      .background
        position absolute
        top: 0
        bottom: 0
        width 100%
        height 100%
        z-index -1
        opacity 0.6
        filter blur(2rem)

      .top
        position relative
        margin-bottom 2.5rem

        .back
          position absolute
          left 1.5rem
          top: 0.5rem
          z-index 50

          .icon-back
            display inline-block
            padding 0.9rem
            font-size: 2.2rem
            color $color-theme
            transform rotate(-90deg)

        .title
          height 4rem
          line-height 4rem
          text-align center
          width 70%
          margin 0 auto
          no-wrap()
          color $color-text
          font-size: $font-size-large

        .subtitle
          line-height: 2rem;
          text-align: center;
          color: $color-text;
          height 2rem
          font-size $font-size-medium

        .volume-increment
          display inline-block
          width 50px
          height: 50px

        .volume-decrement
          width 50px
          height: 50px
          display inline-block


      .middle
        position: fixed;
        width: 100%;
        top: 8rem;
        bottom: 17rem;
        white-space: nowrap;
        font-size: 0;

        .middle-l
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;

          .cd-wrapper
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            box-sizing: border-box;
            height: 100%;

            .cd
              width: 100%
              height: 100%
              border-radius: 50%

              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                box-sizing: border-box
                border-radius: 50%
                border: 10px solid $color-text-min

              &.play
                animation: rotate 20s linear infinite

              &.pause
                animation-play-state: paused


          .playing-lyric-wrapper
            width 80%
            margin 3rem auto 0 auto
            overflow hidden
            text-align center

            .playing-lyric
              height 2rem
              line-height 2rem
              font-size $font-size-medium
              color $color-text-standard


        .middle-r
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;

          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center

            .current-lyric
              .text
                line-height: 32px
                color: $color-text-m
                font-size: $font-size-medium

                &.current
                  color: $color-text

              .pure-music
                padding-top: 50%
                line-height: 32px
                color: $color-text-l
                font-size: $font-size-medium

            .no-lyric
              height 2rem


      .bottom
        position absolute
        bottom 5rem
        width 100%

        .dot-wrapper
          text-align: center;
          font-size: 0;

          .dot
            display inline-block
            width 0.8rem
            height 0.8rem
            vertical-align: middle;
            margin: 0 0.4rem;
            border-radius: 50%;
            background: $color-text-m

            &.active
              width 2rem
              border-radius 0.5rem
              background-color: $color-text-l

        .progress-wrapper
          display: flex;
          align-items: center;
          width: 80%;
          margin: 0 auto;
          padding: 1rem 0;

          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 3rem
            height 3rem
            line-height: 3rem
            width: 3rem

            &.time-l
              text-align: left
              margin-right 0.5rem

            &.time-r
              text-align: right
              margin-left: 0.5rem


          .progress-bar-wrapper
            flex: 1

        .operators
          display flex
          align-items center

          .icon
            flex 1
            color $color-theme

          .icon-left
            text-align right
            font-size: 3rem

          .icon-center
            font-size: 4rem
            text-align center
            padding 0 2rem

          .icon-right
            font-size: 3rem


      &.normal-enter-active, &.normal-leave-active
        transition all 0.5s

        .top, .bottom
          transition all 0.5s cubic-bezier(0.86, 0.18, 0.82, 1.32)

      &.normal-enter, &.normal-leave-to
        opacity 0

        .top
          transform translate3d(0, -100px, 0)

        .bottom
          transform translate3d(0, 100px, 0)

    .mini-player
      position fixed
      display flex
      align-items center
      left 0
      right 0
      bottom 0
      height 6rem
      background-color: $color-highlight-background
      z-index 190
      width 100%

      &.mini-enter-active, &.mini-leave-active
        transition all 0.5s

      &.mini-enter, &.mini-leave-to
        opacity 0

      .icon
        width 4rem
        height 4rem
        flex 0 0 4rem
        padding-right 1rem
        padding-left 2rem

        img
          border-radius 50%

          &.play
            animation: rotate 15s linear infinite

          &.pause
            animation-play-state: paused

      // 动画暂停

      .detail
        flex 1
        line-height 2rem
        display flex
        overflow hidden
        flex-direction column
        justify-content centers

        .mini-song-name
          no-wrap()
          font-size: $font-size-medium
          color: $color-text

        .mini-sing-name
          no-wrap()
          font-size: $font-size-small
          color: $color-text-x


      .control
        flex 0 0 3rem
        width 3rem
        height 3rem
        padding 0 1rem

        .mini-icon
          font-size 3rem
          color $color-theme-d


  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
