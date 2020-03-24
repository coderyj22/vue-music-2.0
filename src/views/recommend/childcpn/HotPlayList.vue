<template>
  <div class="hot-play-list">
    <h2 class="list-title">热门歌单推荐</h2>
    <ul>
      <li @click="selectItem(item)" class="list-item" v-for="item in recomPlaylist">
          <div class="icon">
            <img v-lazy="item.cover" alt="">
          </div>
          <div class="text">
            <h2 class="desc">{{item.title}}</h2>
            <div class="name">{{item.username}}</div>
          </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "HotPlayList",
  props: {
    recomPlaylist: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods:{
    selectItem(item){
      this.$emit('selectItem',item)
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "~assets/stylus/variable"
  .hot-play-list
    text-align center

    .list-title
      font-size: $font-size-medium
      color $color-theme
      height 6.5rem
      line-height 6.5rem
    ul
      .list-item
        display flex
        padding 0 2.5rem 2.5rem 2.5rem
        .icon
          font-size: 0
          margin-right 2rem
          flex 0 0 7rem
          img
            width: 7rem
        .text
          margin-top 1rem
          height 5rem
          flex 1
          text-align left
          display flex
          flex-direction column
          .desc
            font-size: $font-size-medium
            color $color-text-standard-l
            margin-bottom: 1.5rem
          .name
            color $color-text-x
            font-size: $font-size-medium
</style>
