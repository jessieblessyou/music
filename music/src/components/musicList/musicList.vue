<template>
  <div class="musicList">
    <div class="back icon-back" @click="goback()"></div>
    <h1 class="name">{{name}}</h1>
    <div class="avatar-container" ref="avatar">
      <div class="avatar-bg"></div>
      <img :src="avatar" class="avatar"/>
      <div class="play-container" @click="randomTracks()">
        <div class="player-border">
          <i class="play icon-play"></i>
          <span class="play-text">随机播放全部</span>
        </div>
      </div>
    </div>
    <div class="songlist-container" ref="songlistContainer">
      <scroll @scroll="listenScroll" ref="scroll">
        <songList :songList="trackList" @clickItem='clickItem' :rank="rank" class="songlistView"></songList>
        <div class="tracklist-background" ref="background">
        </div>
       </scroll>
     </div>
  </div>
</template>

<script>
import songList from '@/components/songList/songList'
import mScroll from '@/components/scroll/scroll'
import {mapActions} from 'vuex'
import {songMixin} from '@/common/js/mixin.js'

export default {
  mixins: [songMixin],
  name: 'musicList',
  data () {
    return {
      avatarHeight: ''
    }
  },
  props: {
    avatar: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    trackList: {
      type: Array,
      default: function () {
        return []
      }
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'songList': songList,
    'scroll': mScroll
  },
  mounted: function () {
    this.$nextTick(() => {
      this.avatarHeight = this.$refs.avatar.offsetHeight
      this.$refs.songlistContainer.style.top = this.avatarHeight + 'px'
      this.$refs.background.style.top = this.avatarHeight + 'px'
    })
  },
  methods: {
    listenScroll: function (data) {
      let height = parseInt(Math.abs(data.y))
      let x = this.avatarHeight + height
      let percent = x / this.avatarHeight
      if (data.y > 0) {
        this.$refs.avatar.style.transform = `scale(${percent})`
        this.$refs.avatar.style.paddingTop = 0
        this.$refs.avatar.style.height = x + 'px'
        this.$refs.background.style.top = x + 'px'
        return
      }
      if (this.avatarHeight - height <= 42) {
        this.$refs.songlistContainer.style.top = 42 + 'px'
        this.$refs.background.style.top = 42 + 'px'
        this.$refs.songlistContainer.style.overflow = 'hidden'
        return
      }
      this.$refs.songlistContainer.style.top = this.avatarHeight + 'px'
      this.$refs.songlistContainer.style.overflow = ''
      this.$refs.background.style.top = this.avatarHeight - height + 'px'
    },
    goback: function () {
      this.$router.back(-1)
    },
    clickItem: function (item, index) {
      console.log(item, index)
      this.selectTracks({list: this.trackList.slice(), index: index})
    },
    randomTracks () {
      this.selectRandomTracks({list: this.trackList})
    },
    handleSongs (newVal) {
      if (newVal.length) {
        this.$refs.songlistContainer.style.bottom = 60 + 'px'
        this.$refs.scroll.refresh()
      }
    },
    ...mapActions([
      'selectTracks',
      'selectRandomTracks'
    ])
  }
}
</script>

<style lang="scss" scoped>
.back{
  position:absolute;
  z-index:2;
  display: block;
  padding: 10px;
  font-size: $font-size-large-x;
  color: $color-theme;
}
.name{
  position:fixed;
  z-index:1;
  -text-align:center;
  width:100%;
  line-height: 40px;
  font-size: $font-size-large;
  color: $color-text;
}
.avatar-container{
  width:100%;
  padding-top:70%;
  position: relative;
  overflow:hidden;
  height:auto;
  transform-origin: top;
  transform: scale(1);
  position: relative;
}
.avatar-bg{
  position:absolute;
  width:100%;
  height:100%;
  background-color:rgba(7,17,27,0.4);
  z-index:1;
  top:0;
}
.avatar{
  width:100%;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
.play-container{
  position: absolute;
  top: 210px;
  z-index: 50;
  width: 100%;
  font-size: $font-size-large-x;
  color: $color-theme;
  text-align:center;
}
.player-border{
  box-sizing: border-box;
  width: 135px;
  padding: 7px 0;
  margin: 0 auto;
  border: 1px solid #ffcd32;
  border-radius: 100px;
  display:flex;
  justify-content: center;
}
.icon-play{
  display: inline-block;
  margin-right: 6px;
  font-size: $font-size-medium-x;
}
.play-text{
  display: inline-block;
  font-size: $font-size-small;
  line-height:16px;
}
.songlist-container{
  position: fixed;
  top:0px;
  width: 100%;
  bottom: 0px;
}
.songlistView{
  padding: 20px 30px;
  text-align: left;
}
.tracklist-background{
  position:fixed;
  width:100%;
  top:0;
  height:100%;
  background-color:black;
  z-index:-1;
  overflow:hidden;
}
</style>
