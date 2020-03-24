<template>
  <scroll class="list-view"
          :data="data"
          ref="listView"
          :probe-type="3"
          @scroll="scroll">
    <div>
      <ul>
        <li v-for="group in data" class="list-group" ref="listGroup">
          <h2 class="list-group-title">{{group.title}}</h2>
          <ul>
            <li v-for="item in group.items" @click="selectItem(item)">
              <img v-lazy="item.avatar" alt="">
              <span>{{item.name}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="shortcut-list"
         @touchstart="touchStart"
         @touchmove.stop.prevent="touchMove">
      <ul>
        <li v-for="(item,index) in shortcutList"
            :class="{active:currentIndex === index}"
            :data-index="index">{{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="currentTitle" ref="listFixed">
      <h2 class="list-group-title">{{currentTitle}}</h2>
    </div>
    <loading v-if="!data.length"/>
  </scroll>
</template>

<script>
import Scroll from "../../../base/scroll/Scroll";
import Loading from "../../../base/loading/Loading";

import {getData} from "../../../assets/js/dom";
import {playlistMixin} from 'assets/js/mixin'

const HEIGHT = 20

export default {
  name: "ListView",
  mixins:[playlistMixin],
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  components: {
    Scroll,
      Loading
  },
  watch: {
    scrollY(newY) {
      // 滚动到顶部的时候 newY>0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      let listHeight = this.listHeight
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]

        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          this.diff = height2 + newY
          // console.log(this.diff);
          return
        }
      }
      // 滚动到底部
      this.currentIndex = listHeight.length - 1
    },
    diff(newValue) {
      let fixedTop = newValue > 0 && newValue <= 30 ? newValue - 30 : 0
      if(this.fixedTop === fixedTop){
        return
      }
      this.fixedTop = fixedTop
      this.$refs.listFixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },
  created() {
    this.touch = {}
  },
  mounted() {
    this._calcHeight()
  },
  data() {
    return {
      currentIndex: 0,
      scrollY: -1,
      diff: -1
    }
  },
  computed: {
    shortcutList() {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    currentTitle() {
      if (this.scrollY > 0) {
        return ""
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ""
    }
  },
  methods: {
    touchStart(el) {
      let anchorIndex = getData(el.target, 'data-index')
      this.touch.y1 = el.touches[0].pageY
      this.touch.anchorIndex = parseInt(anchorIndex)
      this._scrollTo(anchorIndex)
    },
    touchMove(el) {
      this.touch.y2 = el.touches[0].pageY
      let dalta = (this.touch.y2 - this.touch.y1) / HEIGHT | 0
      let anchorIndex = this.touch.anchorIndex + dalta

      this._scrollTo(anchorIndex)
    },
    _scrollTo(index) {
      this.$refs.listView.scrollToElement(this.$refs.listGroup[index], 0)
    },
    scroll(p) {
      this.scrollY = p.y
    },
    _calcHeight() {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0;
      for (let i = 0; i < list.length; i++) {
        height = list[i].offsetTop
        this.listHeight.push(height)
      }
    },
    selectItem(item){
      this.$emit('selectItem',item)
    },
    handlePlaylist(playlist){
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.listView.$el.style.bottom = bottom
      this.$refs.listView.refresh()
    }
  },

}
</script>

<style scoped lang="stylus">
  @import "~assets/stylus/variable"
  .list-view
    position absolute
    top: 0
    bottom: 0
    width: 100%

    div
      ul
        .list-group
          .list-group-title
            background-color: #333;
            font-size: $font-size-small
            padding-left: 2rem;
            color: $color-text-m
            line-height 3rem
            height 3rem
            margin-bottom: 2rem

          ul
            li
              display flex
              padding 0 0 2rem 3rem

              img
                width: 5rem
                height 5rem
                flex 0 0 5rem

              span
                color $color-text-m
                flex 1
                margin-left: 2rem
                display inline-block
                font-size: $font-size-medium
                line-height 5rem


    .shortcut-list
      position: absolute;
      top: 50%
      transform translateY(-50%)
      right: 0
      z-index 11
      background-color: rgba(0, 0, 0, .3)
      width: 2.2rem
      text-align center
      padding 2rem 0
      border-radius 3rem

      ul
        li
          color $color-text-m
          height 1.5rem
          padding 0.25rem 0

          &.active
            color $color-theme

    .list-fixed
      position absolute
      top: 0
      width 100%

      .list-group-title
        background-color: #333;
        font-size: $font-size-small
        padding-left: 2rem;
        color: $color-text-m
        line-height 3rem
        height 3rem
        margin-bottom: 2rem

</style>
