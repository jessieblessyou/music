<template>
  <div class="mPlayer" v-show="trackList.length" ref="mPlayer" :class="fullScreen?'':'bgChange'">
	<transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
  	<div class="normal-player" v-show="fullScreen">
      <div class="normalPlayer-bg"><img :src="currentTrack.image" width="100%" height="100%"></div>
		  <i class="icon icon-back" @click="changeFullScreen()"></i>
		  <div class="top">
	  		<h1 class="top-player-title">{{currentTrack.name}}</h1>
	  		<div class="top-player-artist" v-if="currentTrack.singer">{{currentTrack.singer[0].name}}</div>
		  </div>
      <div class="middle" @touchstart="lyricstart($event)" @touchmove="lyricmove($event)" @touchend="lyricend($event)">
        <div class="middle-l" ref="middleL">
      		<div class="player-image" ref="playerImage">
    	  		<div class="image-border" :class="playing?'':'pause'">
    	  			<img :src="currentTrack.image">
    	  		</div>
      		</div>
          <div class="lyric-line-wrapper">
            <p class="lyric-line">{{currentLineLyric}}</p>
          </div>
        </div>
        <div class="lyric-container" ref="middleR">
          <scroll ref="scroll">
          <div>
            <p :class="{'current':currentLineNum === index}" v-for="(item,index) in currentLyric.lines" :key="index" ref="singleLineLyric">{{item.txt}}</p>
          </div>
          </scroll>
        </div>
      </div>
  		<div class="bottom">
        <div class="dot-wrapper">
          <div class="dot" :class="{'active': currentDot === 'cd'}"></div>
          <div class="dot" :class="{'active': currentDot === 'lyric'}"></div>
        </div>
        <div class="bottom-progress">
          <div class="progress-text">{{format(playCurrentTime)}}</div>
          <div class="progress-bar" ref="barWidth" @touchmove="barTouchMove($event)" @touchend="barTouchEnd($event)" @click="barClick($event)">
            <div class="progress-bar-wrapper" ref="barWrapper">
              <div class="progress-bar-icon" @touchstart="iconTouchStart($event)" ref="barIcon"></div>
            </div>
          </div>
          <div class="progress-text">{{format(currentTrack.duration)}}</div>
        </div>
	  		<div class="bottom-player-icon">
		  		<i :class="modeClass" @click="toggleMode()"></i>
	  			<i class="icon-prev" @click="prev()"></i>
	  			<i class="icon-play-size" @click="changePlaying()" :class="playing?'icon-pause':'icon-play'"></i>
	  			<i class="icon-next" @click="next()"></i>
	  			<i :class="favoriteClass(currentTrack)" @click="toggleFavorite(currentTrack)"></i>
  			</div>
  		</div>
  	</div>
  	</transition>
  	<transition name="mini">
	  	<div class="mini-player" v-show="!fullScreen" @click.stop="changeFullScreen()">
	  		<div class="bottom-left">
		  		<img class="bottom-player-image" :src="currentTrack.image" ref="bottomImage" :class="playing?'':'pause'"/>
		  		<div class="bottom-player-info">
		  			<div class="bottom-player-name">{{currentTrack.name}}</div>
		  			<div class="bottom-player-artist" v-if="currentTrack.singer">{{currentTrack.singer[0].name}}</div>
		  		</div>
	  		</div>
	  		<div class="bottom-player-icons bottom-right">
        <svg width="30" height="30" viewBox="0 0 100 100" class="progress-circle" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <circle r="50" cx="50" cy="50" class="progress-circle-border" fill="transparent" stroke-width="8px" stroke-dasharray="314" :stroke-dashoffset="strokeDashOffset"/>
        </svg>
	  			<div class="icon-play-mini" :class="playing?'icon-pause-mini':'icon-play-mini'" @click.stop.prevent="changePlaying()"></div>
	  			<div class="icon-playlist" @click.stop="togglePlaylistShow()"></div>
	  		</div>
	  	</div>
  	</transition>
    <playlist :dialogShow="playListShow"></playlist>
  	<audio :src="currentTrack.url" ref="audio" @canplay="ready($event)" @error="error()" @timeupdate="timeUpdate($event)" @ended="ended()"></audio>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import animations from 'create-keyframe-animation'
