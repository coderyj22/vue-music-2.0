<template>
  <div class="my-header">
    <div class="icon">
      <img src="./logo@2x.png" alt="">
    </div>
    <div class="text">YJ 音乐</div>
  </div>
</template>

<script>
export default {
  name: "MyHeader"
}
</script>

<style scoped lang="stylus">
  @import "~assets/stylus/variable"
  .my-header
    height 4.4rem
    text-align center
    font-size: 0

    .icon
      display inline-block
      margin: 0.6rem 0.9rem 0 0


      img
        width 3rem
        height 3rem

    .text
      display inline-block
      line-height 4.4rem
      vertical-align top
      font-size $font-size-large
      color $color-theme
</style>
