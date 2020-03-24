<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">  <!-- 轮播图小点 -->
      <span class="dot"
            @click="dotClick(index)"
            v-for="(item,index) in dots"
            :class="{active:index === currentIndex}"/>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import {addClass} from "assets/js/dom";

export default {
  name: "Slider",
  props: {
    interval: {     // 轮播间隔
      type: Number,
      default: 3000
    },
    loop: {         // 是否循环轮播
      type: Boolean,
      default: true
    },
    autoPlay: {     // 是否自动播放
      type: Boolean,
      default: true
    }
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth();
      this._initDots();
      this._initSlider();
      if (this.autoPlay) {
        this.play()
      }

      window.addEventListener('resize', () => {
        if (!this.slider) {
          return
        }
        this._setSliderWidth(true)
      })
    }, 20)
  },
  data() {
    return {
      dots: [],
      currentIndex: 0
    }
  },
  deactivated() {
    clearTimeout(this.time)
  },
  activated() {
    this.play()
  },
  methods: {
    _setSliderWidth(resize) {
      this.children = this.$refs.sliderGroup.children
      // console.log(this.children);
      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        // let child = this.children[i]
        let child = this.children[i]
        addClass(child, 'slider-item')
        child.style.width = `${sliderWidth}px`
        width += sliderWidth
      }
      if (this.loop && !resize) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = `${width}px`
    },
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        click: true,
        snap: {
          loop: this.loop,
          threshold: 0.2,
          speed: 500
        }
      })
      this.slider.on('scrollEnd', (obj) => {
        if (this.autoPlay) {
          clearTimeout(this.time);
          this.play();
          this.currentIndex = this.slider.getCurrentPage().pageX
        }
      })
      this.slider.on('scrollStart', () => {
        this.clearTime()
      })

    },
    _initDots() {
      this.dots = new Array(this.children.length)
    },
    play() {
      clearTimeout(this.time)
      this.time = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    },
    dotClick(i) {
      this.currentIndex = i
      this.slider.goToPage(i)
      this.clearTime()
      if (this.autoPlay) {
        this.play();
      }
      console.log(i);
    },
    clearTime() {    // 如果开启循环播放 关闭定时器
      if (this.autoPlay) {
        clearTimeout(this.time)
      }
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "~assets/stylus/variable"
  .slider
    position: relative
    overflow hidden

    .slider-group
      position relative
      font-size: 0
      overflow hidden

      .slider-item
        float left

        a
          font-size: 0

          img
            width 100%


    .dots
      position absolute
      bottom 1rem
      left: 0
      right: 0
      height 0.8rem
      text-align center

      .dot
        display inline-block
        width 0.8rem
        height: 0.8rem
        border-radius 50%
        background-color $color-text-m
        margin-left 0.7rem

        &.active
          width 2rem
          border-radius 0.5rem
          background-color $color-text-l

</style>
