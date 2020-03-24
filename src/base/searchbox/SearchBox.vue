<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="query" v-model="query" class="box" :placeholder="placeholder">
    <i @click="clear" v-show="query" class="icon-dismiss"></i>
  </div>
</template>

<script>
import {debounce} from "../../assets/js/util";

export default {
	name: "SearchBox",
	props: {
		placeholder: {
			type: String,
			default: '搜索歌曲、歌手'
		}
	},
	data() {
		return {
			query: ''
		}
	},
	watch: {},
	created() {     // 为什么使用created 里面监听query，而不是watch监听query
		this.$watch('query', debounce((newQuery) => {
			this.$emit('query', newQuery)
		}, 400))
	},
	methods: {
		clear() {
			this.query = ''
		},
		setQuery(query) {
			this.query = query
		},
    blur(){
			this.$refs.query.blur()
    }
	}
}
</script>

<style scoped lang="stylus">
  @import "~assets/stylus/variable"
  .search-box
    display flex
    align-items center
    box-sizing border-box
    width 100%
    padding 0 0.6rem
    height 4rem
    background-color: $color-highlight-background
    border-radius 0.5rem

    .icon-search
      font-size: 2.4rem
      color $color-background

    .box
      flex 1
      margin 0 0.5rem
      line-height 1.8rem
      background-color: $color-highlight-background
      color $color-text
      font-size: $font-size-medium

      &::placeholder
        color $color-text-m

    .icon-dismiss
      font-size: 1.6rem
      color $color-background
</style>
