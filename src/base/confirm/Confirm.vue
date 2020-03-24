<template>
  <transition name="confirm-slide">
    <div class="confirm" @click.stop="clickOther" v-show="showFlag">
      <div class="confirm-wrapper">
        <div class="container" @click.stop>
          <div class="container-title">{{title}}</div>
          <div class="container-control">
            <div class="control-confirm" @click.stop="confirm(true)">确定</div>
            <div class="control-cancel" @click.stop="confirm(false)">取消</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
	name: "Confirm",
	props: {
		title: {
			type: String,
			default: "是否清空全部历史记录？"
		}
	},
	data() {
		return {
			showFlag: false
		}
	},
	methods: {
		confirm(confirmVal) {
			this.$emit('selectConfirm', confirmVal)
			// console.log(confirmVal);
		},
		clickOther() {
			this.showFlag = false
		},
		show() {
			this.showFlag = true
		},
		hide() {
			this.showFlag = false
		}
	}
}
</script>

<style scoped lang="stylus">
  @import "~assets/stylus/variable"
  @import "~assets/stylus/mixin"
  .confirm
    position fixed
    top 0
    bottom: 0
    width 100%
    z-index 1000
    background-color: $color-background-m

    &.confirm-slide-enter-active
      animation confirm-slide 0.5s

      .container
        animation confirm-zoom 0.5s

    .confirm-wrapper
      position absolute
      top 50%
      left 50%
      transform translateX(-50%) translateY(-50%)
      border-radius 1rem
      background-color: black
      display flex
      flex-direction column
      width 80%

      .container
        padding 2rem

        .container-title
          color $color-text-standard-l
          font-size: $font-size-medium

        .container-control
          margin-top: 4rem
          display flex
          color $color-text-standard
          font-size: $font-size-small
          flex-direction row-reverse

          .control-cancel
            margin-right 3rem

          .control-confirm
            margin-right: 1.5rem

  @keyframes confirm-slide
    0%
      opacity 0
    100%
      opacity: 1

  @keyframes confirm-zoom
    0%
      transform scale(0)
    60%
      transform scale(1.05)
    100%
      transform scale(1)
</style>
