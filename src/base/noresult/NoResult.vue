<template>
  <div class="no-result">
    <div class="no-result-icon"></div>
    <p class="no-result-txt">{{title}}</p>
  </div>
</template>

<script>
export default {
	name: "NoResult",
	props: {
		title: {
			type: String,
			default: ''
		}
	}
}
</script>

<style scoped lang="stylus">
  @import "~assets/stylus/variable"
  @import "~assets/stylus/mixin"
  .no-result
    text-align center
    .no-result-icon
      width: 8.6rem
      height: 9rem
      margin: 0 auto
      bg-image('no-result')
      background-size 8.6rem 9rem

    .no-result-txt
      margin-top: 3rem
      font-size: $font-size-small
      color $color-text-m

</style>
