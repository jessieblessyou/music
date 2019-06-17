<template>
	<transition name="slide">
	  <div class="userCenter">
	  	<div class="icon-back" @click="hide()"></div>
	  	<div class="switches-container">
	    	<switches @getIndex="toggleItem" :switchIndex="switchIndex" :itemname="switchNames"></switches>
	    </div>
	    <div class="switches-play" @click="randomPlay()">
	    	<i class="icon-play"></i>
        <span class="text">随机播放全部</span>
	    </div>
      <div class="switch-result">
	      <scroll v-show="switchIndex == 0">
	        <div class="switch-favoritePlay" v-show="switchIndex == 0">
	          <songlist :songList="favoriteHistory" @clickItem="getItem"></songlist>
	        </div>
	      </scroll>
	      <scroll v-show="switchIndex == 1">
	        <div class="switch-latestPlay" v-show="switchIndex == 1">
	            <songlist :songList="songHistory" @clickItem="getItem"></songlist>
	        </div>
	      </scroll>
    	</div>
	  </div>
  </transition>
</template>

<script>
import switches from '@/components/switchs/switchs'
import searchList from '@/components/searchList/searchList'
import songList from '@/components/songList/songList'
import mScroll from '@/components/scroll/scroll'
import {localTrackData} from 'common/js/tracklist.js'
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'mUserCenter',
  data () {
    return {
      switchIndex: 0,
      switchNames: ['我喜欢的', '最近听的']
    }
  },
  computed: {
    ...mapGetters([
      'favoriteHistory',
      'songHistory',
      'currentTrack'
    ])
  },
  components: {
    'switches': switches,
    'searchlist': searchList,
    'songlist': songList,
    'scroll': mScroll
  },
  methods: {
    hide () {
      this.$router.back(-1)
    },
    toggleItem (index) {
      this.switchIndex = index
    },
    getItem (item, index) {
      if (this.currentTrack.name === item.name) {
        return
      }
      let obj = localTrackData(item)
      this.selectTrack(obj)
    },
    randomPlay () {
      if (this.switchIndex === 0) {
        if (this.favoriteHistory.length === 0) {
          return
        }
        let arr = []
        for (let i = 0; i < this.favoriteHistory.length; i++) {
          arr.push(localTrackData(this.favoriteHistory[i]))
        }
        this.selectRandomTracks({list: arr})
      }
      if (this.switchIndex === 1) {
        if (this.songHistory.length === 0) {
          return
        }
        let arr = []
        for (let i = 0; i < this.songHistory.length; i++) {
          arr.push(localTrackData(this.songHistory[i]))
        }
        this.selectRandomTracks({list: arr})
      }
    },
    ...mapActions([
      'selectTrack',
      'selectRandomTracks'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.userCenter{
	position:fixed;
  top:0;
  bottom:0;
  left:0;
  width: 100%;
  height:100%;
  background: $color-background;
}
.slide-enter-active, .slide-leave-active {
  transition: left .5s
}
.slide-enter, .slide-leave-active {
  left: 100%;
}
.icon-back{
	position:fixed;
  display: block;
  left: 6px;
  margin-top:15px;
  font-size: $font-size-large-x;
  color: $color-theme;
}
.switches-container{
	display:flex;
	align-items:center;
	justify-content: center;
	margin: 10px 0 30px 0;
}
.switches-play{
  box-sizing: border-box;
  width: 135px;
  padding: 7px 0;
  margin: 0 auto;
  text-align: center;
  border: 1px solid  $color-text-l;
  color: $color-text-l;
  border-radius: 100px;
  font-size: 0;
}
.icon-play{
  display: inline-block;
  vertical-align: middle;
  margin-right: 6px;
  font-size: $font-size-medium-x;
}
.text{
  display: inline-block;
  vertical-align: middle;
  font-size: $font-size-small;
}
.switch-result{
  position: fixed;
  top: 104px;
  bottom: 0;
  width: 100%;
  overflow: hidden;
}
.switch-favoritePlay, .switch-latestPlay{
	padding: 20px 30px;
  text-align:left;
}
</style>
