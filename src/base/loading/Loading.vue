<template>
  <div class="loading">
    <img src="./loading.gif" alt="">
    <p class="loading-text">{{title}}</p>
  </div>
</template>

<script>
export default {
  name: "Loading",
  props: {
    title: {
      type: String,
      default: "正在加载……"
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "~assets/stylus/variable"
  .loading
    text-align center
    width: 100%
    img
      width 2.5rem

    .loading-text
      color $color-text-standard
      font-size $font-size-medium
      line-height 2rem
      margin-top: 0.5rem

</style>
