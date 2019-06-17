<template>
  <transition name="slide">
    <div class="addSong" v-show="dialogShow" @click.stop>
      <div class="header">
        <h1 class="header-title">添加歌曲到列表</h1>
        <div class="icon-close" @click="hide()"></div>
      </div>
      <div class="search-container">
        <searchbox @getText="getQuery" ref="searchbox"></searchbox>
      </div>
      <div class="search-result" v-show="query">
        <suggest :query="query" @clearBlur="blur"></suggest>
      </div>
      <div class="search-history" v-show="!query">
        <div class="switch-container">
          <switches @getIndex="toggleItem" :switchIndex="switchIndex" :itemname="switchNames"></switches>
        </div>
        <div class="switch-result">
          <scroll v-show="switchIndex == 0">
            <div class="switch-latestPlay" v-show="switchIndex == 0">
              <songlist :songList="songHistory"></songlist>
            </div>
          </scroll>
          <scroll v-show="switchIndex == 1">
            <div class="switch-historySearch" v-show="switchIndex == 1">
                <searchlist :searches="searchHistory" @delete="removeSingleSearchHistory"></searchlist>
            </div>
          </scroll>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import searchBox from '@/components/searchBox/searchBox'
import suggest from '@/components/suggest/suggest'
import searchList from '@/components/searchList/searchList'
import songList from '@/components/songList/songList'
import switches from '@/components/switchs/switchs'
import {searchResult} from '@/api/search.js'
import mScroll from '@/components/scroll/scroll'
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'addSong',
  components: {
    'searchbox': searchBox,
    'suggest': suggest,
    'searchlist': searchList,
    'songlist': songList,
    'scroll': mScroll,
    'switches': switches
  },
  data () {
    return {
      dialogShow: false,
      query: '',
      switchIndex: 0,
      switchNames: ['最近播放', '搜索历史']
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory',
      'songHistory'
    ])
  },
  methods: {
    show () {
      this.dialogShow = true
    },
    hide () {
      this.dialogShow = false
    },
    getQuery (val) {
      console.log(val)
      this.query = val
    },
    toggleItem (index) {
      this.switchIndex = index
    },
    switchItemOne () {
      this.switchIndex = 0
    },
    switchItemTwo () {
      this.switchIndex = 1
    },
    _searchResult (name, page) {
      searchResult(this, name, page).then((res) => {
        console.log(res.body.data.song.list)
        this.searchList = res.body.data.song.list
      }, (res) => {
        console.log(res)
      })
    },
    blur () {
      this.$refs.searchbox.blur()
    },
    ...mapActions([
      'removeSingleSearchHistory'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.addSong{
  position: fixed;
  top:0;
  bottom:0;
  left:0;
  width: 100%;
  height:100%;
  z-index: 200;
  background: $color-background;
}
.slide-enter-active, .slide-leave-active {
  transition: left .5s
}
.slide-enter, .slide-leave-active {
  left: 100%;
}
.icon-close{
  position: absolute;
  top: 0;
  right: 8px;
  display: block;
  padding: 12px;
  font-size: 20px;
  color: $color-theme;
}
.header{
  position: relative;
  height: 44px;
  text-align: center;
}
.header-title{
  line-height: 44px;
  font-size: $font-size-large;
  color: $color-text;
}
.search-container{
  margin: 20px;
}
.search-result{
  position: fixed;
  top: 120px;
  bottom: 0px;
  width: 100%;
  overflow:hidden;
}
.switch-container{
  width: 240px;
  margin: 0 auto;
}
.history-switch{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 240px;
  border: 1px solid $color-highlight-background;
  border-radius: 5px;
}
.switch-item{
  padding: 8px;
  flex: 1;
  text-align: center;
  font-size: $font-size-medium;
  color: $color-text-d;
}
.active{
  background: $color-highlight-background;
  color: $color-text;
}
.switch-result{
  position: fixed;
  top: 165px;
  bottom: 0;
  width: 100%;
  overflow: hidden;
}
.switch-latestPlay{
  padding: 20px 30px;
  text-align:left;
}
.switch-historySearch{
  padding: 20px 30px;
}
</style>
