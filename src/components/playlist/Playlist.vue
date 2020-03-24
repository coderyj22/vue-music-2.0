<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="wrapper-title">
          <div class="icon">
            <i :class="iconMode" @click="changeMode"></i>
          </div>
          <div class="txt">{{txt}}</div>
          <div class="clear">
            <i class="icon-clear" @click="clearAll"></i>
          </div>
        </div>
        <scroll class="wrapper-scroll" ref="scroll" :data="sequenceList">
          <transition-group name="list" tag="ul" class="wrapper-songs">
            <li :key="song.mid" ref="listItem" class="item" v-for="(song,index) in sequenceList">
              <div class="item-name" @click="selectSong(song,index)">
                <div class="name">{{song.name}} - {{song.singer}}</div>
                <div class="current" v-show="song.mid === currentSong.mid">
                  <img src="./playing.png" alt="">
                </div>
              </div>
              <div class="item-control">
                <i class="icon" :class="getFavoriteIcon(song)" @click.stop="toggleFavorite(song)"></i>
                <i class="icon icon-close" @click.stop="deleteOne(song)"></i>
              </div>
            </li>
          </transition-group>
        </scroll>
        <div class="wrapper-add">
          <div class="add-btn" @click="addSong">+添加歌曲到队列</div>
        </div>
        <div class="wrapper-close" @click="hide">关闭</div>
      </div>
      <confirm ref="confirm" title="确定清空所有歌曲?" @selectConfirm="selectConfirm"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script>
import Scroll from "../../base/scroll/Scroll";
import Confirm from "../../base/confirm/Confirm";
import AddSong from "../addsong/AddSong";

import {playerModeMixin,favoriteMixin} from "../../assets/js/mixin";
import {playMode} from "../../assets/js/config";
import {mapMutations, mapActions} from 'vuex'

export default {
	name: "Playlist",
	mixins: [playerModeMixin,favoriteMixin],
	components: {
		Scroll,
		Confirm,
    AddSong
	},
	data() {
		return {
			showFlag: false,
		}
	},
	computed: {
		txt(){
			return this.mode === playMode.random ? '随机播放' : this.mode === playMode.sequence ? "顺序播放" : "单曲循环"
    }
	},
	watch: {
		playlist() {
			if (this.playlist.length === 0) {
				this.showFlag = false
			}
		}
	},
	methods: {
		show() {
			this.showFlag = true
			setTimeout(() => {
				this.$refs.scroll.refresh()
			}, 20)
		},
		hide() {
			this.showFlag = false
		},
		icon(item) {
			return item.mid === this.currentSong.mid ? './playing.png' : ''
		},
		selectSong(song, index) {
			if (this.mode === playMode.random) {
				index = this.playlist.findIndex(item => {
					return item.mid === song.mid
				})
			}
			this.setCurrentIndex(index)
			this.setPlayingState(true)
		},
		deleteOne(item) {
			this.deleteSong(item)
			if (!this.playlist.length) {
				this.showFlag = false
			}
		},
		clearAll() {
			this.$refs.confirm.show()
		},
		selectConfirm(flag) {
			if (flag) {
				this.clearAllSongs()
			}
			this.$refs.confirm.hide()
		},
    addSong(){
			this.$refs.addSong.show()
    },
		...mapMutations({
			setPlayingState: 'SET_PLAYING_STATE'
		}),
		...mapActions([
			'deleteSong',
			'clearAllSongs'
		])
	},
	updated() {
		this.$refs.scroll.refresh()
	}

}
</script>

<style scoped lang="stylus">
  @import "~assets/stylus/variable"
  @import "~assets/stylus/mixin"
  .playlist
    position fixed
    top: 0
    bottom: 0
    width 100%
    z-index 191
    background-color: $color-background-d

    &.list-fade-enter-active, &.list-fade-leave-active
      transition opacity 0.3s

      .list-wrapper
        transition all 0.3s

    &.list-fade-enter, &.list-fade-leave-to
      opacity 0

      .list-wrapper
        transform translate3d(0, 100%, 0)

    &.list-fade-enter
    .list-wrapper
      position absolute
      left 0
      bottom: 0
      width 100%
      background-color: $color-highlight-background

      .wrapper-title
        display flex
        padding 1rem 2rem
        align-items center
        height 4rem

        .icon
          flex 0 0 2.5rem
          font-size 2.5rem
          color $color-theme

        .txt
          flex 1
          padding-left 2rem
          font-size $font-size-medium
          color $color-text-standard

        .clear
          flex 0 0 2rem
          font-size: 1.5rem
          color $color-text-m

          .icon-clear
            padding 0.5rem

      .wrapper-scroll
        max-height 25rem
        overflow hidden

        .wrapper-songs
          .item
            padding 1rem 2rem
            display flex
            border-top 0.1rem solid $color-text-x

            &.list-enter-active, &.list-leave-active
              transition all 0.3s linear

            &.list-enter, &.list-leave-to
              opacity 0

            .item-name
              font-size $font-size-medium
              flex 1
              color $color-text-m
              display flex
              margin-right 2rem

              .name
                line-height 1.8rem

              .current
                margin-left 1rem

                img
                  width 1.8rem
                  height 1.8rem

            .item-control
              flex 0 0 5rem

              .icon
                font-size 1.5rem
                color $color-theme

                &.icon-close
                  margin-left 1rem
                  padding 0.5rem

                &.icon-not-like
                  padding 0.5rem
                &.icon-like
                  padding 0.5rem

      .wrapper-add
        padding 1rem 0
        text-align center

        .add-btn
          display inline-block
          border-radius 2rem
          border 0.1rem solid $color-text-m
          padding 0.5rem 2rem
          font-size: $font-size-small
          color $color-text-standard

      .wrapper-close
        background-color: $color-background
        font-size $font-size-medium
        padding 1rem 0
        line-height 2rem
        text-align center
</style>
