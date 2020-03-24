<template>
  <div class="progress-bar" ref="progressBar" @click="clickProgress">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend.prevent="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProgressBar",
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  watch: {
    percent(newPercent) {
      if (!this.touch.initiated) {
        this.progressBarWidth = this.$refs.progressBar.clientWidth
        const offsetWidth = newPercent * this.progressBarWidth
        this._offset(offsetWidth)
      }
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    clickProgress(e){
      // 当点击progressBtn，e.offsetX不对
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      this._offset(offsetWidth)
      this._triggerPercent()
    },
    progressTouchStart(e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX
      const offsetWidth = Math.min(Math.max(0, this.touch.left + deltaX), this.progressBarWidth)
      this._offset(offsetWidth)
    },
    progressTouchEnd() {
      this.touch.initiated = false
      this._triggerPercent()
    },
    _triggerPercent(){
      const percent = this.$refs.progress.clientWidth / this.progressBarWidth
      this.$emit('percentChang',percent)
    },
    _offset(offsetWidth){
      this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.progress.style.width = `${offsetWidth}px`
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "~assets/stylus/variable"

  .progress-bar
    height 3rem

    .bar-inner
      position: relative;
      top: 1.3rem;
      height: 0.4rem;
      background-color: $color-text-x

      .progress
        position absolute
        height 100%
        background-color: $color-theme

      .progress-btn-wrapper
        position absolute
        top -1.3rem
        width 3rem
        height 3rem
        left -1.6rem

        .progress-btn
          position relative
          top 0.7rem
          left 0.7rem
          box-sizing border-box
          border-radius 50%
          border 0.3rem solid $color-text
          background-color: $color-theme
          height 1.6rem
          width: 1.6rem

</style>
