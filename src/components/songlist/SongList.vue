<template>
  <div class="song-list">
    <ul>
      <li v-for="(song,index) in songs" v-if="song.url" class="item" @click="songClick(song,index)">
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)">{{getRankText(index)}}</span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
	name: "SongList",
	props: {
		songs: {
			type: Array,
			default() {
				return []
			}
		},
		rank: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {}
	},
	methods: {
		getDesc(song) {
			return `${song.singer} . ${song.album}`
		},
		songClick(song, index) {
			this.$emit('select', song, index)
		},
		getRankCls(index) {
			if (index <= 2) {
				return `icon icon${index}`
			} else {
				return `text`
			}
		},
		getRankText(index) {
			if (index > 2) {
				return index + 1
			}
		}
	}
}
</script>

<style scoped lang="stylus">
  @import "~assets/stylus/variable"
  @import "~assets/stylus/mixin"
  .song-list
    ul
      .item
        height 6.4rem
        display flex
        align-items center

        .rank
          flex 0 0 2.5rem
          width 2.5rem
          height 2.5rem
          margin-right: 3rem
          text-align center

          .icon
            display inline-block
            width: 2.5rem
            height 2.4rem
            background-size: 2.5rem 2.4rem;

            &.icon0
              bg-image('first')

            &.icon1
              bg-image('second')

            &.icon2
              bg-image('third')

          .text
            font-size: $font-size-large
            color $color-theme

        .content
          display flex
          flex-direction column
          flex 1
          font-size: $font-size-medium
          overflow hidden

          .name
            height 2rem
            line-height 2rem
            margin-bottom: 0.5rem
            color $color-text-standard-l
            no-wrap()

          .desc
            color $color-text-x
            line-height 2rem
            height 2rem
            no-wrap()


</style>