import mScroll from '@/components/scroll/scroll'
import mPlaylist from '@/components/playlist/playlist'
import {playMode} from '@/common/js/playMode'
import Lyric from 'lyric-parser'
import {playerMixin} from '@/common/js/mixin.js'

export default {
  mixins: [playerMixin],
  name: 'mPlayer',
  components: {
    'scroll': mScroll,
    'playlist': mPlaylist
  },
  data () {
    return {
      playReady: false,
      playCurrentTime: 0,
      playerLength: 0,
      barMoveState: false,
      barMoveStart: 0,
      barMoveEnd: 0,
      iconLeft: 0,
      trackPercent: 0,
      strokeDashOffset: 0,
      modeClass: 'icon-sequence',
      currentLineNum: '',
      currentLyric: '',
      currentLineLyric: '',
      lyricMoveState: false,
      lyricMoveStart: 0,
      lyricMoveEnd: 0,
      currentDot: 'cd',
      lyricReady: false,
      playListShow: false,
      msgInfo: '确认清空播放列表？'
    }
  },
  computed: {
  },
  watch: {
  	playing (newVal) {
      let audio = this.$refs.audio
  		this.$nextTick(() => {
	  		newVal ? audio.play() : audio.pause()
  		})
  	},
    currentTrack (newVal) {
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      this.lyricReady = true
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$refs.audio.play()
      }, 1000)
    }
  },
  props: {
    message: {
      type: String,
      default: '加载中……'
    }
  },
  mounted () {
  },
  methods: {
  	changeFullScreen () {
  		this.setFullScreen(!this.fullScreen)
  	},
  	changePlaying () {
      if (!this.playReady) {
        return
      }
      clearTimeout(this.timer1)
      this.timer1 = setTimeout(() => {
        this.setPlaying(!this.playing)
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      }, 200)
  	},
    togglePlaylistShow () {
      this.playListShow = !this.playListShow
    },
    prev () {
      if (!this.playReady) {
        return
      }
      let index = this.currentIndex - 1
      this.setCurrentIndex(index)
      this.setCurrentTrack(index)
      this.playReady = false
    },
    next () {
      let index = 0
      if (!this.playReady) {
        return
      }
      if ((this.trackList.length - 1) === this.currentIndex) {
        index = 0
      } else {
        index = this.currentIndex + 1
      }
      this.setCurrentIndex(index)
      this.setCurrentTrack(index)
      if (!this.playing) {
        this.changePlaying()
      }
      this.playReady = false
    },
    loop () {

    },
    getLyric () {
      let _this = this
      this.currentTrack.getLyrics().then((data) => {
        _this.currentLyric = new Lyric(data, ({lineNum, txt}) => {
          _this.currentLineNum = lineNum
          _this.currentLineLyric = txt
          let el = _this.$refs.singleLineLyric
          if (lineNum > 5) {
            _this.$refs.scroll.scrollToElement(el[lineNum - 5], 1000)
          } else {
            _this.$refs.scroll.scrollToElement(el[0], 1000)
          }
        })
        if (this.playing === true) {
          this.currentLyric.play()
        }
      })
    },
    lyricstart (e) {
      this.lyricMoveState = true
      this.lyricMoveStart = e.targetTouches[0].screenX
      console.log(e.targetTouches[0].screenX)
    },
    lyricmove (e) {
      if (!this.lyricMoveState) {
        return
      }
      this.$refs.middleR.style.transition = ''
      this.lyricMoveEnd = e.targetTouches[0].screenX
      let length = this.lyricMoveEnd - this.lyricMoveStart
      let movelength = 0
      let percent = 1
      if (length < 0 && length > (-window.innerWidth)) {
        movelength = window.innerWidth + length
        percent = movelength / window.innerWidth
      }
      if (length > 0 && length < window.innerWidth) {
        movelength = length
        percent = length / window.innerWidth
      }
      this.$refs.middleR.style.left = movelength + 'px'
      this.$refs.middleL.style.opacity = percent
    },
    lyricend (e) {
      if (!this.lyricMoveState) {
        return
      }
      let length = this.lyricMoveEnd - this.lyricMoveStart
      let maxLength = window.innerWidth * 0.1
      console.log(length, maxLength)
      if (Math.abs(length) > maxLength && length < 0) {
        this.$refs.middleR.style.transition = 'left 0.2s'
        this.$refs.middleL.style.transition = 'opacity 0.2s'
        this.$refs.middleR.style.left = 0 + 'px'
        this.$refs.middleL.style.opacity = 0
        this.currentDot = 'lyric'
      }
      if (Math.abs(length) > maxLength && length > 0) {
        this.$refs.middleR.style.transition = 'left 0.2s'
        this.$refs.middleL.style.transition = 'opacity 0.2s'
        this.$refs.middleR.style.left = window.innerWidth + 'px'
        this.$refs.middleL.style.opacity = 1
        this.currentDot = 'cd'
      }
    },
    ready (e) {
      this.playerLength = this.$refs.barWidth.offsetWidth - 16
      this.playReady = true
      this.setSingleSong(this.currentTrack)
      if (this.lyricReady) {
        this.getLyric()
      }
      this.lyricReady = false
    },
    error () {
      console.log('error')
      this.next()
    },
    ended () {
      if (this.mode === playMode.loop) {
        this.$refs.audio.loop = true
      } else {
        this.$refs.audio.loop = false
      }
      if (this.trackList.length === 1) {
        this.$refs.audio.play()
      } else {
        this.next()
      }
    },
    timeUpdate (e) {
      if (this.barMoveState === true) {
        return
      }
      if (this.playerLength < 0) {
        this.playerLength = this.$refs.barWidth.offsetWidth - 16
      }
      this.playCurrentTime = e.target.currentTime
      let percent = this.playCurrentTime / this.currentTrack.duration
      let moveLength = percent * this.playerLength
      this.barMove(moveLength)
      this.circleMove(percent)
      if (percent >= 1 && this.mode === playMode.loop) {
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
      }
    },
    format (data) {
      let min = parseInt(data / 60).toString().padStart(2, '0')
      let sec = parseInt(data % 60).toString().padStart(2, '0')
      let time = min + ':' + sec
      return time
    },
    barClick (e) {
      let percent = e.offsetX / this.playerLength
      let trackPosition = percent * this.currentTrack.duration
      this.$refs.audio.currentTime = trackPosition
      this.barMove(e.offsetX)
    },
    barTouchMove (e) {
      if (this.barMoveState === false) {
        return
      }
      this.barMoveEnd = e.targetTouches[0].pageX
      let iconMove = this.barMoveEnd - this.barTouchStart
      let data = iconMove + this.iconLeft
      if (data < 0 || data > this.playerLength) {
        return
      }
      this.barMove(data)
      this.trackPercent = data / this.playerLength
    },
    barTouchEnd (e) {
      let trackPosition = this.trackPercent * this.currentTrack.duration
      this.$refs.audio.currentTime = trackPosition
      if (!this.playing) {
        this.changePlaying()
      }
      if (this.currentLyric) {
        this.currentLyric.seek(trackPosition * 1000)
      }
      this.barMoveState = false
    },
    iconTouchStart (e) {
      this.barMoveState = true
      this.iconLeft = this.$refs.barIcon.offsetLeft
      this.barTouchStart = e.targetTouches[0].pageX
    },
    barMove (data) {
      this.$refs.barWrapper.style.width = data + 'px'
      this.$refs.barIcon.style.left = data + 'px'
    },
    circleMove (data) {
      this.strokeDashOffset = (1 - data) * 314
    },
  	enter (el, done) {
  		let data = this._calHeight()
  		animations.registerAnimation({
        name: 'move',
        animation: {
          0: {
            transform: `translate(-${data.x}px,${data.y}px) scale(0,0)`
          },
          60: {
          	transform: 'translate(0px,0px) scale(1.1,1.1)'
          },
          100: {
            transform: 'translate(0px,0px) scale(1,1)'
          }
        },
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      animations.runAnimation(this.$refs.playerImage, {
        name: 'move'
      }, done)
  	},
  	afterEnter (el, done) {
  		animations.unregisterAnimation('move')
      this.$refs.playerImage.animation = ''
  	},
  	leave (el, done) {
  		let data = this._calHeight()
  		animations.registerAnimation({
        name: 'move',
        animation: {
          0: {
            transform: 'translate(0px,0px) scale(1,1)'
          },
          100: {
            transform: `translate(-${data.x}px,${data.y}px) scale(0,0)`
          }
        },
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      animations.runAnimation(this.$refs.playerImage, {
        name: 'move'
      }, done)
  	},
  	afterLeave (el, done) {
  		animations.unregisterAnimation('move')
  		this.$refs.playerImage.animation = ''
  	},
  	_calHeight () {
  		var x = this.$refs.bottomImage.offsetLeft
  		var y = this.$refs.bottomImage.offsetWidth
  		var z = window.innerWidth
  		var x1 = this.$refs.playerImage.offsetTop - 20
  		var y1 = this.$refs.playerImage.clientHeight
  		var z1 = window.innerHeight
  		var w = z / 2 - x - (y / 2)
  		var w1 = z1 - x1 - (y1 / 2) - 10
  		return {
  			x: w,
  			y: w1
  		}
  	},
    ...mapActions([
      'setSingleSong'
    ])
  }
}
</script>

<style lang="scss" scoped>
.mPlayer{
	color:white;
	position: fixed;
  top:0;
  bottom: 50px;
  width:100%;
  height:100%;
  background-color:black;
}
.mPlayer.bgChange{
  bottom:50px;
  height: 0px;
}
.normalPlayer-bg{
	position:fixed;
	top:0;
	width:100%;
	height:100%;
	z-index: -1;
  opacity: 0.6;
  filter: blur(20px);
}
.top{
	margin-bottom:25px;
	opacity:1;
}
.icon{
	display: block;
  padding: 9px;
  transform: rotate(-90deg);
  position: absolute;
  top: 0;
  left: 6px;
  z-index: 50;
  font-size: $font-size-large-x;
  color: $color-theme;
}
.top-player-title{
  width: 70%;
  margin: 0 auto;
  line-height: 40px;
  text-align: center;
  font-size: $font-size-large;
  color: $color-text;
}
.top-player-artist{
  line-height: 20px;
  text-align: center;
  font-size: $font-size-medium;
  color: $color-text;
}
.middle{
  position: fixed;
  width: 100%;
  top: 80px;
  bottom: 170px;
  white-space: nowrap;
  font-size: 0;
}
.player-image{
	display: inline-block;
  vertical-align: top;
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 80%;
}
.image-border{
  width: 80%;
  height:100%;
  left:10%;
  box-sizing: border-box;
  border: 10px solid rgba(255,255,255,0.1);
  border-radius: 50%;
  position:absolute;
  top:0;
  animation:mymove 20s linear infinite;
}
.image-border.pause{
  animation-play-state:paused;
}
.player-image img{
	border-radius: 50%;
	position: absolute;
	left:0;
  top: 0;
  width: 100%;
  height: 100%;
}
.lyric-line-wrapper{
  width: 80%;
  margin: 30px auto 0 auto;
  overflow: hidden;
  text-align: center;
}
.lyric-line{
  height: 20px;
  line-height: 20px;
  color: $color-text-l;
  font-size: $font-size-medium;
}
.lyric-container{
  position:absolute;
  top:0;
  z-index:1;
  width:100%;
  height:100%;
  left: 375px;
  overflow: hidden;
  line-height: 32px;
  color: $color-text-l;
  font-size: $font-size-medium;
}
.lyric-container .current{
  color: $color-text;
}
.dot-wrapper{
  text-align: center;
  font-size: 0;
}
.dot{
  display: inline-block;
  vertical-align: middle;
  margin: 0 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: $color-text-l;
}
.dot.active{
  width: 20px;
  border-radius: 5px;
  background: $color-text-ll;
}
.bottom{
	position: absolute;
  bottom: 50px;
  width: 100%;
  display:flex;
  flex-direction:column;
  align-items:center;
}
.bottom-progress{
  width:80%;
  display:flex;
  align-items:center;
  padding-top:10px;
  padding-bottom:10px;
}
.progress-text{
  color: #fff;
  font-size: 12px;
  line-height:30px;
  width:30px;
}
.progress-bar{
  height:3px;
  background-color: rgba(0,0,0,0.3);;
  flex:1;
  margin-left:5px;
  margin-right:5px;
  position:relative;
}
.progress-bar-wrapper{
  left:0px;
  position:absolute;
  background-color:$color-theme;
  height: 3px;
}
.progress-bar-icon{
  position: absolute;
  top: -6px;
  -left: 7px;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  border: 3px solid #fff;
  border-radius: 50%;
  background: #ffcd32;
}
.bottom-player-icon{
	display: flex;
  justify-content: space-between;
  align-items: center;
  color:$color-theme;
  font-size: 30px;
  line-height: 40px;
  padding-left:10px;
  padding-right:10px;
  width:80%;
}
.icon-play-size{
	font-size:40px;
}
.icon-not-favorite{
  color:$color-theme;
}
.icon-favorite{
  color: $color-sub-theme;
}
.mini-player{
  display: flex;
  justify-content:space-between;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  width: 100%;
  height: 60px;
  background: $color-highlight-background;
}
.bottom-left{
	display:flex;
	align-items:center;
}
.bottom-player-image{
	flex: 0 0 40px;
  width: 40px;
  height:40px;
  margin: 0 10px 0 20px;
  border-radius: 50%;
  animation:mymove 20s linear infinite;
}
.bottom-player-image.pause{
  animation-play-state:paused;
}
.bottom-player-info{
	line-height:20px;
	text-align:left;
}
.bottom-player-name{
  margin-bottom: 2px;
  font-size: $font-size-medium;
  color: $color-text;
}
.bottom-player-artist{
	font-size: $font-size-small;
  color: $color-text-d;
}
.bottom-right{
	display:flex;
	align-items:center;
  color: $color-theme-d;
  font-size:30px;
}
.icon-play-mini{
	width:30px;
  height:30px;
	margin:0 10px;
}
.progress-circle{
  position:absolute;
  margin-left:10px;
  z-index:-1;
}
.progress-circle-border{
  stroke: $color-theme;
  transform: scale(0.9) rotate(-90deg);
  transform-origin: center;
  stroke-width: 10px;
}
.icon-playlist{
	width:30px;
	padding:0 10px;
}
.normal-enter-active, .normal-leave-active {
  transition: all 0.4s;
}
.normal-enter, .normal-leave-active {
  opacity: 0;
}
.normal-enter-active .top, .normal-leave-active .top{
	transition: all .4s;
}
.normal-enter .top, .normal-leave-active .top{
  transform: translate3d(0, -100px, 0);
}
.normal-enter-active .bottom, .normal-leave-active .bottom{
	transition: all 0.4s;
}
.normal-enter .bottom, .normal-leave-active .bottom{
  transform: translate3d(0, 100px, 0);
}

.mini-enter-active, .mini-leave-active {
  transition: all 0.4s;
}
.mini-enter, .mini-leave-active {
  opacity: 0;
}
@keyframes mymove
{
from {transform:rotate(0)}
to {transform:rotate(360deg)}
}
</style>
