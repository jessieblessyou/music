<template>
  <div class="mSinger" ref="mSingerContainer">
    <scroll ref="scroll" @scroll="listenscroll" :data="singerList">
      <ul ref="singers">
        <li v-for="(singers,index) in singerList" :key="index" class="singers-container">
          <h1 class="category-index">{{singers.key}}</h1>
          <div v-for="(item,index) in singers.item" :key="index" class="singer-container" @click="selectItem(item)">
            <img v-lazy="item.avatar" class="singer-avatar" />
            <div class="singer-name">{{item.name}}</div>
          </div>
        </li>
      </ul>
      <div class="singer-taglist">
        <ul v-show="tagList.length">
          <li v-for="(item, index) in tagList" :key="index" class="taglist-item" :class="{active:tagCurrent==index}" @touchstart.stop.prevent="tagChange(index)" @touchmove.stop.prevent="tagMove($event)" :index="index">{{item}}</li>
        </ul>
      </div>
      <div class="category-index fixedtitle" v-show="fixedtitleShow" ref="fixedtitle">{{newfixedtitle}}</div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import {singerlist} from '@/api/singerlist.js'
import {Singer} from '@/common/js/singer.js'
import mScroll from '@/components/scroll/scroll'
import {mapMutations} from 'vuex'
import {songMixin} from '@/common/js/mixin.js'

