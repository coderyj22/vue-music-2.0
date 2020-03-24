<template>
  <ul class="switches">
    <li class="switch-item" v-for="(item,index) in switches" :class="{'active':currentIndex === index}"
        @click="switchItem(index)" :key="index">
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>

<script>
export default {
	name:'Switches',
	props: {
		switches: {
			type: Array,
			default: []
		},
		currentIndex: {
			type: Number,
			default: 0
		}
	},
	methods: {
		switchItem(index) {
			this.$emit('switch', index)
		}
	}
}
</script>

<style scoped lang="stylus">
  @import "~assets/stylus/variable"
  @import "~assets/stylus/mixin"

  .switches
    display: flex
    align-items: center
    width: 24rem
    margin: 0 auto
    border: 0.1rem solid $color-highlight-background
    border-radius: 0.5rem
    .switch-item
      flex: 1
      padding: 0.8rem
      text-align: center
      font-size: $font-size-medium
      color: $color-text-m
      &.active
        background: $color-highlight-background
        color: $color-text-standard-l
</style>
