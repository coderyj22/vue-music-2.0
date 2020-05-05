<template>
  <div id="recommend" ref="recommend">
    <scroll ref="scroll" class="scroll" :data="slider" :click="true">
      <div>
        <!-- 轮播图 -->
        <slider v-if="slider.length">
          <div v-for="item in slider">
            <a :href="item.jump_info.url">
              <img class="needsclick" :src="item.pic_info.url" alt="" />
            </a>
          </div>
        </slider>

        <!-- 热门歌单推荐 -->
        <loading class="loading" v-if="!slider.length" title="正在加载中……" />
        <hot-play-list
          @selectItem="selectItem"
          v-else
          :recom-playlist="recomPlaylist"
        />
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import Scroll from 'base/scroll/Scroll'
import Slider from 'base/slider/Slider'
import Loading from 'base/loading/Loading'
import HotPlayList from './childcpn/HotPlayList'

import { getRecommend } from 'network/recommend'
import { ERR_OK } from 'network/config'
import { playlistMixin } from '../../assets/js/mixin'
import { mapMutations } from 'vuex'

export default {
  name: 'Recommend',
  mixins: [playlistMixin],
  components: {
    Slider,
    HotPlayList,
    Scroll,
    Loading,
  },
  created() {
    this._getRecommend()
  },
  data() {
    return {
      slider: [],
      recomPlaylist: [],
    }
  },
  methods: {
    _getRecommend() {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          console.log(res)
          this.slider = res.focus.data.content
          this.recomPlaylist = res.recomPlaylist.data.v_hot
        }
      })
    },
    selectItem(item) {
      this.$router.push({
        path: `/recommend/${item.content_id}`,
      })
      this.setDisc(item)
      // console.log(item);
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    ...mapMutations({
      setDisc: 'SET_DISC',
    }),
  },
}
</script>

<style scoped lang="stylus">
@import "~assets/stylus/variable"
#recommend
  position absolute
  top 8.8rem
  bottom: 0
  width 100%
  background-color $color-background

  .scroll
    height 100%
  .loading
    position absolute
    top 40%
</style>
