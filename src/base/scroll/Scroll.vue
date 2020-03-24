<template>
  <div class="scroll" ref="scroll">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from "better-scroll"

export default {
	name: "Scroll",
	props: {
		probeType: {
			type: Number,
			default: 0
		},
		click: {
			type: Boolean,
			default: true
		},
		data: {
			type: Array,
			default() {
				return []
			}
		},
		// listenScroll: {
		// 	type: Boolean,
		// 	default: false
		// },
		pullUpLoad: {
			type: Boolean,
			default: false
		},
		beforeScroll: {
			type: Boolean,
			default: false
		}
	},
	mounted() {
		setTimeout(() => {
			this._initScroll()
		}, 20)
	},
	methods: {
		_initScroll() {
			if (!this.$refs.scroll) {
				return
			}
			this.scroll = new BScroll(this.$refs.scroll, {
				probeType: this.probeType,
				pullUpLoad: this.pullUpLoad,
				click: this.click
			})

			if (this.probeType === 3) {
				this.scroll.on('scroll', pos => {
					this.$emit('scroll', pos)
				})
			}
			if (this.pullUpLoad) {
				this.scroll.on('pullingUp', () => {
					this.$emit('loadData')
				})
			}
			if (this.beforeScroll) {
				this.scroll.on('beforeScrollStart', () => {
					this.$emit('beforeScroll')
				})
			}
		},
		refresh() {
			this.scroll && this.scroll.refresh()
		},
		scrollTo() {
			this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
		},
		scrollToElement() {
			this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
		},
    finishPullUp(){
			this.scroll.finishPullUp()
    }
	},
	watch: {
		data() {
			setTimeout(() => {
				this.refresh()
			})
		}
	}
}
</script>

<style scoped>

</style>
