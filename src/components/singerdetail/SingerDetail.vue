<template>
  <transition name="slide" appear>
    <div class="singer-detail">
      <music-list
        :show="isShowList"
        :songs="song"
        :bg-img="bgImg"
        :title="title"
        ref="musicList"
      />
    </div>
  </transition>
</template>

<script>
import MusicList from "../musiclist/MusicList";
import { getSingerDetail } from "../../network/singer";
import { mapGetters } from "vuex";
import { ERR_OK } from "../../network/config";
import { createSong } from "../../assets/js/myClass";
import { getvkey } from "../../network/singer";

export default {
  name: "SingerDetail",
  components: {
    MusicList,
  },
  computed: {
    ...mapGetters(["singer"]),
    title() {
      return this.singer.name;
    },
    bgImg() {
      return this.singer.avatar;
    },
  },
  created() {
    this._getSingerDetail();
  },
  data() {
    return {
      song: [],
      isShowList: false,
      begin: 0,
      end: 99,
    };
  },
  methods: {
    // loadMore() {
    // 	this.ready = false
    // 	this.begin += 100
    // 	this.end += 100
    // 	this._getSingerDetail()
    // },
    _getSingerDetail() {
      if (!this.singer.id) {
        this.$router.push("/singer");
        return;
      }
      getSingerDetail(this.singer.id, this.begin, this.end).then((res) => {
        if (res.code === ERR_OK) {
          this.song = this._normalizeSongs(res.data.list);
        }
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach((item, index) => {
        let { musicData } = item;
        getvkey(musicData.songmid).then((res) => {
          const purl = res.req_0.data.midurlinfo[0].purl;
          if (musicData.albummid && purl) {
            ret.push(createSong(musicData, purl));
          }
          if (index === list.length - 1) {
            this.isShowList = true;
          }
        });
      });
      return ret;
    },
  },
};
</script>

<style scoped lang="stylus">
@import "~assets/stylus/variable"
@import "~assets/stylus/mixin"
.singer-detail
  position fixed
  top: 0
  bottom: 0
  width 100%
  left 0
  right: 0
  background-color $color-background
  z-index 15

.slide-enter-active, .slide-leave-active
  transition: all 0.3s

.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)

/*  .slide-enter-to, .slide-leave
    transform translate3d()*/
</style>
