<template>
  <div class="mSearch">
  	<div class="searchbox-container">
    <searchbox @getText="getQuery" :hotQuery="query" ref="searchbox"></searchbox>
    </div>
    <div class="shortcut-wrapper" ref="shortcutWrapper">
      <scroll ref="scroll">
        <div class="shortcut-wrapper11" v-show="!query">
    	    <div class="search-hotkey">
    	    	<h1 class="hotkey-title">热门搜索</h1>
    	    	<ul>
    	    		<li v-for="(item,index) in hotKeyList" class="hotkey-item" @click="getQuery(item.k)" :key="index">{{item.k}}</li>
    	    	</ul>
    	    </div>
          <div class="search-list-wrapper">
            <div class="searchList-top">
              <span>搜索历史</span>
              <span class="icon icon-clear" @click="clearHistory()"></span>
            </div>
            <searchList :searches="searchHistory" @delete="removeSingleSearchHistory" @queryOne="querySearchHistoryItem"></searchList>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query">
    	<suggest :query="query" @clearBlur="blur"></suggest>
    </div>
    <confirm :msgInfo="msgInfo" :cancelInfo="cancelInfo" :doneInfo="doneInfo" @done="clearSearchHistory" ref="confirmDialog"></confirm>
    <router-view></router-view>
    </div>
</template>

<script>
import searchBox from '@/components/searchBox/searchBox'
import suggest from '@/components/suggest/suggest'
import mScroll from '@/components/scroll/scroll'
import mConfirm from '@/components/confirm/confirm'
import searchList from '@/components/searchList/searchList'
import {searchHotKey} from '@/api/search.js'
import {songMixin} from '@/common/js/mixin.js'
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'mSearch',
  mixins: [songMixin],
  data () {
    return {
      hotKeyList: [],
      searchList: [],
      query: '',
      msgInfo: '确认清空所有搜索历史？',
      cancelInfo: '取消',
      doneInfo: '确认',
      confirmShow: false
    }
  },
  components: {
  	'searchbox': searchBox,
  	'suggest': suggest,
    'searchList': searchList,
    'scroll': mScroll,
    'confirm': mConfirm
  },
  computed: {
    ...mapGetters([
      'searchHistory',
      'fullScreen'
    ])
  },
  watch: {
    query (newQuery) {
      if (!newQuery) {
        this.$nextTick(() => {
          this.$refs.scroll.refresh()
        })
      }
    }
  },
  mounted () {
  	this._searchHotkey()
  },
  methods: {
  	_searchHotkey () {
	  	searchHotKey(this).then((res) => {
	  		console.log(res.body.data.hotkey)
	  		this.hotKeyList = res.body.data.hotkey.slice(0, 9)
	  		console.log(this.hotKeyList)
	  	}, (res) => {
	  		console.log(res)
	  	})
  	},
  	getQuery (txt) {
  		console.log(txt)
  		this.query = txt
  	},
    querySearchHistoryItem (item) {
      this.$refs.searchbox.setQuery(item)
    },
    clearHistory () {
      this.$refs.confirmDialog.open()
    },
    blur () {
      this.$refs.searchbox.blur()
    },
    handleSongs (newVal) {
      if (newVal.length) {
        this.$refs.shortcutWrapper.style.bottom = 60 + 'px'
        this.$refs.scroll.refresh()
      }
    },
    ...mapActions([
      'removeSingleSearchHistory',
      'clearSearchHistory',
      'saveSearch'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.mSearch{
	color:white;
	position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  overflow:hidden;
}
.searchbox-container{
	margin: 20px;
}
.shortcut-wrapper{
  -display: none;
  overflow:hidden;
  position:fixed;
  top: 168px;
  bottom:0;
}
.search-hotkey{
	margin: 0 20px 20px 20px;
	text-align: left;
}
.hotkey-title{
  margin-bottom: 20px;
  font-size: $font-size-medium;
  color: $color-text-l;
}
.hotkey-item{
  display: inline-block;
  padding: 5px 10px;
  margin: 0 20px 10px 0;
  border-radius: 6px;
  background: $color-highlight-background;
  font-size: $font-size-medium;
  color: $color-text-d;
}
.search-result{
  position: fixed;
  top: 178px;
  bottom: 0px;
  width: 100%;
  overflow:hidden;
}
.search-list-wrapper{
  position: relative;
  margin: 0 20px;
}
.searchList-top{
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  font-size: $font-size-medium;
  color: $color-text-l;
  overflow: hidden;
}
.icon{
  font-size: $font-size-medium;
  color: $color-text-d;
}
</style>
