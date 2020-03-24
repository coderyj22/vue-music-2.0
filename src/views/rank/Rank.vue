<template>
  <div class="rank">
    <scroll class="top-list" v-show="topList.length" ref="topList">
      <ul>
        <li class="item" v-for="item in topList">
          <div class="img">
            <img width="100" height="100" v-lazy="item.picUrl" alt="">
          </div>
          <ul class="song-list">
            <li class="song" v-for="(detail,index) in item.songList" @click="selectItem(item)">
              <span>{{index + 1}}</span>
              <span>{{detail.singername}}-{{detail.songname}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <router-view></router-view>
    <loading class="loading" v-if="!topList.length"></loading>
  </div>
</template>

<script>
import Scroll from "../../base/scroll/Scroll";
import Loading from '../../base/loading/Loading'

import {playlistMixin} from "../../assets/js/mixin";
import {getTopList} from "../../network/rank";
import {ERR_OK} from "../../network/config";
import {mapMutations} from 'vuex'

export default {
	name: "Rank",
	mixins: [playlistMixin],
	components: {
		Scroll,
		Loading
	},
	data() {
		return {
			topList: []
		}
	},
	created() {
		this._getTopList()
	},
	methods: {
		_getTopList() {
			getTopList().then(res => {
				if (res.code === ERR_OK) {
					this.topList = res.data.topList
				}
			})
		},
		selectItem(item) {
			this.$router.push({
				path: `/rank/${item.id}`
			})
			console.log(item);
			this.setTopList(item)
		},
		handlePlaylist(playlist) {
			const bottom = playlist.length ? '60px' : ''
			this.$refs.topList.$el.style.bottom = bottom
			this.$refs.topList.refresh()
		},
		...mapMutations({
			setTopList: "SET_TOP_LIST"
		})
	}
}
</script>

<style scoped lang="stylus">
  @import "~assets/stylus/variable"
  @import "~assets/stylus/mixin"
  .rank
    .top-list
      position absolute
      right: 0
      bottom: 0
      top: 8.8rem
      left: 0
      background-color: $color-background

      .item
        display flex
        margin 0 2rem
        padding-top 2rem

        &:last-child
          padding-bottom 2rem

        .img
          flex 0 0 10rem

        .song-list
          flex 1
          padding 0 2rem
          background-color: $color-highlight-background
          display flex
          flex-direction column
          justify-content center
          overflow hidden

          .song
            font-size: $font-size-small
            color $color-text-x
            line-height 2.6rem
            no-wrap()

            .span
              no-wrap()
    .loading
      position absolute
      top 50%
      left 50%
      transform translateX(-50%) translateY(-50%)
</style>