export default {
  mixins: [songMixin],
  name: 'mSinger',
  components: {
    'scroll': mScroll
  },
  data: function () {
    return {
      singerList: [],
      tagList: [],
      tagCurrent: 0,
      currentTarget: [],
      titleCategory: [],
      titleHeight: [],
      scrollHeight: 0,
      fixedtitleShow: false
    }
  },
  mounted: function () {
    this.$nextTick(() => {
      this._getSingerlists()
      this._targetCount()
    })
  },
  computed: {
    newfixedtitle: function () {
      for (var i = 0; i < this.titleHeight.length; i++) {
        if (this.scrollHeight === 0) {
          return '热门'
        }
        if ((this.scrollHeight >= this.titleHeight[i]) && (this.scrollHeight < this.titleHeight[i + 1])) {
          let gap = this.titleHeight[i + 1] - this.scrollHeight
          this.fixedTitleMove(gap)
  				if (i === 0) {
            return '热门'
  				}
  				return this.tagList[i]
  			}
        if (!this.titleHeight[i + 1]) {
          this.fixedTitleMove('null')
  				return this.tagList[this.tagList.length - 1]
  			}
  		}
  	}
  },
  watch: {
    newfixedtitle: function (newval) {
      if (newval === '热门') {
        this.tagCurrent = 0
      } else {
        for (let i = 0; i < this.tagList.length; i++) {
          if (this.tagList[i] === newval) {
            this.tagCurrent = i
          }
        }
      }
    },
    $route(to,from){
      console.log(from, to)
    }
  },
  methods: {
  	_getSingerlists: function () {
    	singerlist(this).then(function (res) {
        this.singerList = this._normalize(res.body.data.list)
       	this._calHeight()
      }, function (res) {
        console.log(res)
      })
    },
    _normalize: function (list) {
    	let map = {
    		hot: {
	    		key: '热门',
	    		item: []
    		}
    	}
    	let left = {}
    	list.forEach((item, index) => {
    		if (!left[item.Findex]) {
    			left[item.Findex] = {key: item.Findex, item: []}
    		}
    		if (index < 10) {
    			let data = new Singer(item.Fsinger_mid, item.Fsinger_name)
    			map.hot.item.push(data)
    		}
  			if (left[item.Findex].key === item.Findex) {
  				let data = new Singer(item.Fsinger_mid, item.Fsinger_name)
  				left[item.Findex].item.push(data)
  			}
    	})
    	var maparr = []
    	var leftarr = []
    	for (let key in map) {
    		maparr.push(map[key])
    	}
      for (let key in left) {
    		leftarr.push(left[key])
    	}
    	for (var i = 0; i < leftarr.length; i++) {
    		let data = []
    		for (var j = 0; j < leftarr.length; j++) {
    			if (leftarr[i].key.charCodeAt() < leftarr[j].key.charCodeAt()) {
	    			data = leftarr[i]
	    			leftarr[i] = leftarr[j]
	    			leftarr[j] = data
    			}
    		}
    	}
    	maparr = maparr.concat(leftarr)
    	for (let key in maparr) {
    		this.tagList.push(maparr[key].key)
    	}
    	this.tagList[0] = this.tagList[0].substr(0, this.tagList[0].length - 1)
    	return maparr
    },
    _targetCount: function () {
    	this.currentTarget = this.$refs.singers.getElementsByTagName('li')
    },
    tagChange: function (key) {
    	let moveTarget = this.currentTarget
    	this.tagCurrent = key
    	this.$refs.scroll.scrollToElement(moveTarget[key])
    },
    tagMove: function (event) {
    	let moveTarget = this.currentTarget
    	var myLocation = event.changedTouches[0]
    	var realTarget = document.elementFromPoint(myLocation.clientX, myLocation.clientY)
    	var key = realTarget.getAttribute('index')
    	this.tagCurrent = key
    	if (!key) {
    		this.tagCurrent = 0
    	}
    	this.$refs.scroll.scrollToElement(moveTarget[key])
    },
    listenscroll: function (value) {
    	this._checkfixedTitleStatus(value.y)
    	this.scrollHeight = parseInt(Math.abs(value.y))
    },
    _calHeight: function () {
    	this.$nextTick(() => {
    		this.titleCategory = this.$refs.singers.getElementsByClassName('singers-container')
    		for (var i = 0; i < this.titleCategory.length; i++) {
    			this.titleHeight.push(this.titleCategory[i].offsetTop)
    		}
    	})
    },
    _checkfixedTitleStatus: function (value) {
    	if (value > 0) {
    		this.fixedtitleShow = false
    	} else {
    		this.fixedtitleShow = true
    	}
    },
    selectItem: function (singer) {
      console.log(singer)
    	this.$router.push({path: `/singer/${singer.mid}`})
    	this.setSinger(singer)
    },
    fixedTitleMove: function (gap) {
      if (gap === 'null') {
        this.$refs.fixedtitle.style.top = 0 + 'px'
        return
      }
      if (gap <= 30 && gap > 0) {
        this.$refs.fixedtitle.style.top = -(30 - gap) + 'px'
      } else {
        this.$refs.fixedtitle.style.top = 0 + 'px'
      }
    },
    handleSongs (newVal) {
      if (newVal.length) {
        this.$refs.mSingerContainer.style.bottom = 60 + 'px'
        this.$refs.scroll.refresh()
      }
    },
    ...mapMutations({
      setSinger: 'setSinger'
    })
  }
}
</script>

<style lang="scss">
.mSinger{
	color:white;
	position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  overflow:hidden;
}
.singers-container{
	padding-bottom: 30px;
}
.singer-container{
	padding: 20px 0 0 30px;
	display: flex;
	align-items:center;
}
.category-index{
	height: 30px;
  line-height: 30px;
  padding-left: 20px;
  font-size: $font-size-small;
  color: $color-text-l;
  background: $color-highlight-background;
  text-align: left;
}
.singer-avatar{
	width: 50px;
  height: 50px;
  border-radius: 50%;
}
.singer-name{
 	margin-left: 20px;
	color: $color-text-l;
	font-size: $font-size-medium;
}
.singer-taglist{
	position: absolute;
  top:50%;
  right:0;
  transform:translate(0%,-50%);
  text-align: center;
  font-family: Helvetica;
  padding: 20px 0;
  z-index:30;
  background: $color-background-d;
  border-radius: 10px;
  width:20px;
}
.taglist-item{
  padding: 3px;
  line-height: 1;
  color: $color-text-l;
  font-size: $font-size-small;
}
.taglist-item.active{
	color: $color-theme;
}
.fixedtitle{
	position: absolute;
	top:0;
	width:100%;
}
</style>
