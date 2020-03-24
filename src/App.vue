<template>
  <div id="app">
    <my-header/>
    <main-tab-bar :bars="bars"/>
    <keep-alive>
      <router-view/>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MainTabBar from "./base/maintabbar/MainTabBar";
import MyHeader from "./base/myheader/MyHeader";
import Player from "./components/player/Player";


export default {
  name: 'App',
  components: {
    MainTabBar,
    MyHeader,
    Player
  },
  data() {
    return {
      bars: [
        {
          router: 'recommend',
          text: "推荐"
        },
        {
          router: 'singer',
          text: "歌手"
        },
        {
          router: 'rank',
          text: "排行"
        },
        {
          router: 'search',
          text: "搜索"
        },
      ]
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
