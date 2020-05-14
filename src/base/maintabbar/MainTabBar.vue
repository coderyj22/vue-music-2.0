<template>
  <div class="main-tab-bar">
    <router-link v-for="(item,index) in bars" :key="index" :to="item.router" class="bar-item">
      <span class="tab-text">{{item.text}}</span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "MainTabBar",
  props: {
    bars: {
      type: Array,
      default: []
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "~assets/stylus/mixin"
  @import "~assets/stylus/variable"
  .main-tab-bar
    display flex
    height 4.4rem
    line-height 4.4rem
    background-color $color-background
    position: relative;
    z-index 10
    .bar-item
      flex 1
      font-size 1.4rem
      text-align center
      &.router-link-active
        span
          border-bottom: 0.2rem solid $color-theme
          color $color-theme
      span
        padding-bottom 0.5rem
        color $color-text-l
        font-size $font-size-medium


</style>
