<template>
  <div id="recommend">
    推荐
  </div>
</template>

<script>
import {getRecommend} from 'network/recommend'
import {ERR_OK} from "network/config";

export default {
  name: "Recommend",
  created(){
    this._getRecommend()
  },
  data(){
    return {
      slider:[]
    }
  },
  methods:{
    _getRecommend(){
      getRecommend().then(res=>{
        if(res.code === ERR_OK){
          this.slider = res.focus.data.content
          console.log(this.slider);
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  #recommend
    position absolute
    top 8.8rem
    bottom: 0
    width 100%

</style>
