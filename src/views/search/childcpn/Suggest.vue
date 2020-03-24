<template>
  <div class="suggest">
    <scroll class="container"
            v-show="searchReady"
            :before-scroll="true"
            ref="container"
            :pull-up-load="pullUpLoad"
            @loadData="loadData"
            @beforeScroll="listScroll">
      <div>
        <div class="search-recommend" v-if="result.length && result[0].zhida_singer">
          <div class="recommend-title">为您推荐</div>
          <div class="recommend-container" @click="selectSinger(result[0].zhida_singer)">
            <div class="img"><img :src="result[0].zhida_singer.singerPic" alt=""></div>
            <div class="container-detail">
              <span class="detail-title">歌手</span>
              <span class="detail-singer">{{result[0].zhida_singer.singerName}}</span>
              <span class="detail-info">歌曲:{{result[0].zhida_singer.songNum}} 专辑:{{result[0].zhida_singer.albumNum}} 视频:{{result[0].zhida_singer.mvNum}}</span>
            </div>
            <!--            <div class="favorite">-->
            <!--              <div class="favorite btn"> + 关注</div>-->
            <!--            </div>-->
          </div>
        </div>
        <div class="search-list" v-show="result.length">
          <song-list :songs="result" @select="selectSong"></song-list>
        </div>
        <div class="no-result-wrapper" v-show="searchReady && !result.length">
          <no-result title="暂无搜索结果，你搜的是神马？"></no-result>
        </div>
      </div>
    </scroll>
    <loading class="loading" v-show="!searchReady && loading"></loading>
    <div class="b-loading" v-show="bLoading">
      <loading></loading>
    </div>
  </div>
</template>

<script>
import Scroll from "../../../base/scroll/Scroll";
import Loading from "../../../base/loading/Loading";
import SongList from "../../../components/songlist/SongList";
import NoResult from "../../../base/noresult/NoResult";

import {Search} from "../../../network/search";
import {getvkey} from "../../../network/singer";
import {ERR_OK} from "../../../network/config";
import {createSongRec} from "../../../assets/js/myClass";
import {mapMutations, mapActions} from 'vuex'
import {Singer} from "../../../assets/js/myClass";

const LOAD_NUM = 30

export default {
	name: "Suggest",
	components: {
		Scroll,
		Loading,
		SongList,
		NoResult
	},
	props: {
		query: {
			type: String,
			default: ''
		},
		showSinger: {
			type: Boolean,
			default: true
		},
		loading: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		query() {
			if (this.query !== '') {
				this.search()
			}
			this.resetData()
		}
	},
	data() {
		return {
			page: 1,
			result: [],
			searchReady: false,
			beforeScroll: true,
			pullUpLoad: true,
			totalnum: 0,
			hasMore: true,
      addResult:[],
      bLoading:false
		}
	},
	methods: {
		search() {
			this.hasMore = true
			Search(this.query, this.page, LOAD_NUM, this.showSinger).then(res => {
				if (res.code === ERR_OK) {
					if (res.data.song.list.length === 0) {
						this.searchReady = true
					} else {
						this.totalnum = res.data.song.totalnum
						this.result = this._normalizeResult(res.data)
					}
				}
			})
		},
		checkMore() {
			if(LOAD_NUM * this.page > this.totalnum){
				this.hasMore = false
        this.bLoading = false
      }
		},
		selectSinger(item) {
			const singer = new Singer({
				id: item.singerMID,
				name: item.singerName
			})
			this.$router.push({
				path: `/search/${singer.id}`
			})
			this.setSinger(singer)
			this.$emit('select')
		},
		selectSong(song, index) {
			this.insertSong(song)
			this.$emit('select')
		},
		_normalizeResult(data) {
			let ret = []
			if (data.zhida.zhida_singer) {
				ret.push({...data.zhida, ...{type: 'singer'}})
			}
			const list = data.song.list
			list.forEach((item, index) => {
				getvkey(item.mid).then(res => {
					const purl = res.req_0.data.midurlinfo[0].purl
					if (purl) {
						ret.push(createSongRec(item, purl))
					}
					if (index === list.length - 1) {
						this.searchReady = true
					}
				})
			})
			return ret
		},
		listScroll() {
			this.$emit('listScroll')
		},
		refresh() {
			this.$refs.container.refresh()
		},
		searchMore() {
			if (!this.hasMore) {
				return
			}
			this.page++
			Search(this.query, this.page, LOAD_NUM, false).then(res => {
				if (res.code === ERR_OK) {
					this.addResult = this._normalizeResult(res.data)
					this.checkMore()
					setTimeout(()=>{
						this.result = this.result.concat(this.addResult)
						this.$refs.container.finishPullUp()
						this.$refs.container.refresh()
						this.bLoading = false
					},1500)
				}
			})
		},
		loadData() {
			if(this.bLoading){
				return
			}
			if (this.hasMore) {
				this.searchMore()
				this.bLoading = true
			}
		},
    resetData(){
	    this.searchReady = false
	    this.result = []
	    this.page = 1
	    this.totalnum = 0
	    this.hasMore = true
	    this.addResult = []
	    this.bLoading = false
    },
		...mapActions([
			'insertSong'
		]),
		...mapMutations({
			setSinger: "SET_SINGER"
		})
	}

}
</script>

<style scoped lang="stylus">
  @import "~assets/stylus/variable"
  .suggest
    position absolute
    top: 0
    bottom: 0
    width 100%
    background-color: $color-background

    .container
      position absolute
      top: 0
      bottom: 0
      width 100%
      background-color: $color-background

      .search-recommend
        margin 0 2rem

        .recommend-title
          color $color-text-m
          font-size: $font-size-small
          height 2rem
          line-height 2rem
          margin-bottom 1rem

        .recommend-container
          border-radius 0.7rem
          padding 1rem
          display flex
          align-items center
          background-color: $color-highlight-background

          .img
            flex 0 0 5rem
            width 5rem

            img
              width: 5rem
              height: 5rem
              border-radius 50%

          .container-detail
            flex 1
            display flex
            flex-direction column
            justify-content space-around
            line-height 2rem
            padding-left 2rem

            .detail-title
              font-size $font-size-small
              color $color-text-m

            .detail-singer
              font-size $font-size-medium
              color $color-text-standard-l
              margin 0.4rem 0

            .detail-info
              font-size: $font-size-small
              color $color-text-m

      /*          .favorite
                  flex 0 0 5rem*/

      .search-list
        margin-left 3rem
        margin-right 2rem

      .no-result-wrapper
        position absolute
        width 100%
        top 40%
        transform translateY(-50%)

    .loading
      position absolute
      top 50%
      left 50%
      transform translateX(-50%) translateY(-50%)
    .b-loading
      position absolute
      bottom: 0
      width 100%
</style>
