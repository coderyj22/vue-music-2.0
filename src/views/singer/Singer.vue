<template>
  <div class="singer">
    <loading class="loading" v-if="!singers.length" />
    <list-view @selectItem="selectSinger" v-else :data="singers" />
    <router-view/>
  </div>
</template>

<script>
import ListView from "./childcpn/ListView";
import Loading from '../../base/loading/Loading';

import {mapMutations} from 'vuex'
import {getSingers} from "../../network/singer";
import {ERR_OK} from "../../network/config";
import {Singer} from "../../assets/js/myClass";

const HOT_NAME = '热门'
const HOT_SINGER_LENGTH = 10

export default {
  name: "Singer",
  components:{
    ListView,
    Loading
  },
  created() {
    this._getSingers()
  },
  data() {
    return {
      singers: []
    }
  },
  methods: {
    ...mapMutations({
      setSinger:'SET_SINGER'
    }),
    selectSinger(singer){
      this.$router.push({
        path:`/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    _getSingers() {
      getSingers().then(res => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list)
          // console.log(this.singers);
        }
      })
    },
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LENGTH) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })
      // 对map排序
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        // console.log(val);
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a,b)=>{
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })

      return hot.concat(ret)
    },

  }
}
</script>

<style scoped lang="stylus">
  .singer
    position absolute
    width: 100%
    top 8.8rem
    bottom: 0
    .loading
      position: absolute;
      top: 38%

</style>
