<template>
  <div class="playlist" v-show="playListShow" @click="disableDialogShow()">
    <div class="playlist-container" @click.stop>
    	<div class="playlist-top">
    		<div class="top-left"><i class="icon" :class="modeClass" @click="toggleMode()"></i><span class="top-left-text">{{modeText}}</span></div>
    		<div class="top-right"><i class="icon-clear" @click="confirmDialogShow()"></i></div>
    	</div>
    	<div class="playlist-middle">
        <scroll ref="scroll" class="scrollHeight">
          <transition-group name="list" tag="ul">
        			<li class="middle-item middle-icon-color" v-for="(item, itemkey) in sequenceList" :key="item.id" ref="listItem">
        				<div class="middle-left">
    	    				<i class="middle-left-icon" :class="itemClass(item,itemkey)"></i>
    	    				<span class="middle-left-text" @click="pickupTrack(item,itemkey)">{{item.name}}</span>
        				</div>
        				<div class="middle-right">
    	    				<i class="middle-right-icon" :class="favoriteClass(item)" @click="toggleFavorite(item)"></i>
    	    				<i class="icon-delete" @click="deleteItem(item, itemkey)"></i>
        				</div>
        			</li>
            </transition-group>
        </scroll>
    	</div>
    	<div class="bottom-container">
	    	<div class="playlist-bottom">
	    		<i class="icon-add"></i>
	    		<span class="bottom-text" @click="addSongShow()">添加歌曲到队列</span>
	    	</div>
	    </div>
	    <div class="playlist-close" @click="disableDialogShow()">关闭</div>
    </div>
    <addsong ref="addSong"></addsong>
    <confirm :msgInfo="msgInfo" :cancelInfo="cancelInfo" :doneInfo="doneInfo" @done="clearAll" ref="confirmDialog"></confirm>
  </div>
</template>

<script>
import {playMode} from '@/common/js/playMode'
import mScroll from '@/components/scroll/scroll'
import addSong from '@/components/addSong/addSong'
import mConfirm from '@/components/confirm/confirm'
import {playerMixin} from '@/common/js/mixin.js'

export default {
  mixins: [playerMixin],
  name: 'mPlaylist',
  data () {
    return {
    	playListShow: false,
    	modeClass: 'icon-sequence',
    	modename: '顺序播放',
      msgInfo: '确认清空播放列表？',
      cancelInfo: '取消',
      doneInfo: '确认'
    }
  },
  props: {
  	dialogShow: {
  		type: Boolean,
  		default: false
  	}
  },
  components: {
    'scroll': mScroll,
    'addsong': addSong,
    'confirm': mConfirm
  },
  computed: {
  	modeText () {
  		if (this.mode === 1) {
  			return '单曲循环'
  		}
  		if (this.mode === 2) {
  			return '随机播放'
  		}
  		if (this.mode === 0) {
  			return '顺序播放'
  		}
  	}
  },
  watch: {
  	dialogShow (newVal) {
  		this.playListShow = true
  	},
    currentTrack (newVal) {
      console.log(this.currentTrack)
      const index = this.sequenceList.findIndex((song) => {
        return this.currentTrack.id === song.id
      })
      this.$nextTick(() => {
        this.$refs.scroll.scrollToElement(this.$refs.listItem[index])
      })
    }
  },
  methods: {
  	disableDialogShow () {
  		this.playListShow = false
  	},
    confirmDialogShow () {
      this.$refs.confirmDialog.open()
    },
    itemClass (item, itemkey) {
      if (this.mode === playMode.random) {
        if (item.id === this.currentTrack.id) {
          return 'icon-play'
        } else {
          return ''
        }
      }
      if (itemkey === this.currentIndex) {
        return 'icon-play'
      } else {
        return ''
      }
    },
    clearAll () {
      this.setTrackList([])
      this.setSequenceList([])
      this.setCurrentIndex(-1)
      this.setFullScreen(false)
      this.setPlaying(false)
      this.disableDialogShow()
    },
  	deleteItem (item, itemkey) {
      let originKey = itemkey
  		let arr = this.trackList
      let index = 0
      if (this.trackList.length === 1) {
        this.trackList.splice(originKey, 1)
        this.sequenceList.splice(originKey, 1)
        this.disableDialogShow()
        this.setCurrentIndex(-1)
        this.setPlaying(false)
        return
      }
      if (this.mode === playMode.random) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].id === item.id) {
            itemkey = i
          }
        }
      }
      if (this.currentIndex === itemkey) {
        for (var j = 0; j < arr.length; j++) {
          if (arr[j].id === item.id) {
            arr.splice(j, 1)
            index = j
          }
        }
      }

      if (itemkey === this.trackList.length) {
        index = this.currentIndex - 1
      }
      if (this.currentIndex < itemkey) {
        index = this.currentIndex
      }
      if (this.currentIndex > itemkey) {
        index = this.currentIndex - 1
      }

      this.sequenceList.splice(originKey, 1)
  	  this.setTrackList(arr)
      this.setCurrentTrack(index)
      this.setCurrentIndex(index)
      this.setPlaying(true)
  	},
    pickupTrack (item, itemkey) {
      let arr = this.trackList
      if (this.mode === playMode.random) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].id === item.id) {
            itemkey = i
          }
        }
      }
      this.setCurrentTrack(itemkey)
      this.setCurrentIndex(itemkey)
    },
    addSongShow () {
      this.$refs.addSong.show()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.playlist{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  height:100%;
  background-color: $color-background-d;
}
.playlist-container{
	position:absolute;
	left: 0;
  bottom: 0;
  width: 100%;
  background-color: $color-highlight-background;
  -max-height:200px;
}
.playlist-top{
  padding: 20px 30px 10px 20px;
  display:flex;
  align-items:center;
  justify-content: space-between;
}
.top-left{
	display: flex;
	align-items: center;
}
.top-left-text{
	font-size: $font-size-medium;
  color: $color-text-l;
}
.icon{
	margin-right: 10px;
  font-size: 30px;
  color: $color-theme-d;
}
.icon-clear{
	font-size: $font-size-medium;
  color: $color-text-d;
}
.playlist-middle{
	max-height:200px;
	overflow:hidden;
  -bottom:100px;
  position: relative;
}
.middle-item{
	display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0 30px 0 20px;
  overflow: hidden;
  color:$color-theme;
  font-size: $font-size-small;
}
.middle-left-icon{
  flex: 0 0 20px;
  display: inline-block;
  width: 20px;
  color: $color-theme-d;
}
.middle-left-text{
  font-size: $font-size-medium;
  color: $color-text-d;
}
.middle-right-icon{
	margin-right: 15px;
}
.icon-not-favorite{
	color:$color-theme;
}
.icon-favorite{
  margin-right: 15px;
  font-size: $font-size-small;
  color: $color-sub-theme;
}
.bottom-container{
	width: 140px;
  margin: 20px auto 30px auto;
}
.playlist-bottom{
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border: 1px solid $color-text-l;
  border-radius: 100px;
  color: $color-text-l;
}
.icon-add{
	margin-right: 5px;
  font-size: $font-size-small-s;
}
.bottom-text{
	font-size: $font-size-small;
}
.playlist-close{
  text-align: center;
  line-height: 50px;
  background: $color-background;
  font-size: $font-size-medium-x;
  color: $color-text-l;
}
.scrollHeight{
  max-height:200px;
}
.list-enter-active, .list-leave-active {
  transition: all 0.3s;
}
.list-enter, .list-leave-to{
  height: 0px;
}
</style>
