<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="queryChange"></search-box>
    </div>
    <scroll class="container" ref="container" v-show="!query" :data="shortcut">
      <div>
        <div class="search-history" v-show="searchHistory.length">
          <div class="history-container">
            <h2 class="search-history-title">搜索历史</h2>
            <div class="history-control" @click="controlItem">{{controlTxt}}</div>
            <i class="icon-clear" @click="clearAll"></i>
          </div>
          <ul class="history-key">
            <li class="item-history" v-for="(item,index) in searchHistory">
              <div class="history-text" @click="selectHistory(item)">{{item}}</div>
              <i v-show="control" class="icon-dismiss" @click="clearOne(item)"></i>
            </li>
          </ul>
        </div>
        <div class="search-hot">
          <h2 class="hot-search-text">热门搜索</h2>
          <ul class="hot-list">
            <li class="list-item" v-for="(item,index) in hotKey" @click="selectSong(item)">
              <div class="list-index" :class="hotCls(index)">{{index + 1}}</div>
              <div class="list-detail">
                <div class="detail-song">
                  <h3>{{item.title}}</h3>
                  <span class="song-icon" v-if="item.pic_url"><img :src="item.pic_url" alt=""></span>
                </div>
                <h4 class="detail-desc">{{item.description}}</h4>
              </div>
              <div class="list-score">{{item.score}}</div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <div class="search-result" ref="searchResult" v-show="query">
      <suggest :query="query" ref="suggest" @listScroll="blurInput" :loading="loading" @select="saveSearch"></suggest>
    </div>
    <confirm ref="confirm" @selectConfirm="selectConfirm"></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from "../../base/searchbox/SearchBox";
import Scroll from "../../base/scroll/Scroll";
import Suggest from "./childcpn/Suggest";
import Confirm from "../../base/confirm/Confirm";

import {mapActions, mapGetters} from 'vuex'
import {getHotKey} from "../../network/search";
import {ERR_OK} from "../../network/config";
import {searchHistory} from "../../store/getters";
import {playlistMixin, searchMixin} from "../../assets/js/mixin";

export default {
	name: "Search",
	mixins: [playlistMixin, searchMixin],
	components: {
		SearchBox,
		Scroll,
		Suggest,
		Confirm
	},
	computed: {
		shortcut() {
			return this.hotKey.concat(this.searchHistory)
		},
		...mapGetters([
			'searchHistory'
		])
	},
	created() {
		this._getHotKey()
	},
	updated() {
		this.$refs.container.refresh()
	},
	data() {
		return {
			hotKey: [],
			// history: ['少年', '光辉岁月', '红色高跟鞋', '处处吻', '一丝不挂', '浮夸', '富士山下'],
			control: false,
			controlTxt: '管理',
			loading: true
		}
	},
	methods: {
		_getHotKey() {
			getHotKey().then(res => {
				if (res.code === ERR_OK) {
					this.hotKey = res.hotkey.data.vec_hotkey
				}
			})
		},
		hotCls(index) {
			if (index <= 2) {
				return 'list-index-hot'
			}
		},
		controlItem() {
			this.control = !this.control
			this.controlTxt = this.control ? '完成' : '管理'
		},
		selectHistory(item) {
			this.$refs.searchBox.setQuery(item)
		},
		selectSong(item) {
			this.$refs.searchBox.setQuery(item.title)
		},
		queryChange(query) {
			this.query = query
		},
		blurInput() {
			this.$refs.searchBox.blur()
		},
		saveSearch() {
			this.saveSearchHistory(this.query)
		},
		clearOne(item) {
			this.deleteSearchHistory(item)
		},
		clearAll() {
			// this.deleteAllSearchHistory()
			this.$refs.confirm.show()
		},
		selectConfirm(confirmVal) {
			if (confirmVal) {
				this.deleteAllSearchHistory()
				this.$refs.confirm.hide()
			} else {
				this.$refs.confirm.hide()
			}
		},
		handlePlaylist(playlist) {
			const bottom = playlist.length ? '60px' : ''
			this.$refs.container.$el.style.bottom = bottom
			this.$refs.searchResult.style.bottom = bottom
			this.$refs.container.refresh()
			this.$refs.suggest.refresh()
		},
		...mapActions([
			'saveSearchHistory',
			'deleteSearchHistory',
			'deleteAllSearchHistory'
		]),
	}
}
</script>

<style scoped lang="stylus">
  @import "~assets/stylus/variable"
  @import "~assets/stylus/mixin"
  .search
    .search-box-wrapper
      position relative
      z-index 10
      padding 2rem
      background-color: $color-background

    .container
      position absolute
      top 16.8rem
      bottom: 0
      width 100%
      background-color: $colo-background

      .search-history
        .history-container
          display flex
          align-items center
          height 2.5rem
          line-height 2.5rem
          margin 0 2rem

          .search-history-title
            flex 1
            height: 2.5rem;
            line-height: 2.5rem;
            font-size: 15px;
            color: $color-text-standard

          .history-control
            flex 0 0 2.5rem
            margin-right 1.5rem
            font-size $font-size-small
            color $color-text-standard

          .icon-clear
            color $color-text-standard
            margin-right 1rem

        .history-key
          margin 1rem 2rem

          .item-history
            display inline-block
            background-color: $color-highlight-background
            padding 0.5rem 1rem
            margin-right 1rem
            margin-bottom 1rem
            position relative

            .history-text
              font-size $font-size-small
              color $color-text-l
              display inline-block

            .icon-dismiss
              position absolute
              display inline-block
              top -6px
              right -6px

      .search-hot
        .hot-search-text
          margin 0 2rem
          height 2.5rem
          line-height 2.5rem
          font-size 15px
          color $color-text-standard

        .hot-list
          .list-item
            display flex
            align-items center
            padding 1rem 0

            &:last-child
              padding-bottom 2rem

            .list-index
              flex 0 0 5rem
              font-size: $font-size-medium
              color $color-text-m
              text-align center

            .list-index-hot
              color darkorange

            .list-detail
              flex 1
              display flex
              flex-direction column
              justify-content center
              line-height 2rem

              .detail-song
                color $color-text-standard-l
                font-size 13px
                margin-bottom 0.3rem
                display flex

                .song-icon
                  display inline-block
                  width 1.4rem
                  height: 1.4rem
                  font-size: 0
                  margin-left 0.5rem
                  margin-top 0.3rem

                  img
                    width: 1.4rem
                    height: 1.4rem

              .detail-desc
                color $color-text-m
                font-size: 12px

            .list-score
              color $color-text-m
              font-size: $font-size-small
              flex 0 0 6rem
              width 6rem
              text-align right
              padding-right 2rem
              no-wrap()

    .search-result
      position absolute
      top 16.8rem
      bottom: 0
      width 100%
      background-color: $colo-background
</style>
